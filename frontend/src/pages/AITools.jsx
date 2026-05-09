import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, Brain, MessageSquare } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AITools = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am TaskMind AI. How can I help you with your projects and tasks today?' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const response = await api.post('/ai/chat', {
        message: input,
        history: history.slice(-5) // Send last 5 messages for context
      })

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }])
    } catch (error) {
      console.error('AI Chat Error:', error)
      toast.error('Failed to get AI response')
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">TaskMind AI Assistant</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Powered by Gemini 2.5 Flash
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                message.role === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${
                message.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your tasks or projects..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-center text-slate-400">
          AI can make mistakes. Verify important information.
        </p>
      </form>
    </div>
  )
}

export default AITools

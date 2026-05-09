import google.generativeai as genai
from app.core.config import settings

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
else:
    model = None

async def generate_task_description(title: str, context: str = "") -> str:
    if not model:
        return "AI features are currently disabled (API key missing)."
    
    try:
        prompt = f"You are an expert project manager. Generate a professional and detailed task description based on the following:\nTask Title: {title}\nContext: {context}"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating description: {str(e)}"

async def chat_with_ai(message: str, history: list = []) -> str:
    if not model:
        return "AI features are currently disabled (API key missing)."
    
    try:
        # Gemini chat uses a specific format for history
        chat = model.start_chat(history=[])
        
        # Convert OpenAI-style history to Gemini-style if needed, 
        # but for now, we'll just send the system context and the message
        system_context = "You are TaskMind AI, a helpful assistant integrated into a project management application. Help users with their tasks, projects, and general inquiries."
        
        full_prompt = f"{system_context}\n\nUser: {message}"
        response = chat.send_message(full_prompt)
        
        return response.text
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"

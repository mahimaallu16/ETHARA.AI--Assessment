import { useState, useEffect } from 'react'
import { User, Bell, Shield, Palette, Globe, Save, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const Settings = () => {
  const { user, fetchUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    bio: '',
    current_password: '',
    password: '',
    confirm_password: '',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    assignments: true,
    updates: false,
  })
  const [appearance, setAppearance] = useState({
    theme: 'light',
    accentColor: 'indigo',
    fontSize: 'medium',
  })
  const [language, setLanguage] = useState({
    locale: 'en-US',
    timezone: 'UTC',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        bio: user.bio || '',
        current_password: '',
        password: '',
        confirm_password: '',
      })
    }
  }, [user])

  const handleSave = async () => {
    if (activeTab === 'security' && formData.password) {
      if (formData.password !== formData.confirm_password) {
        toast.error('Passwords do not match!')
        return
      }
    }

    setIsSaving(true)
    try {
      const updateData = { ...formData }
      if (!updateData.password) {
        delete updateData.password
        delete updateData.current_password
        delete updateData.confirm_password
      }

      await api.put('/auth/profile', updateData)
      await fetchUser() 
      
      setFormData(prev => ({
        ...prev,
        current_password: '',
        password: '',
        confirm_password: '',
      }))
      
      toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings updated successfully!`)
    } catch (error) {
      console.error('Update Settings Error:', error)
      toast.error(error.response?.data?.detail || `Failed to update ${activeTab} settings.`)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notification setting updated!`)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab} Settings</h2>
            <p className="text-sm text-slate-500 mt-1">Manage your {activeTab} preferences and information.</p>
          </div>

          <div className="p-6 space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
                    <User className="w-10 h-10" />
                  </div>
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
                    Change Photo
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" 
                      value={formData.email}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Bio</label>
                    <textarea 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                      rows="3" 
                      placeholder="Tell us about yourself..." 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Receive updates about your tasks via email.' },
                  { id: 'push', label: 'Push Notifications', desc: 'Get real-time alerts on your desktop.' },
                  { id: 'assignments', label: 'Task Assignments', desc: 'Notify me when I am assigned to a new task.' },
                  { id: 'updates', label: 'Project Updates', desc: 'Get notified about major project milestones.' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${notifications[item.id] ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{item.label}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${notifications[item.id] ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {notifications[item.id] ? 'Enabled' : 'Disabled'}
                      </span>
                      <button 
                        onClick={() => toggleNotification(item.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${notifications[item.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg h-fit">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900">Notification Channels</h4>
                    <p className="text-xs text-amber-700 mt-0.5">We're currently expanding our notification options to include Slack and Microsoft Teams integration.</p>
                    <button className="mt-3 text-xs font-bold text-amber-900 underline underline-offset-4 hover:text-amber-800">Request Integration</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                      value={formData.current_password}
                      onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Min. 8 characters"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" 
                        value={formData.confirm_password}
                        onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                        placeholder="Repeat new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Active Sessions</h4>
                      <p className="text-xs text-slate-500">Manage and sign out of your active sessions on other devices.</p>
                    </div>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                      View All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900">Interface Theme</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setAppearance({ ...appearance, theme })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          appearance.theme === theme 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className={`w-full h-12 rounded-lg ${
                          theme === 'light' ? 'bg-white shadow-inner border border-slate-100' : 
                          theme === 'dark' ? 'bg-slate-800' : 
                          'bg-gradient-to-br from-white to-slate-800'
                        }`} />
                        <span className="text-xs font-medium capitalize">{theme}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900">Accent Color</h4>
                  <div className="flex gap-4">
                    {['indigo', 'blue', 'emerald', 'rose', 'amber'].map((color) => {
                      const colorMap = {
                        indigo: 'bg-indigo-600',
                        blue: 'bg-blue-600',
                        emerald: 'bg-emerald-600',
                        rose: 'bg-rose-600',
                        amber: 'bg-amber-600',
                      }
                      return (
                        <button
                          key={color}
                          onClick={() => setAppearance({ ...appearance, accentColor: color })}
                          className={`w-8 h-8 rounded-full ${colorMap[color]} transition-transform ${
                            appearance.accentColor === color ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-110'
                          }`}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900">Font Size</h4>
                  <div className="flex gap-2">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setAppearance({ ...appearance, fontSize: size })}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          appearance.fontSize === size 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Display Language</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                      value={language.locale}
                      onChange={(e) => setLanguage({ ...language, locale: e.target.value })}
                    >
                      <option value="en-US">English (United States)</option>
                      <option value="es-ES">Español (España)</option>
                      <option value="fr-FR">Français (France)</option>
                      <option value="de-DE">Deutsch (Deutschland)</option>
                      <option value="hi-IN">हिन्दी (भारत)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Timezone</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                      value={language.timezone}
                      onChange={(e) => setLanguage({ ...language, timezone: e.target.value })}
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg h-fit">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-900">Regional Formats</h4>
                    <p className="text-xs text-indigo-700 mt-0.5">Dates, times, and numbers will be formatted according to your selected language and region.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

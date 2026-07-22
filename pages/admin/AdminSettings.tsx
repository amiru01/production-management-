import React, { useState, useEffect, useCallback } from 'react'
import {
  Save,
  Building2,
  Bell,
  Shield,
  Globe,
  Slack,
  Smartphone,
  Clock,
  Upload,
  CheckCircle2,
  X,
  Link2,
  Link2Off,
  Loader2,
  Key,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react'
import { cn } from '../../utils'

const tabs = ['Company', 'Notifications', 'Security'] as const
type TabType = typeof tabs[number]

const tabIcons: Record<TabType, any> = {
  Company: Building2,
  Notifications: Bell,
  Security: Shield,
}

const API = 'http://localhost:3001/api'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
}

const notificationEvents = [
  'New project assignments',
  'Project status updates',
  'Expense approval requests',
  'Equipment check-in/out',
  'Report generation complete',
  'Client activity alerts',
]

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('Company')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogoUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png,image/jpeg,image/svg+xml'
    input.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage company settings, notifications, and security.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tabIcons[tab]
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} className={cn('flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300')}>
                  <Icon className="w-4 h-4" />
                  {tab}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'Company' && <CompanySettings onSave={handleSave} saved={saved} onLogoUpload={handleLogoUpload} />}
          {activeTab === 'Notifications' && <NotificationsSettings onSave={handleSave} saved={saved} />}
          {activeTab === 'Security' && <SecuritySettings onSave={handleSave} saved={saved} />}
        </div>
      </div>
    </div>
  )
}

function CompanySettings({ onSave, saved, onLogoUpload }: { onSave: () => void; saved: boolean; onLogoUpload: () => void }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">LM</div>
        <div>
          <p className="text-sm font-medium text-slate-900 mb-1">Company Logo</p>
          <p className="text-xs text-slate-500 mb-3">PNG, JPG or SVG. 500x500px recommended.</p>
          <button onClick={onLogoUpload} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4" />
            Upload Logo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
          <input type="text" defaultValue="Lumen Production Studio" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Tax ID / VAT</label>
          <input type="text" defaultValue="12-3456789" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
        <input type="text" defaultValue="123 Production Ave, Suite 200, Los Angeles, CA 90028" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
          <input type="text" defaultValue="Los Angeles" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
          <input type="text" defaultValue="CA" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">ZIP Code</label>
          <input type="text" defaultValue="90028" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">
          <Globe className="w-4 h-4 text-slate-400" />
          <input type="text" defaultValue="www.lumenstudio.com" className="flex-1 text-sm focus:outline-none bg-transparent" />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button onClick={onSave} className="bg-[#191970] hover:bg-[#121258] text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function NotificationsSettings({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  const [slackConnected, setSlackConnected] = useState(false)
  const [slackWebhook, setSlackWebhook] = useState('')
  const [slackEvents, setSlackEvents] = useState<string[]>([])
  const [showSlackModal, setShowSlackModal] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/settings/slack`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.connected) {
          setSlackConnected(true)
          setSlackWebhook(data.webhookUrl || '')
          setSlackEvents(data.events || [])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleConnect = async () => {
    if (!slackWebhook.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`${API}/settings/slack`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ webhookUrl: slackWebhook.trim(), events: slackEvents }),
      })
      const data = await res.json()
      if (res.ok) {
        setSlackConnected(true)
        setShowSlackModal(false)
        setTestResult(null)
      } else {
        setTestResult({ success: false, message: data.error || 'Failed to save' })
      }
    } catch {
      setTestResult({ success: false, message: 'Could not connect to server' })
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async () => {
    if (!slackWebhook.trim()) return
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch(`${API}/settings/slack/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ webhookUrl: slackWebhook.trim() }),
      })
      const data = await res.json()
      setTestResult(res.ok ? { success: true, message: data.message } : { success: false, message: data.error })
    } catch {
      setTestResult({ success: false, message: 'Could not reach server' })
    } finally {
      setTesting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await fetch(`${API}/settings/slack`, { method: 'DELETE', headers: getAuthHeaders() })
    } catch {}
    setSlackConnected(false)
    setSlackWebhook('')
    setSlackEvents([])
  }

  const toggleEvent = (event: string) => {
    setSlackEvents(prev =>
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h4 className="text-base font-semibold text-slate-900 mb-1">Email Notifications</h4>
        <p className="text-sm text-slate-500 mb-4">Configure which email notifications are sent to team members.</p>
        <div className="space-y-3">
          {notificationEvents.map((item, i) => (
            <label key={i} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">{item}</span>
              <div className="relative">
                <input type="checkbox" defaultChecked={i < 4} className="sr-only peer" />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-all peer-checked:after:translate-x-full cursor-pointer" />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <h4 className="text-base font-semibold text-slate-900 mb-1">Slack Integration</h4>
        <p className="text-sm text-slate-500 mb-4">Connect Slack workspace for real-time notifications.</p>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : slackConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Slack className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Slack Connected</p>
                  <p className="text-xs text-slate-500">Notifications will be sent to the configured Slack workspace</p>
                </div>
              </div>
              <button onClick={handleDisconnect} className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <Link2Off className="w-4 h-4" />
                Disconnect
              </button>
            </div>
            {slackEvents.length > 0 && (
              <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Active notification events</p>
                <div className="flex flex-wrap gap-2">
                  {slackEvents.map(event => (
                    <span key={event} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                      <Check className="w-3 h-3" />
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={() => { setShowSlackModal(true); setTestResult(null) }} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Edit Configuration
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <Slack className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Slack Workspace</p>
                <p className="text-xs text-slate-500">Not connected</p>
              </div>
            </div>
            <button onClick={() => { setShowSlackModal(true); setTestResult(null) }} className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
              <Link2 className="w-4 h-4" />
              Connect
            </button>
          </div>
        )}
      </div>

      {showSlackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSlackModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Slack className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Slack Integration</h3>
                  <p className="text-sm text-slate-500">Configure your Slack webhook</p>
                </div>
              </div>
              <button onClick={() => setShowSlackModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Webhook URL</label>
                <input
                  type="text"
                  value={slackWebhook}
                  onChange={e => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <p className="text-xs text-slate-400 mt-1">Create a webhook in Slack Apps &rarr; Incoming Webhooks</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Test Connection</label>
                <button
                  onClick={handleTestConnection}
                  disabled={testing || !slackWebhook.trim()}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                  {testing ? 'Testing...' : 'Send Test Message'}
                </button>
                {testResult && (
                  <div className={cn('flex items-center gap-2 mt-2 text-sm', testResult.success ? 'text-green-600' : 'text-red-600')}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    {testResult.message}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notification Events</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notificationEvents.map(event => (
                    <label key={event} className="flex items-center gap-3 py-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={slackEvents.includes(event)}
                        onChange={() => toggleEvent(event)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">{event}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">Select which events trigger Slack notifications</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <button onClick={() => setShowSlackModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={saving || !slackWebhook.trim()}
                className="bg-[#191970] hover:bg-[#121258] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                {saving ? 'Saving...' : slackConnected ? 'Update' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button onClick={onSave} className="bg-[#191970] hover:bg-[#121258] text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function SecuritySettings({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorSecret, setTwoFactorSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [show2faModal, setShow2faModal] = useState(false)
  const [twoFactorStep, setTwoFactorStep] = useState<'intro' | 'setup' | 'verify'>('intro')
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyError, setVerifyError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDisableConfirm, setShowDisableConfirm] = useState(false)
  const [disablePassword, setDisablePassword] = useState('')
  const [disabling, setDisabling] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/auth/2fa/status`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.enabled) setTwoFactorEnabled(true)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleEnable2FA = async () => {
    setGenerating(true)
    setTwoFactorStep('setup')
    try {
      const res = await fetch(`${API}/auth/2fa/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
      const data = await res.json()
      if (res.ok) {
        setTwoFactorSecret(data.secret)
        setQrCode(data.qrCode)
        setTwoFactorStep('verify')
      } else {
        setVerifyError(data.error || 'Failed to generate 2FA secret')
        setTwoFactorStep('intro')
      }
    } catch {
      setVerifyError('Could not connect to server')
      setTwoFactorStep('intro')
    } finally {
      setGenerating(false)
    }
  }

  const handleVerify2FA = async () => {
    if (!verifyCode.trim() || verifyCode.length < 6) {
      setVerifyError('Please enter a 6-digit verification code')
      return
    }
    setVerifying(true)
    setVerifyError('')
    try {
      const res = await fetch(`${API}/auth/2fa/verify`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ token: verifyCode.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setTwoFactorEnabled(true)
        setShow2faModal(false)
        setTwoFactorStep('intro')
        setVerifyCode('')
      } else {
        setVerifyError(data.error || 'Invalid code')
      }
    } catch {
      setVerifyError('Could not connect to server')
    } finally {
      setVerifying(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!disablePassword.trim()) return
    setDisabling(true)
    try {
      const res = await fetch(`${API}/auth/2fa/disable`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ password: disablePassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setTwoFactorEnabled(false)
        setTwoFactorSecret('')
        setQrCode('')
        setShowDisableConfirm(false)
        setDisablePassword('')
      } else {
        setVerifyError(data.error || 'Failed to disable 2FA')
      }
    } catch {
      setVerifyError('Could not connect to server')
    } finally {
      setDisabling(false)
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(twoFactorSecret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h4 className="text-base font-semibold text-slate-900 mb-1">Password Policy</h4>
        <p className="text-sm text-slate-500 mb-4">Set password requirements for all users.</p>
        <div className="space-y-3">
          {[
            { label: 'Minimum password length', value: '8', type: 'number' },
            { label: 'Require uppercase letters', value: '', type: 'toggle', checked: true },
            { label: 'Require special characters', value: '', type: 'toggle', checked: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">{item.label}</span>
              {item.type === 'toggle' ? (
                <div className="relative">
                  <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-all peer-checked:after:translate-x-full cursor-pointer" />
                </div>
              ) : (
                <input type="number" defaultValue={item.value} className="w-20 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200">
        <h4 className="text-base font-semibold text-slate-900 mb-1">Two-Factor Authentication</h4>
        <p className="text-sm text-slate-500 mb-4">Enhance security with 2FA for all admin accounts.</p>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        ) : twoFactorEnabled ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">2FA Enabled</p>
                <p className="text-xs text-slate-500">Your account is protected with two-factor authentication</p>
              </div>
            </div>
            <button onClick={() => setShowDisableConfirm(true)} className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              <Shield className="w-4 h-4" />
              Disable
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm font-medium text-slate-900">Authenticator App</p>
                <p className="text-xs text-slate-500">Configure using Google Authenticator or Authy</p>
              </div>
            </div>
            <button onClick={() => { setShow2faModal(true); setTwoFactorStep('intro'); setVerifyError('') }} className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
              <Key className="w-4 h-4" />
              Enable
            </button>
          </div>
        )}
      </div>

      {show2faModal && !twoFactorEnabled && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShow2faModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Set Up Two-Factor Authentication</h3>
                  <p className="text-sm text-slate-500">Secure your account with an authenticator app</p>
                </div>
              </div>
              <button onClick={() => setShow2faModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {twoFactorStep === 'intro' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    Two-factor authentication adds an extra layer of security to your account.
                    You'll need to enter a verification code from your authenticator app when signing in.
                  </p>
                </div>
                <ol className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">1</span>
                    Install Google Authenticator or Authy on your phone
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">2</span>
                    Scan the QR code or enter the secret key manually
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">3</span>
                    Enter the 6-digit verification code to confirm
                  </li>
                </ol>
                {verifyError && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    {verifyError}
                  </div>
                )}
                <button
                  onClick={handleEnable2FA}
                  disabled={generating}
                  className="w-full bg-[#191970] hover:bg-[#121258] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                  {generating ? 'Generating...' : 'Get Started'}
                </button>
              </div>
            )}

            {twoFactorStep === 'setup' && generating && (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
                <p className="text-sm text-slate-500">Generating your secret key...</p>
              </div>
            )}

            {twoFactorStep === 'verify' && qrCode && (
              <div className="space-y-5">
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48 border-2 border-slate-200 rounded-xl p-2" />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500 uppercase">Secret Key</span>
                    <button onClick={copySecret} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <code className="text-sm font-mono text-slate-800 break-all select-all">{twoFactorSecret}</code>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
                  <input
                    type="text"
                    value={verifyCode}
                    onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-center text-lg tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                {verifyError && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    {verifyError}
                  </div>
                )}

                <button
                  onClick={handleVerify2FA}
                  disabled={verifying || verifyCode.length < 6}
                  className="w-full bg-[#191970] hover:bg-[#121258] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  {verifying ? 'Verifying...' : 'Enable Two-Factor Authentication'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showDisableConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDisableConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Disable Two-Factor Authentication</h3>
                <p className="text-sm text-slate-500">This will make your account less secure</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4">Enter your password to confirm disabling 2FA.</p>

            <input
              type="password"
              value={disablePassword}
              onChange={e => setDisablePassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all mb-4"
            />

            {verifyError && (
              <div className="flex items-center gap-2 text-sm text-red-600 mb-4">
                <AlertTriangle className="w-4 h-4" />
                {verifyError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowDisableConfirm(false); setVerifyError('') }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDisable2FA}
                disabled={disabling || !disablePassword.trim()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {disabling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {disabling ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-slate-200">
        <h4 className="text-base font-semibold text-slate-900 mb-1">Session Timeout</h4>
        <p className="text-sm text-slate-500 mb-4">Automatically log users out after inactivity.</p>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-slate-400" />
          <select defaultValue="60" className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="240">4 hours</option>
            <option value="0">Never</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button onClick={onSave} className="bg-[#191970] hover:bg-[#121258] text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

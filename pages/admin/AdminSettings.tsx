import React, { useState } from 'react'
import {
  Save,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Slack,
  Smartphone,
  Clock,
  Upload,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '../../utils'

const tabs = ['Company', 'Notifications', 'Security', 'Billing'] as const
type TabType = typeof tabs[number]

const tabIcons: Record<TabType, any> = {
  Company: Building2,
  Notifications: Bell,
  Security: Shield,
  Billing: CreditCard,
}

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('Company')
  const [saved, setSaved] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, brand: 'Visa', last4: '4242', expires: '12/2027' },
  ])

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

  const handleRemovePayment = (id: number) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(p => p.id !== id))
    }
  }

  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentForm, setPaymentForm] = useState({ brand: '', last4: '', expires: '' })

  const handleAddPayment = () => {
    setShowPaymentForm(true)
    setPaymentForm({ brand: 'Visa', last4: '', expires: '' })
  }

  const handleSubmitPayment = () => {
    if (!paymentForm.last4 || !paymentForm.expires) return
    setPaymentMethods(prev => [...prev, { id: Date.now(), ...paymentForm }])
    setShowPaymentForm(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage company settings, notifications, security, and billing.</p>
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
          {activeTab === 'Company' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
                <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400">LM</div>
                <div>
                  <p className="text-sm font-medium text-slate-900 mb-1">Company Logo</p>
                  <p className="text-xs text-slate-500 mb-3">PNG, JPG or SVG. 500x500px recommended.</p>
                  <button onClick={handleLogoUpload} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
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
                <button onClick={handleSave} className="bg-[#191970] hover:bg-[#121258] text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h4 className="text-base font-semibold text-slate-900 mb-1">Email Notifications</h4>
                <p className="text-sm text-slate-500 mb-4">Configure which email notifications are sent to team members.</p>
                <div className="space-y-3">
                  {['New project assignments', 'Project status updates', 'Expense approval requests', 'Equipment check-in/out', 'Report generation complete', 'Client activity alerts'].map((item, i) => (
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
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Slack className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Slack Workspace</p>
                      <p className="text-xs text-slate-500">Not connected</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Connect</button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button onClick={handleSave} className="bg-[#191970] hover:bg-[#121258] text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h4 className="text-base font-semibold text-slate-900 mb-1">Password Policy</h4>
                <p className="text-sm text-slate-500 mb-4">Set password requirements for all users.</p>
                <div className="space-y-3">
                  {[
                    { label: 'Minimum password length', value: '8', type: 'number' },
                    { label: 'Require uppercase letters', value: '', type: 'toggle', checked: true },
                    { label: 'Require special characters', value: '', type: 'toggle', checked: true },
                    { label: 'Password expiry (days)', value: '90', type: 'number' },
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
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Authenticator App</p>
                      <p className="text-xs text-slate-500">Configure using Google Authenticator or Authy</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Enable</button>
                </div>
              </div>

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
                <button onClick={handleSave} className="bg-[#191970] hover:bg-[#121258] text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Billing' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h4 className="text-base font-semibold text-slate-900 mb-1">Subscription Plan</h4>
                <p className="text-sm text-slate-500 mb-4">Your current subscription and usage details.</p>
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-indigo-900">Pro Plan</p>
                      <p className="text-xs text-indigo-600 mt-0.5">$299 / month · 45 active users · 50GB storage</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-200 text-indigo-800">Active</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-base font-semibold text-slate-900 mb-1">Payment Methods</h4>
                <p className="text-sm text-slate-500 mb-4">Manage your payment methods.</p>
                {paymentMethods.map((pm) => (
                  <div key={pm.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 mb-3">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{pm.brand} ending in {pm.last4}</p>
                        <p className="text-xs text-slate-500">Expires {pm.expires}</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemovePayment(pm.id)} className="text-sm font-medium text-rose-600 hover:text-rose-700">Remove</button>
                  </div>
                ))}
                <button onClick={handleAddPayment} className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700">+ Add payment method</button>

                {showPaymentForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPaymentForm(false)}>
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Payment Method</h3>
                      <div className="space-y-3">
                        <select value={paymentForm.brand} onChange={e => setPaymentForm({...paymentForm, brand: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                          <option>Visa</option>
                          <option>Mastercard</option>
                          <option>Amex</option>
                        </select>
                        <input type="text" placeholder="Card number (last 4 digits)" maxLength={4} value={paymentForm.last4} onChange={e => setPaymentForm({...paymentForm, last4: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                        <input type="text" placeholder="Expiry (MM/YYYY)" value={paymentForm.expires} onChange={e => setPaymentForm({...paymentForm, expires: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setShowPaymentForm(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                        <button onClick={handleSubmitPayment} className="bg-[#191970] text-white px-4 py-2 rounded-lg text-sm font-medium">Add</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-base font-semibold text-slate-900 mb-1">Billing History</h4>
                <p className="text-sm text-slate-500 mb-4">View and download past invoices.</p>
                {['Oct 1, 2026', 'Sep 1, 2026', 'Aug 1, 2026'].map((date, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Invoice #{2026001 + i}</p>
                      <p className="text-xs text-slate-500">{date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-900">$299.00</span>
                      <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Download</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button onClick={handleSave} className="bg-[#191970] hover:bg-[#121258] text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

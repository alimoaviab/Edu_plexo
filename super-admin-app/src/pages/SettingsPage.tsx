import { AppIcon } from "shared/ui/AppIcon";
import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'

interface Settings {
  auto_approve_schools: boolean
  default_package_id: string
  trial_days: number
  skip_otp: boolean
}

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    auto_approve_schools: false,
    default_package_id: '',
    trial_days: 14,
    skip_otp: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    apiRequest('/api/super-admin/settings').then((res) => {
      if (res.ok && res.data) {
        setSettings({
          auto_approve_schools: false,
          default_package_id: '',
          trial_days: 14,
          skip_otp: false,
          ...(res.data as Partial<Settings>),
        })
      }
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const res = await apiRequest('/api/super-admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings)
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  if (loading) return <div className="p-12 text-center text-sm text-slate-400">Loading settings...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Platform Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure school registration, OTP verification, and approval behavior</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-8 px-4 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
        >
          <AppIcon name={saved ? 'check_circle' : 'save'} size={14} />
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      {/* School Registration Settings */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AppIcon name="GraduationCap" size={18} className="text-blue-600" />
            School Registration & Authentication
          </h3>
        </div>
        <div className="p-6 space-y-6">
          {/* Skip OTP Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50/40">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-[13px] font-bold text-slate-900 flex items-center gap-1.5">
                  <AppIcon name="verified" size={16} className={settings.skip_otp ? "text-emerald-600" : "text-slate-400"} />
                  Skip OTP (Direct Owner Creation)
                </h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${settings.skip_otp ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-600'}`}>
                  {settings.skip_otp ? 'SKIP OTP: ON (DIRECT ACCOUNT)' : 'SKIP OTP: OFF (GMAIL OTP)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {settings.skip_otp
                  ? 'Active: When a new owner clicks "Create Account", their account is created immediately with active status and login token. No 6-digit OTP email is sent to Gmail, eliminating email wait times.'
                  : 'Disabled: New signups receive a 6-digit verification OTP code via Brevo to their Gmail/email and must verify it before the account is activated.'}
              </p>
            </div>
            <button
              onClick={() => setSettings({...settings, skip_otp: !settings.skip_otp})}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings.skip_otp ? 'bg-emerald-600' : 'bg-slate-300'}`}
              title="Toggle Skip OTP"
              type="button"
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.skip_otp ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Auto Approve Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-[13px] font-bold text-slate-900">Auto Approve Schools</h4>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${settings.auto_approve_schools ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                  {settings.auto_approve_schools ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {settings.auto_approve_schools
                  ? 'New schools are automatically approved. Users can login immediately with trial package assigned.'
                  : 'New schools stay pending. Super admin approval required before login access.'}
              </p>
            </div>
            <button
              onClick={() => setSettings({...settings, auto_approve_schools: !settings.auto_approve_schools})}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings.auto_approve_schools ? 'bg-blue-600' : 'bg-slate-300'}`}
              type="button"
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${settings.auto_approve_schools ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Trial Days */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
            <div>
              <h4 className="text-[13px] font-bold text-slate-900 mb-0.5">Trial Duration</h4>
              <p className="text-[11px] text-slate-500">Number of free trial days for new schools</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.trial_days}
                onChange={(e) => setSettings({...settings, trial_days: Number(e.target.value)})}
                className="w-20 h-8 px-3 rounded-lg border border-slate-200 text-[12px] text-center outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-500">days</span>
            </div>
          </div>

          {/* Default Package */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">
            <div>
              <h4 className="text-[13px] font-bold text-slate-900 mb-0.5">Default Package ID</h4>
              <p className="text-[11px] text-slate-500">Package assigned to auto-approved schools</p>
            </div>
            <input
              type="text"
              value={settings.default_package_id}
              onChange={(e) => setSettings({...settings, default_package_id: e.target.value})}
              className="w-48 h-8 px-3 rounded-lg border border-slate-200 text-[12px] outline-none focus:border-blue-500"
              placeholder="Package ID"
            />
          </div>
        </div>
      </div>

      {/* Flow Description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AppIcon name="verified" size={18} className="text-emerald-600" />
            <h4 className="text-[12px] font-bold text-slate-900">Skip OTP Flow</h4>
          </div>
          <div className="space-y-2 text-[11px] text-slate-600">
            <p className="flex items-center gap-2"><span className="text-emerald-600 font-bold">1.</span> User fills signup form</p>
            <p className="flex items-center gap-2"><span className="text-emerald-600 font-bold">2.</span> Clicks "Create Account"</p>
            <p className="flex items-center gap-2"><span className="text-emerald-600 font-bold">3.</span> Direct owner account creation</p>
            <p className="flex items-center gap-2"><span className="text-emerald-600 font-bold">4.</span> Instant dashboard login (No Gmail OTP)</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AppIcon name="CheckCircle2" size={18} className="text-blue-600" />
            <h4 className="text-[12px] font-bold text-slate-900">Auto Approve = ON</h4>
          </div>
          <div className="space-y-2 text-[11px] text-slate-600">
            <p className="flex items-center gap-2"><span className="text-blue-600 font-bold">1.</span> School registered</p>
            <p className="flex items-center gap-2"><span className="text-blue-600 font-bold">2.</span> Auto approved instantly</p>
            <p className="flex items-center gap-2"><span className="text-blue-600 font-bold">3.</span> Free trial package assigned</p>
            <p className="flex items-center gap-2"><span className="text-blue-600 font-bold">4.</span> Immediate operational access</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AppIcon name="Pending" size={18} className="text-slate-500" />
            <h4 className="text-[12px] font-bold text-slate-900">Auto Approve = OFF</h4>
          </div>
          <div className="space-y-2 text-[11px] text-slate-600">
            <p className="flex items-center gap-2"><span className="text-slate-400 font-bold">1.</span> School signs up</p>
            <p className="flex items-center gap-2"><span className="text-slate-400 font-bold">2.</span> Status: Pending Approval</p>
            <p className="flex items-center gap-2"><span className="text-slate-400 font-bold">3.</span> Super admin reviews</p>
            <p className="flex items-center gap-2"><span className="text-slate-400 font-bold">4.</span> Login enabled after approval</p>
          </div>
        </div>
      </div>
    </div>
  )
}

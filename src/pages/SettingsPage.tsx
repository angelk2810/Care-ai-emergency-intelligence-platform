import React, { useState } from 'react';
import { Globe, Moon, Bell, Shield, User, Save } from 'lucide-react';

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    language: 'English',
    darkMode: false,
    notifications: true,
    emergencyContact: '',
    medicalProfile: ''
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-slate-500">Manage your preferences and medical profile.</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 font-bold text-slate-900">
            <Globe className="h-5 w-5 text-indigo-600" /> Preferences
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-700">Language</div>
                <div className="text-sm text-slate-400">Select your preferred language for triage.</div>
              </div>
              <select 
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700"
                value={settings.language}
                onChange={e => setSettings({ ...settings, language: e.target.value })}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-700">Dark Mode</div>
                <div className="text-sm text-slate-400">Toggle high-contrast dark theme.</div>
              </div>
              <button 
                onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                className={`relative h-6 w-11 rounded-full transition-colors ${settings.darkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 font-bold text-slate-900">
            <Shield className="h-5 w-5 text-red-600" /> Emergency Profile
          </h3>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Emergency Contact</label>
              <input 
                type="text"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="Name and Phone Number"
                value={settings.emergencyContact}
                onChange={e => setSettings({ ...settings, emergencyContact: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Permanent Medical History</label>
              <textarea 
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="List chronic conditions, allergies, or regular medications..."
                value={settings.medicalProfile}
                onChange={e => setSettings({ ...settings, medicalProfile: e.target.value })}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95">
            <Save className="h-5 w-5" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

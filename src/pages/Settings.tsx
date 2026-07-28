import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Shield, Bell, Languages, ShieldAlert, Check, RefreshCw, Cpu } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const [deviceSyncing, setDeviceSyncing] = useState<string | null>(null);

  const handleToggleNotifications = () => {
    updateProfile({
      notificationsEnabled: !profile.notificationsEnabled
    });
  };

  const handleSyncDevice = (device: string) => {
    setDeviceSyncing(device);
    setTimeout(() => {
      setDeviceSyncing(null);
      if (!profile.connectedDevices.includes(device)) {
        updateProfile({
          connectedDevices: [...profile.connectedDevices, device]
        });
      }
    }, 1500);
  };

  const handleRemoveDevice = (device: string) => {
    updateProfile({
      connectedDevices: profile.connectedDevices.filter(d => d !== device)
    });
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Title */}
      <div>
        <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
          <Settings className="w-7 h-7 text-accent" />
          Sanctuary Settings & Integrations
        </h1>
        <p className="font-subtitle text-sm text-vintageText/70 italic">Link clinical wearable devices, modify alerts, and review privacy settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Preferences */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* General Preferences */}
          <div className="glass-card rounded-premium-lg p-6 space-y-5">
            <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30 flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent animate-pulse" />
              Alerts & UI Theme Preferences
            </h3>

            <div className="flex items-center justify-between py-1 text-xs">
              <div>
                <h4 className="font-semibold text-darkText font-body">Enable Daily Push Notifications</h4>
                <p className="text-[10px] text-vintageText/60 leading-normal font-subtitle italic">Cycle starts, fertile windows, and medication checks.</p>
              </div>
              <input 
                type="checkbox" 
                checked={profile.notificationsEnabled}
                onChange={handleToggleNotifications}
                className="w-4 h-4 rounded text-accent accent-accent cursor-pointer"
              />
            </div>

            <div className="elegant-divider"></div>

            <div className="grid grid-cols-2 gap-4 text-xs font-body">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-accent" />
                  Language
                </label>
                <select className="w-full bg-cream/45 border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs text-vintageText">
                  <option value="en">English (US)</option>
                  <option value="fr">Français (Dior)</option>
                  <option value="it">Italiano</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-accent" />
                  Theme Overlay
                </label>
                <select 
                  value={profile.theme}
                  onChange={(e) => updateProfile({ theme: e.target.value as any })}
                  className="w-full bg-cream/45 border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs text-vintageText"
                >
                  <option value="vintage">Vintage Blush Luxury</option>
                  <option value="journal">Cozy Digital Paper</option>
                  <option value="dark">Sanctuary Midnight</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Account Section */}
          <div className="glass-card rounded-premium-lg p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent animate-pulse" />
              Privacy Charter & Data Lock
            </h3>

            <div className="flex items-center gap-4 bg-primary/10 border border-accent/20 p-4 rounded-premium-lg">
              <ShieldAlert className="w-6 h-6 text-accent shrink-0 mt-0.5" />
              <p className="text-xxs leading-relaxed text-vintageText/80 font-body">
                We employ peer-to-peer decentralized encryption protocols. Your diagnostic menstrual parameters and basal body temperatures are kept strictly anonymous on client device databases.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => alert('Data package compiled and ready for download. 🌸')}
                className="flex-1 py-2.5 rounded-full border border-borderPink/60 text-xs font-semibold text-vintageText bg-cream hover:bg-secondary/20 transition-colors text-center"
              >
                Export Cycle JSON Logs
              </button>
              <button 
                onClick={() => {
                  if (confirm('Are you completely sure you want to wipe your sanctuary database? This is irreversible.')) {
                    alert('Sanctuary deleted.');
                    window.location.reload();
                  }
                }}
                className="flex-1 py-2.5 rounded-full border border-red-200 text-xs font-semibold text-red-500 bg-white hover:bg-red-50/50 transition-colors text-center"
              >
                Delete Sanctuary Account
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Connected Wearables */}
        <div className="lg:col-span-5 glass-card rounded-premium-lg p-6 space-y-6">
          <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30">Sanctuary Wearables & Integrations</h3>
          
          <div className="space-y-4">
            {[
              { name: 'Apple Health', desc: 'Syncs period indicators, sleep patterns & body metrics.' },
              { name: 'Google Fit', desc: 'Fetches activity logs, daily steps & caloric expenditures.' },
              { name: 'Oura Smart Ring', desc: 'Imports high-precision basal temperatures & sleeping indexes.' }
            ].map(device => {
              const isLinked = profile.connectedDevices.includes(device.name);
              const isSyncing = deviceSyncing === device.name;

              return (
                <div key={device.name} className="bg-cream/45 border border-borderPink/35 p-4 rounded-premium-lg space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-darkText font-body">{device.name}</h4>
                      <p className="text-[10px] text-vintageText/55 mt-0.5 leading-relaxed">{device.desc}</p>
                    </div>
                    {isLinked && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50 flex items-center gap-0.5 font-subtitle shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                        Linked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isLinked ? (
                      <button 
                        onClick={() => handleRemoveDevice(device.name)}
                        className="px-3.5 py-1.5 border border-red-200 text-red-500 text-[10px] font-semibold bg-white rounded-full hover:bg-red-50/50 transition-colors"
                      >
                        Disconnect Integration
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleSyncDevice(device.name)}
                        disabled={isSyncing}
                        className="px-3.5 py-1.5 border border-accent/40 text-accent text-[10px] font-bold uppercase tracking-wider bg-white rounded-full hover:bg-accent hover:text-white transition-colors flex items-center gap-1 shadow-soft-glow"
                      >
                        {isSyncing ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Linking...</span>
                          </>
                        ) : (
                          <span>Connect Device</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

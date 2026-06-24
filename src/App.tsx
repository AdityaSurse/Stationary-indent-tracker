import React, { useState, useEffect } from 'react';
import { IndentData, AppSettings } from './types';
import { Step1ZoneSelection } from './components/Step1ZoneSelection';
import { Step2QuantityEntry } from './components/Step2QuantityEntry';
import { Step3ReportPreview } from './components/Step3ReportPreview';
import { SettingsModal } from './components/SettingsModal';
import { Settings } from 'lucide-react';

const initialData: IndentData = {
  zone: '',
  adminName: '',
  date: new Date().toISOString().split('T')[0],
  quantities: {},
  remarks: {},
  vendorEmail: 'vendor@mayfairtravels.com',
  senderEmail: 'admin@amul.coop',
};

export default function App() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<IndentData>(initialData);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({ theme: 'light' });

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const handleDataChange = (newData: Partial<IndentData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleRestart = () => {
    setData(initialData);
    setStep(1);
  };

  return (
    <div className={`flex flex-col h-screen w-full font-sans overflow-hidden print:h-auto print:overflow-visible transition-colors duration-200 ${
      settings.theme === 'dark' ? 'bg-gray-900 text-gray-100 dark' : 'bg-[#FAFAFA] text-[#1A1A1A]'
    }`}>
      {/* Top Branding Header */}
      <header className="bg-[#E31E24] h-16 flex items-center justify-between px-8 shadow-md flex-shrink-0 print:hidden z-10">
        <div className="flex items-center gap-4">
          <div className="bg-white px-3 py-1.5 rounded-sm flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Amul_official_logo.svg/250px-Amul_official_logo.svg.png" alt="Amul Logo" className="h-6 object-contain" />
          </div>
          <div className="h-8 w-[1px] bg-white/30"></div>
          <h1 className="text-white font-medium tracking-wide text-lg uppercase hidden sm:block">Pune Zone Stationery Indent Tracker</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-white/80 text-xs font-semibold uppercase tracking-widest hidden md:block">Internal Operations Tool</div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          {data.adminName && (
            <div className="bg-[#F7C948] h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm text-gray-900 uppercase">
              {data.adminName.substring(0, 2)}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 p-6 overflow-hidden print:p-0 print:overflow-visible print:block flex flex-col">
        {step === 1 && (
          <div className="h-full flex items-center justify-center overflow-auto pb-10">
            <Step1ZoneSelection
              data={data}
              onChange={handleDataChange}
              onNext={() => setStep(2)}
            />
          </div>
        )}
        {step === 2 && (
          <Step2QuantityEntry
            data={data}
            onChange={handleDataChange}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <div className="h-full overflow-auto pb-10">
            <Step3ReportPreview
              data={data}
              onChange={handleDataChange}
              onRestart={handleRestart}
            />
          </div>
        )}
      </main>

      {/* Bottom Status Bar */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 h-10 px-8 flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] flex-shrink-0 print:hidden transition-colors">
        <div>GCMMF LTD (AMUL) - PUNE ZONE STATIONERY INDENT SYSTEM v1.0</div>
        <div className="flex items-center gap-4">
          <span className="text-[#E31E24]">● ONLINE</span>
          <span>SYNCED: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </footer>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        onUpdateSettings={setSettings} 
      />
    </div>
  );
}

import React from 'react';
import { STATIONERY_ITEMS } from '../data';
import { IndentData } from '../types';
import { ArrowLeft, FileText } from 'lucide-react';

interface Props {
  data: IndentData;
  onChange: (data: Partial<IndentData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2QuantityEntry({ data, onChange, onNext, onBack }: Props) {
  const handleQuantityChange = (id: number, value: string) => {
    const qty = parseInt(value, 10);
    onChange({
      quantities: {
        ...data.quantities,
        [id]: isNaN(qty) ? 0 : Math.max(0, qty),
      },
    });
  };

  const handleRemarkChange = (id: number, value: string) => {
    onChange({
      remarks: {
        ...data.remarks,
        [id]: value,
      },
    });
  };

  const totalItemsSelected = Object.values(data.quantities).filter((q) => q > 0).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full print:hidden transition-colors">
      {/* Sidebar: Context & Progress */}
      <aside className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm transition-colors">
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Indent Session</h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Zone / Branch</span>
              <span className="text-sm font-bold text-[#E31E24] uppercase">{data.zone || 'Not Selected'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Name</span>
              <span className="text-sm font-semibold dark:text-gray-200">{data.adminName || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Indent Date</span>
              <span className="text-sm font-semibold dark:text-gray-200">{data.date || '-'}</span>
            </div>
            <div className="pt-2">
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-[#F7C948] h-1.5 rounded-full w-[66%]"></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Progress</span>
                <span className="text-[10px] font-bold text-[#E31E24] uppercase">Step 2 of 3</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFBEB] dark:bg-yellow-900/20 rounded-xl border border-[#FDE68A] dark:border-yellow-700/50 p-5 transition-colors">
          <h3 className="text-xs font-bold text-[#92400E] dark:text-yellow-500 mb-2">Instructions</h3>
          <p className="text-xs text-[#B45309] dark:text-yellow-600/80 leading-relaxed">
            Enter requested quantities for the current period. Items with zero quantity will be automatically excluded from the final report.
          </p>
        </div>

        <button 
          onClick={onBack}
          className="mt-auto flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Zone Selection
        </button>
      </aside>

      {/* Main Data Table Area */}
      <section className="lg:col-span-9 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden h-full transition-colors">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 transition-colors">
              <tr>
                <th className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-12 text-center">#</th>
                <th className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">Description</th>
                <th className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-24">Period</th>
                <th className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-24">Unit</th>
                <th className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-32">Quantity</th>
                <th className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 w-48">Remarks</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {STATIONERY_ITEMS.map((item, index) => {
                const isEven = index % 2 === 0;
                const rowClass = isEven ? "hover:bg-gray-50/50 dark:hover:bg-gray-700/50" : "bg-gray-50/30 dark:bg-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50";
                const qty = data.quantities[item.id] || 0;
                
                return (
                  <tr key={item.id} className={`${rowClass} transition-colors`}>
                    <td className="p-3 text-center text-gray-400 font-mono">{String(item.id).padStart(2, '0')}</td>
                    <td className={`p-3 font-medium ${qty > 0 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>{item.desc}</td>
                    <td className="p-3 text-xs text-gray-500 dark:text-gray-500">{item.period}</td>
                    <td className="p-3 text-xs dark:text-gray-400">{item.unit}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        value={data.quantities[item.id] || ''}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className={`w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-center font-bold outline-none transition-colors ${qty > 0 ? 'text-[#E31E24] focus:ring-1 focus:ring-[#E31E24]' : 'text-gray-400 dark:text-gray-500 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600'}`}
                        placeholder="0"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={data.remarks[item.id] || ''}
                        onChange={(e) => handleRemarkChange(item.id, e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors dark:text-gray-200"
                        placeholder="Optional"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Action Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between flex-shrink-0 transition-colors">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            {totalItemsSelected} Items added to indent
          </div>
          <button
            onClick={onNext}
            disabled={totalItemsSelected === 0}
            className="bg-[#F7C948] hover:bg-[#e6bb42] disabled:opacity-50 disabled:hover:bg-[#F7C948] disabled:cursor-not-allowed text-[#1A1A1A] font-bold py-3 px-8 rounded-xl shadow-lg shadow-yellow-200 dark:shadow-none transition-all flex items-center gap-2 text-sm"
          >
            Preview & Generate Indent Report
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </section>
    </div>
  );
}

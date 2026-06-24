import React from 'react';
import { ZONES } from '../data';
import { IndentData } from '../types';

interface Props {
  data: IndentData;
  onChange: (data: Partial<IndentData>) => void;
  onNext: () => void;
}

export function Step1ZoneSelection({ data, onChange, onNext }: Props) {
  const isFormValid = data.zone && data.adminName && data.date;

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden print:hidden flex flex-col transition-colors">
      <div className="bg-[#E31E24] p-6 text-white text-center flex-shrink-0">
        <div className="flex justify-center mb-3">
          <div className="bg-white p-2.5 rounded-lg inline-flex items-center justify-center shadow-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Amul_official_logo.svg/250px-Amul_official_logo.svg.png" alt="Amul Logo" className="h-10 object-contain" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Pune Zone</h1>
        <p className="text-red-100 mt-1 text-sm font-medium tracking-wide uppercase">Stationery Indent</p>
      </div>

      <div className="p-6 space-y-5 flex-1">
        <div>
          <label htmlFor="zone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Your Branch/Zone <span className="text-[#E31E24]">*</span>
          </label>
          <select
            id="zone"
            value={data.zone}
            onChange={(e) => onChange({ zone: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-[#E31E24] dark:text-white transition-colors"
            required
          >
            <option value="" disabled>-- Select a zone --</option>
            {ZONES.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Admin Name <span className="text-[#E31E24]">*</span>
          </label>
          <input
            type="text"
            id="adminName"
            value={data.adminName}
            onChange={(e) => onChange({ adminName: e.target.value })}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-[#E31E24] dark:text-white dark:placeholder-gray-400 transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Indent Date <span className="text-[#E31E24]">*</span>
          </label>
          <input
            type="date"
            id="date"
            value={data.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E31E24] focus:border-[#E31E24] dark:text-white transition-colors"
            required
          />
        </div>

        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="w-full mt-4 bg-[#F7C948] hover:bg-[#e6bb42] disabled:opacity-50 disabled:hover:bg-[#F7C948] disabled:cursor-not-allowed text-[#1A1A1A] font-bold py-3 px-4 rounded-xl shadow-lg shadow-yellow-200 dark:shadow-none transition-all flex items-center justify-center gap-2 text-sm"
        >
          Proceed to Items
        </button>
      </div>
    </div>
  );
}

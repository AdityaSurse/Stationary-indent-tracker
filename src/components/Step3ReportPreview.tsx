import React, { useState } from 'react';
import { STATIONERY_ITEMS } from '../data';
import { IndentData } from '../types';
import { Printer, Mail, PlusCircle, FileSpreadsheet, FileDown, Settings } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  data: IndentData;
  onChange: (data: Partial<IndentData>) => void;
  onRestart: () => void;
}

export function Step3ReportPreview({ data, onChange, onRestart }: Props) {
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const activeItems = STATIONERY_ITEMS.filter((item) => (data.quantities[item.id] || 0) > 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(16);
    doc.setTextColor(227, 30, 36); // Amul Red
    doc.text('GCMMF Ltd., Pune Zone', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text('Printing Stationery Indent', 105, 28, { align: 'center' });
    
    // Add Info
    doc.setFontSize(10);
    doc.text(`Branch: ${data.zone}`, 14, 40);
    doc.text(`Admin: ${data.adminName}`, 14, 46);
    doc.text(`Date: ${data.date}`, 150, 40);

    // Add Table
    const tableData = activeItems.map(item => [
      item.id,
      item.desc,
      item.unit,
      data.quantities[item.id],
      data.remarks[item.id] || ''
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Sr. No', 'Description', 'Unit', 'Qty Req', 'Remarks']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [227, 30, 36] }, // Amul Red
      styles: { fontSize: 9 },
      columnStyles: { 
        0: { cellWidth: 15 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 20 },
        3: { cellWidth: 20, halign: 'right' },
        4: { cellWidth: 40 }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 55;
    doc.setFontSize(10);
    doc.text(`Total Line Items: ${activeItems.length}`, 14, finalY + 10);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This indent is auto-generated. Please process at the earliest.', 14, finalY + 16);

    doc.save(`Indent_${data.zone}_${data.date}.pdf`);
  };

  const handleDownloadExcel = () => {
    // Generate simple CSV
    const headers = ['Sr. No', 'Description', 'Unit', 'Qty Req', 'Remarks'];
    const rows = activeItems.map(item => [
      item.id,
      `"${item.desc.replace(/"/g, '""')}"`, // escape quotes
      item.unit,
      data.quantities[item.id],
      `"${(data.remarks[item.id] || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Indent_${data.zone}_${data.date}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleEmail = () => {
    // Trigger downloads so user has the files ready to attach
    handleDownloadPDF();
    setTimeout(() => {
      handleDownloadExcel();
    }, 100);

    const emailBody = `Dear Vendor,\n\nPlease find attached the PDF and Excel files for the Printing Stationery Indent.\n\nBranch: ${data.zone}\nAdmin: ${data.adminName}\nDate: ${data.date}\nTotal line items: ${activeItems.length}\n\nKindly process the attached report at the earliest.\n\nRegards,\nGCMMF Ltd., Pune Zone`;

    const subject = `Stationery Indent – ${data.zone} – ${data.date}`;
    
    // Vendor is To, Sender is CC just to keep a copy
    const mailtoLink = `mailto:${data.vendorEmail || ''}?cc=${data.senderEmail || ''}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto print:max-w-none print:w-full transition-colors">
      
      {/* Action Buttons - Hidden on Print */}
      <div className="mb-6 flex flex-col gap-4 print:hidden">
        <div className="flex flex-wrap gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-[#E31E24] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <FileDown className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel (CSV)
          </button>
          <button
            onClick={handleEmail}
            className="flex items-center gap-2 bg-[#F7C948] hover:bg-yellow-500 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Mail className="w-4 h-4" />
            Draft Email
          </button>
          <button
            onClick={() => setShowEmailConfig(!showEmailConfig)}
            className={`flex items-center gap-2 font-medium py-2 px-3 rounded-md transition-colors ml-auto ${showEmailConfig ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
            title="Configure Emails"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {showEmailConfig && (
          <div className="bg-[#FFFBEB] dark:bg-yellow-900/20 p-5 rounded-xl border border-[#FDE68A] dark:border-yellow-700/50 shadow-sm transition-colors text-sm">
            <h3 className="font-bold text-[#92400E] dark:text-yellow-500 mb-3">Email Configuration</h3>
            <p className="text-[#B45309] dark:text-yellow-600/80 mb-4 mb-2 text-xs">
              Configure the receiver (vendor) and CC (your email / zonal officer) before drafting the email. 
              <br/><strong>Note:</strong> Browsers cannot automatically attach files to emails. Please download the PDF/Excel first and manually attach it to the drafted email.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor Email (To)</label>
                <input 
                  type="email" 
                  value={data.vendorEmail} 
                  onChange={e => onChange({ vendorEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F7C948] dark:text-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sender/Officer Email (CC)</label>
                <input 
                  type="email" 
                  value={data.senderEmail} 
                  onChange={e => onChange({ senderEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F7C948] dark:text-white transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 text-[#E31E24] hover:bg-red-50 dark:hover:bg-red-900/20 font-bold py-2 px-4 rounded-md transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
          >
            <PlusCircle className="w-4 h-4" />
            Start New Indent
          </button>
        </div>
      </div>

      {/* Printable Report Area */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 print:shadow-none print:border-none print:p-0 transition-colors">
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center justify-center gap-3 mb-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Amul_official_logo.svg/250px-Amul_official_logo.svg.png" alt="Amul Logo" className="h-12 object-contain" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide print:text-black">
              GCMMF Ltd., Pune Zone
            </h1>
          </div>
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 print:text-gray-800">Printing Stationery Indent</h2>
        </div>

        <div className="flex justify-between border-b-2 border-gray-800 dark:border-gray-600 pb-4 mb-6 print:border-black">
          <div>
            <p className="text-gray-600 dark:text-gray-400 print:text-black mb-1"><span className="font-semibold text-gray-800 dark:text-gray-200 print:text-black">Branch:</span> {data.zone}</p>
            <p className="text-gray-600 dark:text-gray-400 print:text-black"><span className="font-semibold text-gray-800 dark:text-gray-200 print:text-black">Admin:</span> {data.adminName}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 dark:text-gray-400 print:text-black"><span className="font-semibold text-gray-800 dark:text-gray-200 print:text-black">Date:</span> {data.date}</p>
          </div>
        </div>

        <table className="w-full text-left border-collapse mb-6">
          <thead>
            <tr className="border-b-2 border-gray-800 dark:border-gray-600 print:border-black">
              <th className="py-2 pr-4 font-semibold text-gray-800 dark:text-gray-200 print:text-black w-16">Sr. No</th>
              <th className="py-2 px-4 font-semibold text-gray-800 dark:text-gray-200 print:text-black">Description</th>
              <th className="py-2 px-4 font-semibold text-gray-800 dark:text-gray-200 print:text-black w-24">Unit</th>
              <th className="py-2 px-4 font-semibold text-gray-800 dark:text-gray-200 print:text-black text-right w-32">Qty Required</th>
              <th className="py-2 pl-4 font-semibold text-gray-800 dark:text-gray-200 print:text-black w-48">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700 print:divide-gray-400">
            {activeItems.map((item) => (
              <tr key={item.id} className="text-gray-800 dark:text-gray-200 print:text-black">
                <td className="py-3 pr-4">{item.id}</td>
                <td className="py-3 px-4 font-medium">{item.desc}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400 print:text-black">{item.unit}</td>
                <td className="py-3 px-4 text-right font-bold text-lg text-[#E31E24] dark:text-[#F7C948] print:text-black">{data.quantities[item.id]}</td>
                <td className="py-3 pl-4 text-gray-600 dark:text-gray-400 text-sm print:text-black">{data.remarks[item.id] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t-2 border-gray-800 dark:border-gray-600 print:border-black pt-4 flex justify-between items-center text-sm">
          <p className="font-semibold text-gray-800 dark:text-gray-200 print:text-black">Total Line Items: {activeItems.length}</p>
          <p className="text-gray-500 dark:text-gray-400 italic print:text-black">This indent is auto-generated. Please process at the earliest.</p>
        </div>
      </div>
    </div>
  );
}

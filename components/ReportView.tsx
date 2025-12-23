import React, { useState } from 'react';
import { Report } from '../types';
import { useAppContext } from '../App';
import { MapPin, User, FileCheck, X, Printer, Cpu, ZoomIn, Zap, Activity, Gauge } from 'lucide-react';

interface ReportViewProps {
  report: Report;
  onClose: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ report, onClose }) => {
  const { t, lang } = useAppContext();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Helper to normalize images to array
  const getImages = (img: string | string[] | null | undefined): string[] => {
    if (!img) return [];
    if (Array.isArray(img)) return img;

    // Handle JSON stringified arrays (from backend TEXT columns)
    if (typeof img === 'string') {
      if (img.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(img);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          // Not valid JSON, treat as single URL
        }
      }
      return [img];
    }

    return [];
  };

  const ImageGrid = ({ images, title, icon: Icon }: { images: string[], title: string, icon?: any }) => {
    if (images.length === 0) {
      return (
        <div className="space-y-2">
          {title && <h4 className="font-bold text-center text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1">{Icon && <Icon size={12} />} {title}</h4>}
          <div className="aspect-video bg-gray-50/50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400 text-xs font-medium">No Photos</div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {title && <h4 className="font-bold text-center text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1">{Icon && <Icon size={12} />} {title}</h4>}
        <div className={`grid ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {images.map((img, idx) => (
            <div key={idx} onClick={() => setZoomedImage(img)} className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-white/50 dark:border-gray-700 shadow-sm group cursor-zoom-in">
              <img src={img} alt={`${title} ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><ZoomIn size={24} /></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const mapUrl = report.location
    ? `https://www.google.com/maps?q=${report.location.lat},${report.location.lng}`
    : '#';

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // Helper to safely get parameter keys
  // Helper to safely get parameter keys
  const paramKeys = Array.from({ length: 31 }, (_, i) => `P07.${26 + i}`);
  const newInstallParams = [
    'P02.00', 'P02.01', 'P02.02', 'P02.03', 'P02.04', 'P02.05',
    'P08.53', 'P00.03', 'P00.04', 'P00.11', 'P05.05',
    'P05.01', 'P05.14', 'P15.05', 'P15.06', 'P15.07',
    'P15.08', 'P15.09', 'P01.08', 'P08.28', 'P08.29', 'P11.06'
  ];

  const isSpecialMode = report.maintenanceType === 'New Installation / تركيب جديد' || report.maintenanceType === 'Package Preparation / تجهيز بكج';
  const currentParamKeys = (isSpecialMode) ? newInstallParams : paramKeys;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-md z-50 overflow-y-hidden flex items-center justify-center p-4 print:p-0 print:bg-white print:fixed print:inset-0 print:z-[9999] print:h-screen print:w-screen animate-in fade-in duration-300">

        {/* Modal Container - Liquid Glass */}
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-2xl w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden print:shadow-none print:w-full print:h-full print:rounded-none border border-white/50 dark:border-white/10 animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] print:max-h-none relative">

          {/* Header - Fixed */}
          <div className="bg-gradient-to-r from-volt-700/90 to-volt-900/90 dark:from-volt-900/80 dark:to-black/80 p-6 text-white print:bg-white print:text-black print:p-0 print:mb-6 relative shrink-0 shadow-md z-10 backdrop-blur-md print:shadow-none print:border-b-2 print:border-gray-800">

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-200 print:hidden hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Print Only Logo */}
            <div className="hidden print:flex items-center justify-between mb-4">
              <img src="https://www2.0zz0.com/2025/12/16/13/625684600.png" alt="Qssun" className="h-16 object-contain" />
              <div className="text-right">
                <h1 className="text-2xl font-black text-volt-800 uppercase tracking-tighter">Qssun Energy</h1>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">After Sales Service Report</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2 md:mt-0 print:gap-0">
              <div>
                <h2 className="text-2xl font-bold tracking-tight print:hidden">{t.appSubtitle}</h2>
                <div className="print:hidden">
                  <p className="text-volt-200 text-xs font-mono tracking-wider mt-1 opacity-90">{t.reportId}: #{report.id.slice(0, 8).toUpperCase()}</p>
                </div>
                {/* Print ID display */}
                <div className="hidden print:block space-y-1">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Report Authorization</p>
                  <p className="text-base font-mono font-bold text-black">#{report.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
              <div className="text-start md:text-end print:text-right">
                <div className="font-bold text-lg text-white print:hidden">{report.technicianName}</div>
                <div className="text-xs text-volt-200 print:text-gray-500">{formatDate(report.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 space-y-6 print:p-0 text-gray-800 dark:text-gray-200 overflow-y-auto print:overflow-visible flex-1">

            {/* Section 1: Customer & Site */}
            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
              <div className="border border-white/40 dark:border-white/10 rounded-2xl p-4 bg-white/40 dark:bg-white/5 print:bg-transparent print:border-gray-800 print:border-2 print:rounded-none shadow-sm h-full">
                <h3 className="font-bold text-volt-700 dark:text-volt-400 print:text-black mb-3 flex items-center gap-2 border-b border-gray-200/50 dark:border-white/10 print:border-gray-800 pb-2 text-xs uppercase tracking-wider">
                  <User size={14} />
                  {t.step1}
                </h3>
                <div className="space-y-2.5 text-sm print:text-xs">
                  <p className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 print:text-gray-600">{t.customerName}:</span> <span className="font-bold text-gray-900 dark:text-white print:text-black">{report.customerName}</span></p>
                  <p className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 print:text-gray-600">{t.customerPhone}:</span> <span className="font-bold font-mono text-gray-900 dark:text-white print:text-black" dir="ltr">{report.customerPhone}</span></p>
                  <p className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 print:text-gray-600">{t.projectSize}:</span> <span className="font-bold bg-volt-50 dark:bg-volt-900/20 text-volt-700 dark:text-volt-300 print:bg-gray-100 print:text-black px-2 py-0.5 rounded text-xs">{report.projectSize} HP</span></p>
                  <p className="flex justify-between items-center"><span className="text-gray-500 dark:text-gray-400 print:text-gray-600">{t.projectType}:</span> <span className="font-bold text-gray-900 dark:text-white print:text-black">{report.maintenanceType}</span></p>
                </div>
              </div>

              <div className="border border-white/40 dark:border-white/10 rounded-2xl p-4 bg-white/40 dark:bg-white/5 print:bg-transparent print:border-gray-800 print:border-2 print:rounded-none shadow-sm h-full">
                <h3 className="font-bold text-volt-700 dark:text-volt-400 print:text-black mb-3 flex items-center gap-2 border-b border-gray-200/50 dark:border-white/10 print:border-gray-800 pb-2 text-xs uppercase tracking-wider">
                  <MapPin size={14} />
                  {t.location}
                </h3>
                <div className="space-y-2.5 text-sm print:text-xs">
                  <p className="flex items-center justify-between gap-2">
                    <span className="text-gray-500 dark:text-gray-400 print:text-gray-600">{t.location}:</span>
                    {report.location ? (
                      <a href={mapUrl} target="_blank" rel="noreferrer" className="text-volt-600 dark:text-volt-400 hover:underline hover:text-volt-700 print:no-underline print:text-black font-mono bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded border border-white/30 dark:border-white/10 print:border-0 print:bg-transparent">
                        {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                      </a>
                    ) : <span className="text-red-500">N/A</span>}
                  </p>
                  <div className="hidden print:block mt-4 text-[10px] text-gray-400">
                    * Location verified via GPS at time of report creation.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Technical Data (Parameters) */}
            <div className="border border-white/40 dark:border-white/10 rounded-2xl p-4 print:border-gray-800 print:border-2 print:rounded-none bg-white/30 dark:bg-white/5 print:bg-transparent shadow-sm">
              <h3 className="font-bold text-volt-700 dark:text-volt-400 print:text-black mb-4 flex items-center gap-2 text-xs uppercase tracking-wider border-b border-transparent print:border-gray-800 pb-2">
                <Cpu size={14} />
                {t.step3} (Parameters)
              </h3>

              {/* NEW: Update Info for New Installations */}
              {(report.updateName || report.updateType) && (
                <div className="mb-4 grid grid-cols-2 gap-4 p-3 rounded-xl bg-white/60 dark:bg-volt-900/10 border border-volt-100 dark:border-white/5 print:border-gray-400 print:border print:rounded-none">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide block font-bold">Update Name / اسم التحديث</span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white print:text-black">{report.updateName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide block font-bold">Update Type / نوع التحديث</span>
                    <span className="font-bold text-sm text-gray-900 dark:text-white print:text-black">{report.updateType}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 md:grid-cols-5 print:grid-cols-6 gap-2">
                {currentParamKeys.map((key) => {
                  const val = report.voltageReadings?.[key];
                  if (!val) return null; // Only show filled parameters in report view to save space
                  return (
                    <div key={key} className="bg-white/60 dark:bg-white/5 p-2 rounded-lg border border-white/50 dark:border-white/5 print:border-gray-400 print:rounded-none text-center hover:border-volt-200 transition-colors backdrop-blur-sm">
                      <div className="text-[9px] font-bold text-gray-500 mb-1">{key}</div>
                      <div className="font-mono font-bold text-sm text-gray-800 dark:text-white print:text-black break-words">{val}</div>
                    </div>
                  );
                })}
              </div>

              {/* Fallback if empty */}
              {(!report.voltageReadings || Object.keys(report.voltageReadings).length === 0) && (
                <div className="text-center text-gray-400 italic text-sm py-4 bg-gray-50/50 dark:bg-white/5 rounded-lg border border-dashed border-gray-300 dark:border-white/10 print:border-gray-400">No parameters recorded</div>
              )}

              {report.notes && (
                <div className="mt-6 p-4 bg-amber-50/50 dark:bg-amber-900/10 text-sm border-r-4 rtl:border-r-4 ltr:border-l-4 ltr:border-r-0 border-amber-400 dark:border-amber-600 print:bg-transparent print:border-gray-800 print:border text-black rounded-r-lg dark:text-gray-300 break-inside-avoid shadow-sm backdrop-blur-sm print:shadow-none">
                  <span className="font-bold text-amber-800 dark:text-amber-500 print:text-black uppercase text-xs tracking-wider mb-1 block">{t.techNotes}:</span>
                  {report.notes}
                </div>
              )}
            </div>

            {/* Section 3: Photos */}
            <div className={`grid gap-4 ${report.maintenanceType === 'New Installation / تركيب جديد' ? 'grid-cols-2' : 'grid-cols-2'} break-inside-avoid`}>
              {report.maintenanceType === 'New Installation / تركيب جديد' ? (
                <>
                  <ImageGrid images={getImages(report.photoVoltage)} title="Voltage" icon={Zap} />
                  <ImageGrid images={getImages(report.photoCurrent)} title="Current" icon={Zap} />
                  <ImageGrid images={getImages(report.photoFrequency)} title="Frequency" icon={Activity} />
                  <ImageGrid images={getImages(report.photoSpeed)} title="Speed" icon={Gauge} />
                </>
              ) : report.maintenanceType === 'Package Preparation / تجهيز بكج' ? (
                <>
                  <ImageGrid images={getImages(report.photoInverter)} title="Inverter" icon={Cpu} />
                  <ImageGrid images={getImages(report.photoWorkTable)} title="Work Table" icon={Zap} />
                </>
              ) : (
                <>
                  <ImageGrid images={getImages(report.photoBefore)} title={t.photoBefore} />
                  <ImageGrid images={getImages(report.photoAfter)} title={t.photoAfter} />
                </>
              )}
            </div>

            {/* Section 4: Signatures */}
            <div className="mt-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-8 print:mt-4 print:pt-4 print:border-gray-800 break-inside-avoid">
              <h3 className="font-bold text-volt-700 dark:text-volt-400 print:text-black mb-6 flex items-center gap-2 text-xs uppercase tracking-wider">
                <FileCheck size={14} />
                {t.step4}
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center print:break-inside-avoid bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-white/50 dark:border-white/5 shadow-sm print:border-gray-800 print:border-2 print:rounded-none">
                  <p className="text-xs font-bold mb-3 text-gray-400 print:text-gray-600 uppercase tracking-wider">
                    {report.maintenanceType === 'Package Preparation / تجهيز بكج'
                      ? (lang === 'ar' ? 'توقيع الفني المسؤول' : 'Responsible Technician Signature')
                      : t.signHere}
                  </p>
                  {report.customerSignature ? (
                    <div className="bg-white rounded-lg border border-dashed border-gray-200 p-2 print:border-0">
                      <img src={report.customerSignature} alt="Customer Sig" className="h-16 mx-auto object-contain mix-blend-multiply dark:mix-blend-normal" />
                    </div>
                  ) : <div className="h-16 border-b border-gray-300 dark:border-gray-600 flex items-end justify-center pb-2 text-gray-300 text-xs">No Signature</div>}
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 print:text-black mt-3">{report.customerName}</p>
                </div>

                <div className="text-center print:break-inside-avoid bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-white/50 dark:border-white/5 shadow-sm print:border-gray-800 print:border-2 print:rounded-none">
                  <p className="text-xs font-bold mb-3 text-gray-400 print:text-gray-600 uppercase tracking-wider">{t.techReview}</p>
                  <div className="h-16 flex items-center justify-center font-serif italic text-lg text-volt-800 dark:text-volt-300 print:text-black">
                    {report.technicianName}
                  </div>
                  <div className="h-px w-20 bg-gray-300 dark:bg-gray-600 mx-auto print:bg-gray-400"></div>
                  <p className="text-[10px] text-emerald-500 print:text-black font-bold uppercase tracking-widest mt-3 flex items-center justify-center gap-1">
                    <FileCheck size={10} /> Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-auto pt-6 border-t-2 border-gray-800 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600">Qssun Energy - شركة مدائن المستقبل للطاقة</p>
              <div className="mt-2 space-y-1">
                <p className="text-[10px] text-gray-400 italic">This document is electronically signed and authorized. Generated by Qssun System.</p>
                <p className="text-[10px] text-gray-400 font-bold">تم توقيع هذا المستند واعتماده إلكترونياً. تم إصداره بواسطة نظام Qssun After Sales.</p>
              </div>
            </div>

          </div>

          {/* Footer Actions - Hidden on Print */}
          <div className="bg-white/50 dark:bg-black/40 border-t border-white/50 dark:border-white/10 p-5 flex justify-end gap-3 print:hidden shrink-0 z-20 backdrop-blur-md">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 font-bold transition text-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10"
            >
              {t.close}
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-xl bg-volt-600 hover:bg-volt-700 dark:bg-volt-600 dark:hover:bg-volt-500 text-white font-bold shadow-lg shadow-volt-500/20 hover:shadow-volt-500/40 transition flex items-center gap-2 text-sm transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Printer size={16} />
              {t.print}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoomed Image Overlay */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300 print:hidden cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          >
            <X size={32} />
          </button>

          <img
            src={zoomedImage}
            alt="Zoomed View"
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg border border-white/10"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
    </>
  );
};

export default ReportView;
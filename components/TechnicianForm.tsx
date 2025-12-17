import React, { useState, useEffect } from 'react';
import { User, Report, GeoLocation } from '../types';
import { useAppContext } from '../App';
import { Camera, MapPin, Clock, Save, Loader2, StopCircle, CheckCircle2, ChevronRight, ChevronLeft, ImagePlus, Cpu, Zap, PenTool, User as UserIcon, Phone } from 'lucide-react';
import SignaturePad from './SignaturePad';

interface TechnicianFormProps {
  user: User;
  onSave: (report: Report) => void; // Keeps the prop signature, but we'll modify behavior
  onCancel: () => void;
}

const TechnicianForm: React.FC<TechnicianFormProps> = ({ user, onSave, onCancel }) => {
  const { t, dir, lang } = useAppContext();
  const [step, setStep] = useState(1);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for API submission
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [projectSize, setProjectSize] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('Urgent Fix / عطل طارئ');
  const [location, setLocation] = useState<GeoLocation | null>(null);
  
  const [photoBefore, setPhotoBefore] = useState<string | null>(null);
  const [photoAfter, setPhotoAfter] = useState<string | null>(null);
  
  const [voltageReadings, setVoltageReadings] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const paramKeys = Array.from({ length: 31 }, (_, i) => `P07.${26 + i}`);

  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date().toISOString());
    }
  }, [startTime]);

  const handleGetLocation = () => {
    setLoadingLoc(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: position.timestamp,
            accuracy: position.coords.accuracy
          });
          setLoadingLoc(false);
        },
        (error) => {
          console.error("Location error", error);
          alert(t.locationError);
          setLoadingLoc(false);
        }
      );
    } else {
      alert(t.locationError);
      setLoadingLoc(false);
    }
  };

  const addWatermark = (imageUrl: string, label: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; 
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(imageUrl); return; }

        ctx.drawImage(img, 0, 0);

        const fontSize = Math.max(24, img.width * 0.025);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';

        const dateStr = new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US');
        const companyName = "Qssun Energy - شركة مدائن المستقبل للطاقة";
        const devCredit = "DEV BY FAISAL ALNUTAYFI";
        
        const padding = fontSize;
        const x = padding;
        const y = img.height - padding;
        const lineHeight = fontSize * 1.4;

        ctx.fillText(devCredit, x, y);
        ctx.fillText(companyName, x, y - lineHeight);
        ctx.fillText(`${label} - ${dateStr}`, x, y - (lineHeight * 2));

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = imageUrl;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setPhoto: (s: string | null) => void, label: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setProcessingImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64 = reader.result as string;
        try {
          const watermarkedBase64 = await addWatermark(rawBase64, label);
          setPhoto(watermarkedBase64);
        } catch (error) {
          console.error("Watermark failed", error);
          setPhoto(rawBase64);
        } finally {
          setProcessingImage(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParamChange = (key: string, value: string) => {
    setVoltageReadings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const finishJob = () => {
    setEndTime(new Date().toISOString());
    setStep(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) return;
    
    setIsSubmitting(true);

    const newReport: Report = {
      id: crypto.randomUUID(), // Backend can also generate this, but fine for now
      technicianId: user.id,
      technicianName: user.name,
      customerName,
      customerPhone,
      projectSize,
      maintenanceType,
      startTime,
      endTime,
      location,
      photoBefore, // Base64 - Backend will upload to Cloudinary
      photoAfter,  // Base64 - Backend will upload to Cloudinary
      voltageReadings,
      notes,
      customerSignature: signature,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    try {
        // Determine URL based on environment (Development vs Production)
        // In development, you might run backend on port 3000 and frontend on 5173
        // In production on Render, they are the same origin.
        const apiUrl = (import.meta as any).env.DEV ? 'http://localhost:3000/api/reports' : '/api/reports';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newReport)
        });

        if (!response.ok) {
            throw new Error('Failed to submit report');
        }

        const savedReport = await response.json();
        onSave(savedReport); // Pass the server response back to App
    } catch (error) {
        console.error("Submission error:", error);
        alert("فشل في إرسال التقرير. يرجى التحقق من الاتصال بالإنترنت.");
        setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: t.step1 },
    { id: 2, label: t.step2 },
    { id: 3, label: t.step3 },
    { id: 4, label: t.step4 },
  ];

  if (isSubmitting) {
      return (
          <div className="flex flex-col items-center justify-center h-full animate-in fade-in">
              <div className="w-20 h-20 border-4 border-volt-100 border-t-volt-600 rounded-full animate-spin mb-6"></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">جاري رفع البيانات...</h2>
              <p className="text-gray-500">يرجى الانتظار، يتم الآن رفع الصور وحفظ التقرير.</p>
          </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 px-2 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {t.newReport}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-300 font-mono mt-1 flex items-center gap-2 bg-white/30 dark:bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm w-fit border border-white/20">
             <Clock size={14} className="text-volt-500"/>
             Started: {startTime ? new Date(startTime).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
          </div>
        </div>
        <button onClick={onCancel} className="bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 p-3 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors text-gray-400">
           <StopCircle size={24} />
        </button>
      </div>

      {/* Progress Steps Glass */}
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 dark:border-white/10 p-4 mb-6 shrink-0">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200/50 dark:bg-white/5 -z-0 rounded-full"></div>
          <div className="absolute top-1/2 right-0 h-1 bg-gradient-to-l from-volt-400 to-volt-600 -z-0 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(79,93,255,0.5)]" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

          {steps.map((s, idx) => {
             const isActive = s.id === step;
             const isCompleted = s.id < step;
             return (
               <div key={s.id} className="relative z-10 flex flex-col items-center cursor-pointer" onClick={() => {if(isCompleted) setStep(s.id)}}>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${
                   isActive ? 'bg-volt-600 text-white scale-110 ring-4 ring-volt-200/50 dark:ring-volt-900/50' : 
                   isCompleted ? 'bg-emerald-500 text-white' : 
                   'bg-white dark:bg-black/60 border-2 border-transparent text-gray-400'
                 }`}>
                   {isCompleted ? <CheckCircle2 size={20} /> : s.id}
                 </div>
                 <span className={`text-[10px] mt-2 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm transition-colors ${
                   isActive ? 'bg-volt-100/80 text-volt-700 dark:bg-volt-900/30 dark:text-volt-300' : 'text-gray-500 dark:text-gray-400'
                 }`}>{s.label}</span>
               </div>
             )
          })}
        </div>
      </div>

      {/* Glass Form Container */}
      <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/60 dark:bg-black/40 border border-white/50 dark:border-white/10 rounded-[2.5rem] shadow-xl p-6 md:p-8 flex-1 relative overflow-y-auto transition-all duration-300">
        
        {/* STEP 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 pb-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide group-focus-within:text-volt-600 transition-colors flex items-center gap-1.5">
                   <UserIcon size={12} /> {t.customerName}
                </label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-volt-500/50 focus:border-volt-500 dark:text-white transition-all font-medium placeholder-gray-400 focus:bg-white dark:focus:bg-black/50" required />
              </div>

              <div className="space-y-2 group">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide group-focus-within:text-volt-600 transition-colors flex items-center gap-1.5">
                   <Phone size={12} /> {t.customerPhone}
                </label>
                <input type="tel" dir="ltr" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-volt-500/50 focus:border-volt-500 dark:text-white transition-all font-medium text-right font-mono placeholder-gray-400 focus:bg-white dark:focus:bg-black/50" required />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide group-focus-within:text-volt-600 transition-colors">{t.projectType}</label>
              <div className="relative">
                <select value={maintenanceType} onChange={e => setMaintenanceType(e.target.value)} className="w-full bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-volt-500/50 focus:border-volt-500 dark:text-white transition-all appearance-none font-medium focus:bg-white dark:focus:bg-black/50">
                    <option>Urgent Fix / عطل طارئ</option>
                    <option>Regular Maintenance / صيانة دورية</option>
                    <option>New Installation / تركيب جديد</option>
                    <option>Technical Inspection / فحص فني</option>
                </select>
                <div className="absolute top-1/2 right-4 rtl:right-auto rtl:left-4 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronLeft className="rotate-90 rtl:-rotate-90" size={16}/>
                </div>
              </div>
            </div>

             <div className="space-y-2 group">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide group-focus-within:text-volt-600 transition-colors flex items-center gap-1.5">
                <Zap size={12} /> {t.projectSize}
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={projectSize} 
                  onChange={e => setProjectSize(e.target.value)} 
                  className="w-full bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-4 pl-16 rtl:pl-4 rtl:pr-16 outline-none focus:ring-2 focus:ring-volt-500/50 focus:border-volt-500 dark:text-white transition-all font-medium focus:bg-white dark:focus:bg-black/50" 
                  placeholder="e.g. 500"
                  required 
                />
                <div className="absolute top-0 left-0 rtl:left-auto rtl:right-0 h-full w-14 flex items-center justify-center bg-gray-100/50 dark:bg-white/5 border-r rtl:border-r-0 rtl:border-l border-gray-200 dark:border-white/10 rounded-l-xl rtl:rounded-l-none rtl:rounded-r-xl text-xs font-bold text-gray-500 backdrop-blur-sm">
                  <span className="flex items-center gap-1">
                    HP
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
               <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3 block flex items-center gap-1.5">
                 <MapPin size={12} /> {t.location}
               </label>
               <button 
                  type="button" 
                  onClick={handleGetLocation} 
                  disabled={loadingLoc}
                  className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 transition-all border font-bold ${
                    location 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10' 
                    : 'bg-white/70 dark:bg-black/30 border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 shadow-sm'
                  }`}
               >
                 {loadingLoc ? <Loader2 className="animate-spin" /> : location ? <CheckCircle2 /> : <MapPin />}
                 {location ? t.locationSuccess : t.getLocation}
               </button>
            </div>
            
            {/* Step 1 Actions */}
            <div className="flex justify-end pt-4">
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                disabled={!customerName || !customerPhone || !projectSize || !location}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-xl shadow-gray-200 dark:shadow-none"
              >
                {t.next} {dir === 'rtl' ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Photos */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-300 pb-2">
            
            {processingImage && (
              <div className="absolute inset-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center flex-col gap-2">
                 <Loader2 className="animate-spin text-volt-600" size={32} />
                 <span className="text-xs font-bold text-volt-600 dark:text-volt-400">Processing & Watermarking...</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700 dark:text-white">{t.photoBefore}</label>
                    {photoBefore && <span className="text-xs text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Captured</span>}
                 </div>
                 <div className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-white/30 dark:bg-black/20 overflow-hidden group hover:border-volt-400 transition-colors shadow-inner">
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, setPhotoBefore, 'BEFORE WORK')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {photoBefore ? (
                      <img src={photoBefore} alt="Before" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-volt-500 transition-colors">
                         <Camera size={32} className="mb-2" />
                         <span className="text-xs font-bold uppercase tracking-wider">{t.tapToCapture}</span>
                      </div>
                    )}
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700 dark:text-white">{t.photoAfter}</label>
                    {photoAfter && <span className="text-xs text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Captured</span>}
                 </div>
                 <div className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/20 bg-white/30 dark:bg-black/20 overflow-hidden group hover:border-volt-400 transition-colors shadow-inner">
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, setPhotoAfter, 'AFTER WORK')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {photoAfter ? (
                      <img src={photoAfter} alt="After" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-volt-500 transition-colors">
                         <ImagePlus size={32} className="mb-2" />
                         <span className="text-xs font-bold uppercase tracking-wider">{t.tapToCapture}</span>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-gray-500 dark:text-gray-400 font-bold px-6 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition"
              >
                {t.back}
              </button>
              <button 
                type="button" 
                onClick={() => setStep(3)} 
                disabled={!photoBefore || !photoAfter}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-xl shadow-gray-200 dark:shadow-none"
              >
                {t.next} {dir === 'rtl' ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Voltage & Notes */}
        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 pb-2">
            <div className="bg-volt-50/50 dark:bg-volt-900/10 border border-volt-100 dark:border-white/10 rounded-2xl p-4 flex items-start gap-3">
               <Cpu className="text-volt-600 dark:text-volt-400 mt-1 shrink-0" size={20} />
               <div>
                 <h4 className="font-bold text-volt-800 dark:text-volt-300 text-sm">Parameters (P07.26 - P07.56)</h4>
                 <p className="text-xs text-volt-600 dark:text-gray-400 mt-1">Enter available readings from the control panel.</p>
               </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2">
               {paramKeys.map((key) => (
                 <div key={key} className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-500 uppercase block text-center">{key}</label>
                   <input 
                      type="text" 
                      className="w-full bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg py-2 px-1 text-center font-mono text-sm focus:ring-1 focus:ring-volt-500 focus:bg-white dark:focus:bg-black/50 transition outline-none dark:text-white"
                      placeholder="-"
                      value={voltageReadings[key] || ''}
                      onChange={(e) => handleParamChange(key, e.target.value)}
                   />
                 </div>
               ))}
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{t.techNotes}</label>
               <textarea 
                  rows={3} 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)} 
                  className="w-full bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-volt-500/50 dark:text-white transition-all font-medium placeholder-gray-400 resize-none focus:bg-white dark:focus:bg-black/50"
                  placeholder="Any additional observations..."
               ></textarea>
            </div>

            <div className="flex justify-between pt-4">
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="text-gray-500 dark:text-gray-400 font-bold px-6 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition"
              >
                {t.back}
              </button>
              <button 
                type="button" 
                onClick={finishJob} 
                className="bg-volt-600 hover:bg-volt-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-volt-500/30"
              >
                <CheckCircle2 size={18} />
                {t.finishJob}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Signature */}
        {step === 4 && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 text-center pb-2">
             <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 mb-2">
                <PenTool size={32} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.signHere}</h3>
             <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">Please ask the customer to sign below to confirm job completion.</p>

             <div className="bg-white/60 dark:bg-white/5 p-4 rounded-2xl border border-white/50 dark:border-white/10 shadow-inner">
                <SignaturePad onEnd={setSignature} />
             </div>

             <div className="flex justify-between pt-6">
              <button 
                type="button" 
                onClick={() => setStep(3)} 
                className="text-gray-500 dark:text-gray-400 font-bold px-6 py-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition"
              >
                {t.back}
              </button>
              <button 
                type="submit" 
                disabled={!signature || isSubmitting}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-xl shadow-gray-200 dark:shadow-none"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {t.saveReport}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default TechnicianForm;
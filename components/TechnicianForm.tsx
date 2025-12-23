import React, { useState, useEffect } from 'react';
import { User, Report, GeoLocation } from '../types';
import { useAppContext } from '../App';
import { Camera, MapPin, Clock, Save, Loader2, StopCircle, CheckCircle2, ChevronRight, ChevronLeft, ImagePlus, Cpu, Zap, PenTool, User as UserIcon, Phone, Activity, Gauge, X, Plus } from 'lucide-react';
import SignaturePad from './SignaturePad';

interface TechnicianFormProps {
  user: User;
  onSave: (report: Report) => void; // Keeps the prop signature, but we'll modify behavior
  onCancel: () => void;
}

const PhotoUploadField = ({ label, icon, photos, setPhotos, uploadLabel, t, handlePhotoUpload, removePhoto }: any) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-gray-700 dark:text-white flex items-center gap-2">
          {icon && <span className="scale-75">{icon}</span>}
          {label}
        </label>
        {photos && photos.length > 0 && <span className="text-xs text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">{photos.length} Captured</span>}
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-2">
          {photos.map((p: string, i: number) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 group">
              <img src={p} alt="Thumbnail" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i, setPhotos)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Add Button */}
      {!showOptions ? (
        <button
          type="button"
          onClick={() => setShowOptions(true)}
          className="w-full bg-gray-50 dark:bg-gray-800/40 hover:bg-volt-50 dark:hover:bg-volt-900/10 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-volt-300 dark:hover:border-volt-700 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center group-hover:bg-volt-100 dark:group-hover:bg-volt-800 transition-colors">
            <Plus size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-volt-600 dark:group-hover:text-volt-300" />
          </div>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-hover:text-volt-600 dark:group-hover:text-volt-300">Add Photo / إضافة صورة</span>
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-in zoom-in-95 duration-200 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Choose Source</span>
            <button type="button" onClick={() => setShowOptions(false)}><X size={16} className="text-gray-400 hover:text-red-500" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Camera Option */}
            <div className="relative bg-volt-50 dark:bg-volt-900/10 hover:bg-volt-100 dark:hover:bg-volt-900/30 border border-volt-200 dark:border-volt-800 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => { handlePhotoUpload(e, setPhotos, uploadLabel); setShowOptions(false); }}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Camera size={24} className="text-volt-600 dark:text-volt-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-volt-700 dark:text-volt-300 uppercase">Camera</span>
            </div>

            {/* Gallery Option */}
            <div className="relative bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => { handlePhotoUpload(e, setPhotos, uploadLabel); setShowOptions(false); }}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <ImagePlus size={24} className="text-gray-500 dark:text-gray-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase">Album</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

  const [photoBefore, setPhotoBefore] = useState<string[]>([]);
  const [photoAfter, setPhotoAfter] = useState<string[]>([]);

  // New Installation Specific Photos
  const [photoVoltage, setPhotoVoltage] = useState<string[]>([]);
  const [photoCurrent, setPhotoCurrent] = useState<string[]>([]);
  const [photoFrequency, setPhotoFrequency] = useState<string[]>([]);
  const [photoSpeed, setPhotoSpeed] = useState<string[]>([]);

  // Package Preparation Photos
  const [photoInverter, setPhotoInverter] = useState<string[]>([]);
  const [photoWorkTable, setPhotoWorkTable] = useState<string[]>([]);

  const [voltageReadings, setVoltageReadings] = useState<Record<string, string>>({});
  const [isSystemUpdate, setIsSystemUpdate] = useState(false);
  const [updateName, setUpdateName] = useState('');
  const [updateType, setUpdateType] = useState('');
  const [notes, setNotes] = useState('');

  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const paramKeys = Array.from({ length: 31 }, (_, i) => `P07.${26 + i}`);
  const newInstallParams = [
    'P02.00', 'P02.01', 'P02.02', 'P02.03', 'P02.04', 'P02.05',
    'P08.53', 'P00.03', 'P00.04', 'P00.11', 'P05.05',
    'P05.01', 'P05.14', 'P15.05', 'P15.06', 'P15.07',
    'P15.08', 'P15.09', 'P01.08', 'P08.28', 'P08.29', 'P11.06'
  ];

  const isSpecialMode = maintenanceType === 'New Installation / تركيب جديد' || maintenanceType === 'Package Preparation / تجهيز بكج';
  const currentParamKeys = (isSpecialMode) ? newInstallParams : paramKeys;

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


  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setPhoto: React.Dispatch<React.SetStateAction<string[]>>, label: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProcessingImage(true);
      // Process one by one or all? Let's process the first one for now as the input is usually single selection unless multiple attr is set.
      // But user might want to add multiple. Let's support multiple selection in input if possible, but camera usually is one.
      // The requirement asks for "adding more than one image".

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const rawBase64 = reader.result as string;
          try {
            const watermarkedBase64 = await addWatermark(rawBase64, label);
            setPhoto(prev => [...prev, watermarkedBase64]);
          } catch (error) {
            console.error("Watermark failed", error);
            setPhoto(prev => [...prev, rawBase64]);
          } finally {
            setProcessingImage(false);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number, setPhoto: React.Dispatch<React.SetStateAction<string[]>>) => {
    setPhoto(prev => prev.filter((_, i) => i !== index));
  };

  const handleParamChange = (key: string, value: string) => {
    setVoltageReadings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const finishJob = () => {
    const readingCount = Object.values(voltageReadings).filter(v => v && v.trim() !== '').length;
    if (readingCount < 5) {
      alert(lang === 'ar' ? 'يجب إدخال 5 قراءات فولتية على الأقل' : 'Please enter at least 5 voltage readings');
      return;
    }
    setEndTime(new Date().toISOString());
    setStep(4);
  };

  const validateForm = () => {
    // 1. Phone Validation
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(customerPhone)) {
      alert(lang === 'ar' ? 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام' : 'Phone must start with 05 and be 10 digits');
      return false;
    }

    // 2. Project Size (Numeric)
    if (isNaN(Number(projectSize)) || !projectSize) {
      alert(lang === 'ar' ? 'حجم المشروع يجب أن يكون أرقاماً فقط' : 'Project size must be a number');
      return false;
    }

    // 3. Mandatory Fields
    if (!customerName || !maintenanceType || !location) {
      alert(lang === 'ar' ? 'يرجى تعبئة جميع الحقول المطلوبة (الاسم، النوع، الموقع)' : 'Please fill all required fields');
      return false;
    }

    // 4. Photos Mandatory
    const isNewInstall = maintenanceType === 'New Installation / تركيب جديد';
    const isPackagePrep = maintenanceType === 'Package Preparation / تجهيز بكج';

    if (isNewInstall) {
      if (photoVoltage.length === 0 || photoCurrent.length === 0 || photoFrequency.length === 0 || photoSpeed.length === 0) {
        alert(lang === 'ar' ? 'جميع صور القراءات (الجهد، التيار، التردد، السرعة) مطلوبة' : 'All reading photos (Voltage, Current, Frequency, Speed) are required');
        return false;
      }
    } else if (isPackagePrep) {
      if (photoInverter.length === 0 || photoWorkTable.length === 0) {
        alert(lang === 'ar' ? 'صور المحول وطاولة العمل مطلوبة' : 'Inverter and Work Table photos are required');
        return false;
      }
    } else {
      if (photoBefore.length === 0 || photoAfter.length === 0) {
        alert(lang === 'ar' ? 'الصور (قبل وبعد) مطلوبة' : 'Photos (Before & After) are required');
        return false;
      }
    }

    // 5. Voltage Readings (At least 5)
    const readingCount = Object.values(voltageReadings).filter(v => v && v.trim() !== '').length;
    if (readingCount < 5) {
      alert(lang === 'ar' ? 'يجب إدخال 5 قراءات فولتية على الأقل' : 'Please enter at least 5 voltage readings');
      return false;
    }

    // 6. Signature Mandatory
    if (!signature) {
      alert(lang === 'ar' ? 'توقيع العميل مطلوب' : 'Customer signature is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) return;

    if (!validateForm()) return; // Stop if validation fails

    setIsSubmitting(true);

    setIsSubmitting(true);

    const isNewInstall = maintenanceType === 'New Installation / تركيب جديد';
    const isPackagePrep = maintenanceType === 'Package Preparation / تجهيز بكج';
    const isSpecial = isNewInstall || isPackagePrep;

    const newReport: Report = {
      id: crypto.randomUUID(),
      technicianId: user.id,
      technicianName: user.name,
      customerName,
      customerPhone,
      projectSize,
      maintenanceType,
      startTime,
      endTime,
      location,
      photoBefore: isSpecial ? null : photoBefore,
      photoAfter: isSpecial ? null : photoAfter,
      photoVoltage: isNewInstall ? photoVoltage : null,
      photoCurrent: isNewInstall ? photoCurrent : null,
      photoFrequency: isNewInstall ? photoFrequency : null,
      photoSpeed: isNewInstall ? photoSpeed : null,
      photoInverter: isPackagePrep ? photoInverter : null,
      photoWorkTable: isPackagePrep ? photoWorkTable : null,
      voltageReadings,
      updateName: (isSpecial && isSystemUpdate) ? updateName : undefined,
      updateType: (isSpecial && isSystemUpdate) ? updateType : undefined,
      notes,
      customerSignature: signature,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // Determine URL based on environment (Development vs Production)
      // In development, you might run backend on port 3000 and frontend on 5173
      // In production on Render, they are the same origin.
      const apiUrl = 'https://qssun-after-sales.onrender.com/api/reports';

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
            <Clock size={14} className="text-volt-500" />
            Started: {startTime ? new Date(startTime).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
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
              <div key={s.id} className="relative z-10 flex flex-col items-center cursor-pointer" onClick={() => { if (isCompleted) setStep(s.id) }}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg ${isActive ? 'bg-volt-600 text-white scale-110 ring-4 ring-volt-200/50 dark:ring-volt-900/50' :
                  isCompleted ? 'bg-emerald-500 text-white' :
                    'bg-white dark:bg-black/60 border-2 border-transparent text-gray-400'
                  }`}>
                  {isCompleted ? <CheckCircle2 size={20} /> : s.id}
                </div>
                <span className={`text-[10px] mt-2 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm transition-colors ${isActive ? 'bg-volt-100/80 text-volt-700 dark:bg-volt-900/30 dark:text-volt-300' : 'text-gray-500 dark:text-gray-400'
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
                  <option value="Urgent Fix / عطل طارئ">{t.projectType} - Urgent Fix</option>
                  <option value="Regular Maintenance / صيانة دورية">{t.projectType} - Regular Maintenance</option>
                  <option value="New Installation / تركيب جديد">New Installation / تركيب جديد</option>
                  <option value="Package Preparation / تجهيز بكج">Package Preparation / تجهيز بكج</option>
                  <option value="Technical Inspection / فحص فني">Technical Inspection / فحص فني</option>
                  <option value="System Update / تحديث نظام">{t.systemUpdate}</option>
                </select>

                <div className="absolute top-1/2 right-4 rtl:right-auto rtl:left-4 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronLeft className="rotate-90 rtl:-rotate-90" size={16} />
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
                className={`w-full p-4 rounded-xl flex items-center justify-center gap-3 transition-all border font-bold ${location
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
                {t.next} {dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        )
        }

        {/* STEP 2: Photos */}
        {
          step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300 pb-2">

              {processingImage && (
                <div className="absolute inset-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center flex-col gap-2">
                  <Loader2 className="animate-spin text-volt-600" size={32} />
                  <span className="text-xs font-bold text-volt-600 dark:text-volt-400">Processing & Watermarking...</span>
                </div>
              )}

              {maintenanceType === 'New Installation / تركيب جديد' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo 1: Voltage */}
                  <PhotoUploadField
                    label="Voltage (الجهد)"
                    icon={<Zap size={32} className="mb-2" />}
                    photos={photoVoltage}
                    setPhotos={setPhotoVoltage}
                    uploadLabel="VOLTAGE"
                    t={t}
                    handlePhotoUpload={handlePhotoUpload}
                    removePhoto={removePhoto}
                  />

                  {/* Photo 2: Current */}
                  <PhotoUploadField
                    label="Current (التيار)"
                    icon={<Zap size={32} className="mb-2" />}
                    photos={photoCurrent}
                    setPhotos={setPhotoCurrent}
                    uploadLabel="CURRENT"
                    t={t}
                    handlePhotoUpload={handlePhotoUpload}
                    removePhoto={removePhoto}
                  />

                  {/* Photo 3: Frequency */}
                  <PhotoUploadField
                    label="Frequency (التردد)"
                    icon={<Activity size={32} className="mb-2" />}
                    photos={photoFrequency}
                    setPhotos={setPhotoFrequency}
                    uploadLabel="FREQUENCY"
                    t={t}
                    handlePhotoUpload={handlePhotoUpload}
                    removePhoto={removePhoto}
                  />

                  {/* Photo 4: Speed */}
                  <PhotoUploadField
                    label="Speed (السرعة)"
                    icon={<Gauge size={32} className="mb-2" />}
                    photos={photoSpeed}
                    setPhotos={setPhotoSpeed}
                    uploadLabel="SPEED"
                    t={t}
                    handlePhotoUpload={handlePhotoUpload}
                    removePhoto={removePhoto}
                  />
                </div>
              ) : maintenanceType === 'Package Preparation / تجهيز بكج' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo 1: Inverter */}
                  <PhotoUploadField
                    label="Inverter (صورة المحول)"
                    icon={<Cpu size={32} className="mb-2" />}
                    photos={photoInverter}
                    setPhotos={setPhotoInverter}
                    uploadLabel="INVERTER"
                    t={t}
                    handlePhotoUpload={handlePhotoUpload}
                    removePhoto={removePhoto}
                  />

                  {/* Photo 2: Work Table */}
                  <PhotoUploadField
                    label="Work Table (طاولة العمل)"
                    icon={<ImagePlus size={32} className="mb-2" />}
                    photos={photoWorkTable}
                    setPhotos={setPhotoWorkTable}
                    uploadLabel="WORK_TABLE"
                    t={t}
                    handlePhotoUpload={handlePhotoUpload}
                    removePhoto={removePhoto}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Default Photos: Before/After */}
                  <PhotoUploadField
                    label={t.photoBefore}
                    icon={<Camera size={32} className="mb-2" />}
                    photos={photoBefore}
                    setPhotos={setPhotoBefore}
                    uploadLabel="BEFORE WORK"
                    t={t}
                    handlePhotoUpload={handlePhotoUpload}
                    removePhoto={removePhoto}
                  />

                  <PhotoUploadField
                    label={t.photoAfter}
                    icon={<ImagePlus size={32} className="mb-2" />}
                    photos={photoAfter}
                    setPhotos={setPhotoAfter}
                    uploadLabel="AFTER WORK"
                    t={t}
                    handlePhotoUpload={handlePhotoUpload}
                    removePhoto={removePhoto}
                  />
                </div>
              )}

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
                  disabled={
                    maintenanceType === 'New Installation / تركيب جديد' ? (photoVoltage.length === 0 || photoCurrent.length === 0 || photoFrequency.length === 0 || photoSpeed.length === 0) :
                      maintenanceType === 'Package Preparation / تجهيز بكج' ? (photoInverter.length === 0 || photoWorkTable.length === 0) :
                        (photoBefore.length === 0 || photoAfter.length === 0)
                  }
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-xl shadow-gray-200 dark:shadow-none"
                >
                  {t.next} {dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>
            </div>
          )
        }

        {/* STEP 3: Voltage & Notes */}
        {
          step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 pb-2">
              <div className="bg-volt-50/50 dark:bg-volt-900/10 border border-volt-100 dark:border-white/10 rounded-2xl p-4 flex items-start gap-3">
                <Cpu className="text-volt-600 dark:text-volt-400 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-volt-800 dark:text-volt-300 text-sm">
                    {(maintenanceType === 'New Installation / تركيب جديد' || maintenanceType === 'Package Preparation / تجهيز بكج') ? 'System Parameters / قراءات النظام' : 'Parameters (P07.26 - P07.56)'}
                  </h4>
                  <p className="text-xs text-volt-600 dark:text-gray-400 mt-1">Enter available readings from the control panel.</p>
                </div>
              </div>

              {(maintenanceType === 'New Installation / تركيب جديد' || maintenanceType === 'Package Preparation / تجهيز بكج') && (
                <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-4 border border-white/50 dark:border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer group mb-4">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isSystemUpdate ? 'bg-volt-600 border-volt-600 text-white' : 'border-gray-300 dark:border-gray-600 group-hover:border-volt-400'}`}>
                      {isSystemUpdate && <CheckCircle2 size={16} />}
                    </div>
                    <input type="checkbox" checked={isSystemUpdate} onChange={e => setIsSystemUpdate(e.target.checked)} className="hidden" />
                    <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-volt-600 transition-colors">Include System Update / تحديث نظام</span>
                  </label>

                  {isSystemUpdate && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Update Name / اسم التحديث</label>
                        <input type="text" value={updateName} onChange={e => setUpdateName(e.target.value)} className="w-full bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-volt-500/50 focus:border-volt-500 dark:text-white transition-all font-medium placeholder-gray-400 focus:bg-white dark:focus:bg-black/50" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Update Type / نوع التحديث</label>
                        <input type="text" value={updateType} onChange={e => setUpdateType(e.target.value)} className="w-full bg-white/70 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-volt-500/50 focus:border-volt-500 dark:text-white transition-all font-medium placeholder-gray-400 focus:bg-white dark:focus:bg-black/50" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2">
                {currentParamKeys.map((key) => (
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
          )
        }

        {/* STEP 4: Signature */}
        {
          step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300 text-center pb-2">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 mb-2">
                <PenTool size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {maintenanceType === 'Package Preparation / تجهيز بكج'
                  ? (lang === 'ar' ? 'توقيع الفني المسؤول' : 'Responsible Technician Signature')
                  : t.signHere}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
                {maintenanceType === 'Package Preparation / تجهيز بكج'
                  ? (lang === 'ar' ? 'يرجى التوقيع أدناه لاعتماد البكج' : 'Please sign below to authorize the package')
                  : 'Please ask the customer to sign below to confirm job completion.'}
              </p>

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
          )
        }

      </form >
    </div >
  );
};

export default TechnicianForm;
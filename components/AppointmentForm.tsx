
import React, { useState } from 'react';
import { Appointment } from '../types';
import { parseAppointmentDetails } from '../services/geminiService';
import { LocationIcon, WandIcon, PlusIcon } from './icons';

interface AppointmentFormProps {
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onAddAppointment }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [smartInput, setSmartInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearForm = () => {
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setSmartInput('');
    setError(null);
  };
  
  const handleSmartParse = async () => {
    if (!smartInput.trim()) {
      setError('الرجاء إدخال وصف للموعد.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const details = await parseAppointmentDetails(smartInput);
      setTitle(details.title);
      setDate(details.date);
      setTime(details.time);
      setLocation(details.location);
      setNotes(details.notes || '');
    } catch (e: any) {
      setError(e.message || 'حدث خطأ غير متوقع.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`الموقع الحالي (خط عرض: ${position.coords.latitude.toFixed(4)}, خط طول: ${position.coords.longitude.toFixed(4)})`);
      }, () => {
        setError('لم نتمكن من الوصول إلى موقعك.');
      });
    } else {
      setError('المتصفح لا يدعم تحديد الموقع الجغرافي.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location) {
      setError('الرجاء تعبئة جميع الحقول المطلوبة (العنوان, التاريخ, الوقت, المكان).');
      return;
    }
    onAddAppointment({ title, date, time, location, notes });
    clearForm();
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 w-full">
      <h2 className="text-2xl font-bold text-black mb-1">إضافة موعد جديد</h2>
      <p className="text-gray-500 mb-6">استخدم التحليل الذكي أو املأ الحقول يدويًا.</p>

      {error && <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg" role="alert">{error}</div>}

      <div className="mb-6">
        <label htmlFor="smart-input" className="block text-sm font-bold text-black mb-2">الإدخال الذكي</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="smart-input"
            type="text"
            value={smartInput}
            onChange={(e) => setSmartInput(e.target.value)}
            placeholder="مثال: اجتماع مع العميل غدًا الساعة 3 مساءً في مقهى النجمة"
            className="flex-grow bg-gray-100 text-black border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-amber-400 transition-colors"
          />
          <button
            onClick={handleSmartParse}
            disabled={isLoading}
            className="flex items-center justify-center bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 disabled:bg-gray-400"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <WandIcon className="w-5 h-5 me-2" />
            )}
            <span>{isLoading ? 'جاري التحليل...' : 'تحليل ذكي'}</span>
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-200 my-8"></div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-black mb-2">العنوان</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-100 text-black border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-amber-400" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-bold text-black mb-2">التاريخ</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-100 text-black border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-amber-400" required />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-bold text-black mb-2">الوقت</label>
            <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-100 text-black border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-amber-400" required />
          </div>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-bold text-black mb-2">المكان</label>
          <div className="flex gap-2">
            <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-gray-100 text-black border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-amber-400" required />
            <button type="button" onClick={handleGeolocation} title="استخدام الموقع الحالي" className="p-2 bg-gray-100 text-black rounded-lg border-2 border-gray-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-colors">
              <LocationIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-bold text-black mb-2">ملاحظات</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full bg-gray-100 text-black border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-amber-400"></textarea>
        </div>
        <button type="submit" className="w-full flex items-center justify-center bg-amber-300 text-black font-bold py-3 px-4 rounded-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-300 text-lg">
          <PlusIcon className="w-6 h-6 me-2" />
          إضافة الموعد
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;


import React, { useState, useEffect } from 'react';
import { Appointment } from './types';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';

const App: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
        const savedAppointments = localStorage.getItem('appointments');
        return savedAppointments ? JSON.parse(savedAppointments) : [];
    } catch (error) {
        console.error("Failed to parse appointments from localStorage", error);
        return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: new Date().toISOString(),
    };
    setAppointments([...appointments, newAppointment]);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((app) => app.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-black shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-black text-white tracking-wider">مدير المواعيد الاحترافي</h1>
          <p className="text-amber-300">هامبورغ</p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-1">
            <AppointmentForm onAddAppointment={addAppointment} />
          </div>
          <div className="lg:col-span-2">
            <AppointmentList appointments={appointments} onDelete={deleteAppointment} />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 mt-8">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} مدير المواعيد. كل الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default App;

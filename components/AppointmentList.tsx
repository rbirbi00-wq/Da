
import React from 'react';
import { Appointment } from '../types';
import AppointmentItem from './AppointmentItem';

interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (id: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onDelete }) => {
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-black mb-6">مواعيدي القادمة</h2>
      {sortedAppointments.length > 0 ? (
        <div className="space-y-4">
          {sortedAppointments.map((app) => (
            <AppointmentItem key={app.id} appointment={app} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-gray-500">لا توجد مواعيد قادمة.</p>
          <p className="text-sm text-gray-400 mt-2">أضف موعدًا جديدًا للبدء!</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;


import React from 'react';
import { Appointment } from '../types';
import { CalendarIcon, ClockIcon, LocationIcon, TrashIcon } from './icons';

interface AppointmentItemProps {
  appointment: Appointment;
  onDelete: (id: string) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, onDelete }) => {
  const formattedDate = new Date(appointment.date).toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 w-full border-l-4 border-amber-300">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-black">{appointment.title}</h3>
          <button 
            onClick={() => onDelete(appointment.id)} 
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete appointment"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 space-y-3 text-black">
          <p className="flex items-center">
            <CalendarIcon className="w-5 h-5 me-3 text-amber-400" />
            <span>{formattedDate}</span>
          </p>
          <p className="flex items-center">
            <ClockIcon className="w-5 h-5 me-3 text-amber-400" />
            <span>{appointment.time}</span>
          </p>
          <p className="flex items-center">
            <LocationIcon className="w-5 h-5 me-3 text-amber-400" />
            <span>{appointment.location}</span>
          </p>
        </div>
        {appointment.notes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">{appointment.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentItem;

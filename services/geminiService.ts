
import { GoogleGenAI, Type } from "@google/genai";
import { Appointment } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const appointmentSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'The main title or subject of the appointment.',
    },
    date: {
      type: Type.STRING,
      description: 'The date of the appointment in YYYY-MM-DD format. Today is ' + new Date().toISOString().split('T')[0],
    },
    time: {
      type: Type.STRING,
      description: 'The time of the appointment in 24-hour HH:MM format.',
    },
    location: {
      type: Type.STRING,
      description: 'The physical address or location of the appointment. Default to "هامبورغ" if not specified.',
    },
    notes: {
      type: Type.STRING,
      description: 'Any additional notes or details about the appointment.',
    },
  },
  required: ['title', 'date', 'time', 'location'],
};


export const parseAppointmentDetails = async (text: string): Promise<Omit<Appointment, 'id'>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analysiere den folgenden Termindetailtext und extrahiere die Informationen in das bereitgestellte JSON-Schema. Der Text ist auf Arabisch. Antworte nur mit JSON. Heutiges Datum ist ${new Date().toLocaleDateString('de-DE')}. Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: appointmentSchema,
      },
    });

    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString);
    
    // Basic validation to ensure the parsed data fits the expected structure.
    if (parsedData.title && parsedData.date && parsedData.time && parsedData.location) {
        return parsedData as Omit<Appointment, 'id'>;
    } else {
        throw new Error("Parsed data is missing required fields.");
    }

  } catch (error) {
    console.error("Error parsing appointment details with Gemini:", error);
    throw new Error("فشل التحليل الذكي. الرجاء المحاولة مرة أخرى أو إدخال التفاصيل يدويًا.");
  }
};

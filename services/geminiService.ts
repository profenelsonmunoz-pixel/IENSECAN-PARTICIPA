import { GoogleGenAI, Type } from "@google/genai";
import { OCR_TEXT } from '../constants';
import type { PageContent } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getStructuredContent(): Promise<PageContent> {
  const prompt = `
    Analiza el siguiente texto extraído de una guía de participación de una institución educativa y estructúralo en un formato JSON limpio y bien organizado. 
    El JSON debe contener:
    1. Un título principal ("mainTitle").
    2. Un párrafo de introducción ("introduction").
    3. Una lista de métodos de contacto ("contactMethods"), donde cada método tiene un tipo (type), un título (title), y una lista de detalles (details). Para el método de contacto 'Presencial', utiliza el título 'Sede Administrativa'. Cada detalle debe tener una etiqueta (label), un valor (value), y un booleano opcional (isLink) si el valor es una URL. Para el detalle de la dirección en el contacto 'Presencial', usa el valor "https://maps.app.goo.gl/6rb3h5KhJ6LW2dzm7". Asegúrate de que este detalle se marque como un enlace (isLink: true) y no como un mapa.
    4. Un título para la sección de mecanismos ("mechanismsTitle").
    5. Una lista de mecanismos de participación ciudadana ("mechanisms"), donde cada uno tiene un título (title) y una descripción detallada (description).

    Asegúrate de que los enlaces y correos electrónicos sean valores correctos y que el contenido sea preciso según el texto proporcionado.

    Texto para analizar:
    ---
    ${OCR_TEXT}
    ---
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      mainTitle: { type: Type.STRING, description: "El título principal de la página." },
      introduction: { type: Type.STRING, description: "Un breve párrafo introductorio." },
      contactMethods: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "El tipo de contacto, ej: 'Presencial'." },
            title: { type: Type.STRING, description: "El título del método de contacto." },
            details: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "Etiqueta para el detalle de contacto." },
                  value: { type: Type.STRING, description: "Valor del detalle de contacto." },
                  isLink: { type: Type.BOOLEAN, description: "Indica si el valor es un enlace URL." },
                  isMap: { type: Type.BOOLEAN, description: "Indica si el valor es una dirección para mostrar en un mapa." }
                },
                required: ["label", "value"]
              }
            }
          },
          required: ["type", "title", "details"]
        }
      },
      mechanismsTitle: { type: Type.STRING, description: "Título para la sección de mecanismos de participación." },
      mechanisms: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "El nombre del mecanismo." },
            description: { type: Type.STRING, description: "La explicación del mecanismo." }
          },
          required: ["title", "description"]
        }
      }
    },
    required: ["mainTitle", "introduction", "contactMethods", "mechanismsTitle", "mechanisms"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as PageContent;
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch and structure content from Gemini API.");
  }
}
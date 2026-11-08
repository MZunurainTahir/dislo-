import React from 'react';
import { Mountain, Heart, ShieldCheck, PhoneCall, Globe } from 'lucide-react';

interface Props {
  isUrdu: boolean;
}

export const Footer: React.FC<Props> = ({ isUrdu }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand statement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-black text-base">
            <span className="text-xl">🏔️</span>
            <span>ISLAMABAD VIBES</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isUrdu 
              ? 'اسلام آباد کے شہریوں اور طلباء کے لیے ایک جامع اے آئی سوپر ایپ۔ کھانے، مارگلہ ہائیکنگ، کمیونٹی اور دماغی تفریح کا مرکز۔'
              : 'The definitive lifestyle, discounts, hiking network & AI food therapist super-app engineered specifically for Islamabad capital citizens and university students.'
            }
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>ICT Verified Data & Emergency Hub</span>
          </div>
        </div>

        {/* Sectors Covered */}
        <div>
          <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] mb-3">
            {isUrdu ? 'اسلام آباد کے سیکٹرز' : 'Capital Sectors Covered'}
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>Sector F-6 (Kohsar & Beverly Centre)</li>
            <li>Sector F-7 (Jinnah Super & Gol Market)</li>
            <li>Sector F-10 & F-11 Markaz Hubs</li>
            <li>Blue Area Commercial Corridor</li>
            <li>Sector I-8 Markaz & Student Hostels</li>
            <li>Centaurus & Safa Gold Malls</li>
            <li>Margalla Hills National Park (Trails 1-7)</li>
          </ul>
        </div>

        {/* AI Tech & Cloud Integrations */}
        <div>
          <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] mb-3">
            {isUrdu ? 'اے آئی و ٹیکنالوجی اسٹیک' : 'Integrated Deep Tech Stack'}
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>Groq Llama-3.3 NLP Engine</li>
            <li>DeepSeek & OpenRouter AI Fallbacks</li>
            <li>Computer Vision Meal & Calorie Scanner</li>
            <li>ElevenLabs & Web Speech Neural Voice</li>
            <li>OpenWeatherMap Margalla Telemetry</li>
            <li>Supabase Postgres & Cloud Realtime</li>
            <li>FortyGuard Environmental Analytics</li>
          </ul>
        </div>

        {/* Emergency & Citizen Contacts */}
        <div>
          <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] mb-3">
            {isUrdu ? 'شہری ہیلپ لائنز' : 'Islamabad Helplines'}
          </h4>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rescue Islamabad: <strong>1122</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span>Police Emergency: <strong>15</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-yellow-400" />
              <span>CDA Citizen Portal: <strong>1819</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
              <span>Food Safety ICT: <strong>0800-02345</strong></span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-slate-500 text-[11px]">
        <p className="flex items-center justify-center gap-1">
          Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for the beautiful green capital of Islamabad.
        </p>
      </div>
    </footer>
  );
};


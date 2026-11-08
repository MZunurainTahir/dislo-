import React from 'react';
import { IslamabadEvent } from '../../types';
import { Calendar, MapPin, Ticket, ExternalLink, Sparkles } from 'lucide-react';

interface Props {
  events: IslamabadEvent[];
  isUrdu: boolean;
}

export const EventsSection: React.FC<Props> = ({ events, isUrdu }) => {
  return (
    <div className={`space-y-6 ${isUrdu ? 'urdu-text' : ''}`}>
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-emerald-400" />
          <span>{isUrdu ? 'اسلام آباد کے آنے والے ایونٹس اور فیسٹیولز' : 'Upcoming Islamabad Events, Expos & Tickets'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isUrdu 
            ? 'فوڈ کارنیوال، مارگلہ میراتھن اور ٹیکنالوجی کانفرنسز کے آفیشل پاسز'
            : 'Direct passes and official tickets for food festivals, tech conclaves & mountain marathons'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(ev => (
          <div
            key={ev.id}
            className="group bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                <img
                  src={ev.imageUrl}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-lg shadow">
                  {ev.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/75 backdrop-blur-md text-yellow-400 text-xs font-bold rounded-lg border border-yellow-500/30">
                  {ev.ticketPrice}
                </span>
              </div>

              <div className="p-4 space-y-2.5">
                <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                  {isUrdu ? ev.titleUrdu : ev.title}
                </h3>
                
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ev.date} • {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isUrdu ? ev.venueUrdu : ev.venue}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed pt-1">
                  {ev.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <a
                href={ev.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ٹکٹ حاصل کریں / رجسٹر کریں' : 'Book Passes / Register Now'}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { HiddenSpot } from '../../types';
import { MapPin, Lock, Unlock, Sparkles, ExternalLink, ShieldCheck, CheckCircle2, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  spots: HiddenSpot[];
  isPremium: boolean;
  onUpgradePremium: () => void;
  isUrdu: boolean;
}

export const HiddenSpotsSection: React.FC<Props> = ({
  spots,
  isPremium,
  onUpgradePremium,
  isUrdu
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [trxId, setTrxId] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  // National Day Discount Toggle
  const isNationalHoliday = true; // Active national celebration promo
  const currentPriceUsd = isNationalHoliday ? 1 : 3;
  const currentPricePkr = isNationalHoliday ? 280 : 850;

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) return;

    onUpgradePremium();
    setShowPaymentModal(false);
    confetti({ particleCount: 160, spread: 90 });
    alert('Payment verified! You are now a disLo VIP Explorer. All secret spots & coordinates unlocked!');
  };

  const categories = ['All', 'Secret Scenic View', 'Hidden Waterfall & Spring', 'Historic Cave & Ridge', 'Underrated Food & Cafe', 'Tranquil Sunset Spot'];

  const filteredSpots = selectedFilter === 'All' 
    ? spots 
    : spots.filter(s => s.category === selectedFilter);

  return (
    <div className={`space-y-8 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 p-6 sm:p-8 bg-gradient-to-r from-amber-950/70 via-slate-900 to-emerald-950/70 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>{isUrdu ? 'اسلام آباد کے خفیہ مقامات اور پوشیدہ کھانے' : 'Islamabad Secret Spots & Underrated Food Gems'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isUrdu ? 'پوشیدہ قدرتی مناظر، غاریں اور نایاب کیفے' : 'Hidden Margalla Caves, Springs & Secret Cafes'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isUrdu 
              ? 'عام سیاحوں سے دور اسلام آباد کے سب سے پرامن مقامات اور انڈر ریٹڈ کھانوں کی درست لوکیشنز اور گوگل میپس لنکس۔'
              : 'Exact GPS coordinates, hidden mountain water springs, ancient Buddhist caves, and secret cafes far away from commercial crowds.'
            }
          </p>

          {!isPremium && (
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock All Secret Spots (${currentPriceUsd} / PKR {currentPricePkr})</span>
              </button>
              {isNationalHoliday && (
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  <span>National Day Special: Reduced from $3 to $1!</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === cat
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Spots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpots.map((spot, index) => {
          const isLocked = !isPremium && index >= 1; // Show first spot as free preview

          return (
            <div
              key={spot.id}
              className="relative group bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <div className="h-48 w-full relative overflow-hidden bg-slate-950">
                  <img
                    src={spot.imageUrl}
                    alt={spot.title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      isLocked ? 'blur-sm filter brightness-50' : ''
                    }`}
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-black rounded-lg shadow">
                    {spot.category}
                  </span>
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
                    📍 {spot.sector}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                    {isUrdu ? spot.titleUrdu : spot.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {isLocked 
                      ? 'GPS coordinates and exact directions locked for VIP explorers.' 
                      : (isUrdu ? spot.descriptionUrdu : spot.description)
                    }
                  </p>

                  <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                    <span>Best Time:</span>
                    <span className="text-white font-medium">{spot.bestTime}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                {isLocked ? (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock with VIP Pass (${currentPriceUsd})</span>
                  </button>
                ) : (
                  <a
                    href={spot.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Open in Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Easypaisa Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Unlock All Islamabad Hidden Spots</h3>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Fee:</span>
                <span className="text-white font-bold">${currentPriceUsd} USD / PKR {currentPricePkr}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method:</span>
                <span className="text-emerald-400 font-bold">Easypaisa</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Easypaisa Account:</span>
                <span className="text-white font-mono font-bold select-all">03134006915</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Account Name:</span>
                <span className="text-white font-semibold">Muhammad Zun U Rain Tahir</span>
              </div>
            </div>

            <form onSubmit={handleVerifyPayment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Enter Easypaisa TRX ID (after sending PKR {currentPricePkr}):</label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={e => setTrxId(e.target.value)}
                  placeholder="e.g. 78491204892"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg"
              >
                Verify & Unlock All Spots Instantly
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


import React from 'react';
import { 
  ShoppingBag, Globe, Sun, Mountain, Sparkles, Gift, User 
} from 'lucide-react';
import { WeatherInfo, MarketRate, CartItem, UserAccount } from '../../types';

interface Props {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  currentUser: UserAccount;
  onOpenAuth: () => void;
  weather: WeatherInfo | null;
  marketRate: MarketRate | null;
  language: 'en' | 'ur';
  toggleLanguage: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  cartItems,
  onOpenCart,
  currentUser,
  onOpenAuth,
  weather,
  marketRate,
  language,
  toggleLanguage
}) => {
  const isUrdu = language === 'ur';
  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const TABS = [
    { id: 'deals', label: isUrdu ? 'کھانے اور ڈیلز' : 'Deals & Food', icon: '🍔' },
    { id: 'hidden', label: isUrdu ? 'خفیہ مقامات و کیفے' : 'Secret Spots & Gems', icon: '🗺️' },
    { id: 'mall', label: isUrdu ? 'مال و گروسری مارٹ' : 'Mall & Grocery Mart', icon: '🛒' },
    { id: 'ai-dost', label: isUrdu ? 'اے آئی دوست و تھیراپسٹ' : 'AI Dost & Therapist', icon: '🤖' },
    { id: 'hiking', label: isUrdu ? 'مارگلہ ہلز و رننگ' : 'Margalla Trails & Fitness', icon: '🏔️' },
    { id: 'games', label: isUrdu ? 'دماغی گیمز' : 'Mind Refresh Games', icon: '🎮' },
    { id: 'community', label: isUrdu ? 'آؤٹنگ پولز و کمیونٹی' : 'Safe Outing Polls', icon: '🗳️' },
    { id: 'events', label: isUrdu ? 'ایونٹس و ٹکٹس' : 'Concerts & Festivals', icon: '🎟️' },
    { id: 'complaints', label: isUrdu ? 'شکایات پورٹل' : 'Complaints & Help', icon: '📢' },
    { id: 'admin', label: isUrdu ? 'ایڈمن پورٹل' : 'Admin Portal', icon: '🛡️' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
      {/* Top Telemetry & National Holiday Special Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Weather Status */}
          <div className="flex items-center gap-3">
            {weather ? (
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                  {weather.temp}°C
                </span>
                <span className="text-slate-400">Islamabad: {isUrdu ? weather.conditionUrdu : weather.condition}</span>
                <span className="hidden sm:inline text-emerald-400 font-semibold">• {weather.airQuality}</span>
              </div>
            ) : (
              <span className="text-slate-400">Fetching Margalla climate...</span>
            )}
          </div>

          {/* National Day Alert Banner */}
          <div 
            onClick={() => setActiveTab('hidden')}
            className="cursor-pointer hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
          >
            <Gift className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
            <span className="font-bold text-[10px]">National Day Special: Secret Spots Pass Drops to $1 (PKR 280)</span>
          </div>

          {/* Market & Language Switcher */}
          <div className="flex items-center gap-3 text-[10px] sm:text-[11px]">
            {marketRate && (
              <div className="flex items-center gap-3 text-slate-400">
                <span>USD: <strong className="text-emerald-400">Rs {marketRate.usdToPkr}</strong></span>
                <span className="hidden md:inline">Gold: <strong className="text-yellow-400">Rs {marketRate.goldPerTolaPkr.toLocaleString()}</strong></span>
              </div>
            )}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-semibold"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span>{isUrdu ? 'English Mode' : 'اردو موڈ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand: disLo */}
        <div 
          onClick={() => setActiveTab('deals')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
              🏔️
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                disLo
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Islamabad 2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5">
              {isUrdu ? 'ڈس لو — اسلام آباد ڈیلز، مارگلہ و خفیہ مقامات' : 'disLo — Deals, Secret Spots & Real Community'}
            </p>
          </div>
        </div>

        {/* User Account Pill & Cart */}
        <div className="flex items-center gap-2.5">
          {/* User Account / Profile Button */}
          <button
            onClick={onOpenAuth}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl flex items-center gap-2 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.fullName}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500"
            />
            <div className="hidden sm:block text-left text-xs leading-tight">
              <span className="font-bold text-white block truncate max-w-[110px]">{currentUser.firstName}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">{currentUser.generation}</span>
            </div>
          </button>

          {/* Interactive Basket Button */}
          <button
            id="cart-button-icon"
            onClick={onOpenCart}
            className="relative px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span className="text-xs hidden sm:inline">
              {isUrdu ? 'انٹرایکٹو باسکٹ' : 'Smart Basket'}
            </span>
            {totalCartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-emerald-400 text-[10px] font-black ring-1 ring-slate-900">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation Strip */}
      <div className="border-t border-slate-800/80 bg-slate-950/80 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1.5 py-1.5 min-w-max">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

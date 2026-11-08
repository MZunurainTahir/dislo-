import React, { useState, useMemo } from 'react';
import { DealItem, Sector, DealCategory } from '../../types';
import { DealCard } from './DealCard';
import { Search, Sparkles, TrendingUp, Compass, RefreshCw, Zap, Clock, ShieldCheck, Flame } from 'lucide-react';
import { getCurrentTimeSlot, getSortedFreshDeals, getDealOfTheHour, getLiveRadarPulse } from '../../services/dealsService';

interface Props {
  deals: DealItem[];
  onAddToCart: (deal: DealItem) => void;
  isUrdu: boolean;
}

const SECTORS: Sector[] = [
  'All',
  'F-6 (Kohsar & Beverly)',
  'F-7 (Jinnah Super)',
  'F-10 (Markaz)',
  'F-11 (Markaz)',
  'Blue Area',
  'I-8 (Markaz)',
  'G-9 (Karachi Company)',
  'E-11',
  'Centaurus & Safa',
  'Margalla Hills & Monal',
  'DHA & Bahria Town'
];

const CATEGORIES: DealCategory[] = [
  'All',
  'Fast Food',
  'Desi & BBQ',
  'Cafe & Bakery',
  'Student Budget',
  'Fine Dining',
  'Buffet & Hi-Tea',
  'Late Night',
  'Mall & Mart Grocery'
];

export const DealsSection: React.FC<Props> = ({ deals, onAddToCart, isUrdu }) => {
  const [search, setSearch] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<Sector>('All');
  const [selectedCategory, setSelectedCategory] = useState<DealCategory>('All');
  const [sortBy, setSortBy] = useState<'discount' | 'rating' | 'priceLow' | 'freshRadar'>('freshRadar');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const timeSlot = useMemo(() => getCurrentTimeSlot(), [refreshTick]);
  const radar = useMemo(() => getLiveRadarPulse(), [refreshTick]);
  const featuredDeal = useMemo(() => getDealOfTheHour(deals), [deals, refreshTick]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRefreshTick(prev => prev + 1);
      setIsRefreshing(false);
    }, 600);
  };

  const filteredDeals = useMemo(() => {
    let list = [...deals];

    if (sortBy === 'freshRadar') {
      list = getSortedFreshDeals(list);
    }

    return list
      .filter(deal => {
        const matchesSearch = 
          deal.title.toLowerCase().includes(search.toLowerCase()) ||
          deal.titleUrdu.includes(search) ||
          deal.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
          deal.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

        const matchesSector = selectedSector === 'All' || deal.sector === selectedSector;
        const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory;

        return matchesSearch && matchesSector && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'priceLow') return a.discountedPrice - b.discountedPrice;
        return 0;
      });
  }, [deals, search, selectedSector, selectedCategory, sortBy, refreshTick]);

  return (
    <div className={`space-y-6 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Dynamic Deals Radar Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{timeSlot.icon} {isUrdu ? timeSlot.labelUrdu : timeSlot.labelEn}</span>
              </span>

              <span className="px-2.5 py-1 bg-slate-800/80 text-yellow-400 text-xs font-bold rounded-lg border border-slate-700/80 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-yellow-400" />
                {isUrdu ? `${deals.length} تصدیق شدہ لائیو ڈیلز` : `${deals.length} Active ICT Deals`}
              </span>

              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                {isUrdu ? `ریفریش: ${radar.lastRefreshedMins} منٹ قبل` : `Refreshed ${radar.lastRefreshedMins}m ago`}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white">
              {isUrdu ? 'اسلام آباد ڈیلز ریڈار — فوری اور سستے کھانے' : 'Islamabad Live Deals Radar & Instant Ordering'}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {isUrdu ? timeSlot.descriptionUrdu : timeSlot.descriptionEn}.
              {isUrdu 
                ? ' کسی بھی ڈیل پر کلک کریں اور براہ راست ریسٹورنٹ یا فوڈ پانڈا کے مینیو سے آرڈر کریں۔' 
                : ' Click any deal to deep-link directly to the restaurant or Foodpanda checkout page.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isUrdu ? 'تازہ ترین ڈیلز تلاش کریں' : 'Refresh Live Radar'}</span>
            </button>
          </div>
        </div>

        {/* Featured Deal Bar */}
        {featuredDeal && (
          <div 
            onClick={() => window.open(featuredDeal.directOrderUrl, '_blank', 'noopener,noreferrer')}
            className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 hover:border-emerald-500/50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm shrink-0">
                <Flame className="w-4 h-4 fill-emerald-400" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400">
                    {isUrdu ? 'اس گھنٹے کی خاص ڈیل:' : 'Hourly Spotlight:'}
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {featuredDeal.restaurantName} — {isUrdu ? featuredDeal.titleUrdu : featuredDeal.title}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {featuredDeal.sector} • <strong className="text-emerald-400">PKR {featuredDeal.discountedPrice.toLocaleString()}</strong> ({featuredDeal.discountPercentage}% OFF)
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 shrink-0 self-end sm:self-center">
              <span>{isUrdu ? 'براہ راست آرڈر کریں 🛵' : 'Order Now 🛵'}</span>
              <span>→</span>
            </span>
          </div>
        )}
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={
                isUrdu
                  ? 'اسلام آباد کے کھانے و ڈیلز تلاش کریں (چیزئیئس، سیور، کے ایف سی، مکڈونلڈز، برگر، کافی)...'
                  : 'Search Islamabad deals (e.g. Cheezious, Savour, KFC, McDonald\'s, Biryani, Coffee)...'
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Sort dropdown */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="freshRadar">{isUrdu ? '⚡ لائیو ریڈار اور تازہ ترین' : '⚡ Fresh Live Radar'}</option>
              <option value="discount">{isUrdu ? 'زیادہ رعایت پہلے' : 'Biggest Discount'}</option>
              <option value="rating">{isUrdu ? 'اعلیٰ ریٹنگ' : 'Highest Rated'}</option>
              <option value="priceLow">{isUrdu ? 'سستی قیمت پہلے' : 'Lowest Price'}</option>
            </select>
          </div>
        </div>

        {/* Sectors Filter Slider */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isUrdu ? 'اسلام آباد سیکٹرز:' : 'Islamabad Sectors:'}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {SECTORS.map(sec => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedSector === sec
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-yellow-400 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-slate-400">
          {isUrdu ? 'دستیاب ڈیلز:' : 'Showing Active Deals:'}{' '}
          <span className="font-bold text-emerald-400">{filteredDeals.length}</span>
          <span className="text-slate-500 ml-1">({deals.length} total curated)</span>
        </p>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          {isUrdu ? 'اسلام آباد کے تصدیق شدہ براہ راست لنکس' : '100% Deep-Linked ICT Ordering'}
        </span>
      </div>

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-base font-bold text-slate-300 mb-1">
            {isUrdu ? 'کوئی ڈیل نہیں ملی' : 'No Deals Found'}
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {isUrdu 
              ? 'اپنے منتخب کردہ سیکٹر یا تلاش کے الفاظ کو تبدیل کر کے دیکھیں۔' 
              : 'Try clearing your sector filter or searching for another dish like "Pizza" or "Biryani".'
            }
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedSector('All'); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            {isUrdu ? 'تمام فلٹرز ری سیٹ کریں' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              onAddToCart={onAddToCart}
              isUrdu={isUrdu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

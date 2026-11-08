import React, { useRef } from 'react';
import { DealItem } from '../../types';
import { Star, MapPin, ExternalLink, Plus, Tag, ShoppingBag, Sparkles } from 'lucide-react';
import { triggerFlyToCartAnimation } from '../../utils/flyToCart';

interface Props {
  deal: DealItem;
  onAddToCart: (deal: DealItem) => void;
  isUrdu: boolean;
}

export const DealCard: React.FC<Props> = ({ deal, onAddToCart, isUrdu }) => {
  const addBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleCardClick = () => {
    if (deal.directOrderUrl) {
      window.open(deal.directOrderUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (addBtnRef.current) {
      triggerFlyToCartAnimation(addBtnRef.current);
    }
    onAddToCart(deal);
  };

  const handleDirectOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deal.directOrderUrl) {
      window.open(deal.directOrderUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      title={isUrdu ? 'آرڈر پیج کھولنے کے لیے کلک کریں' : 'Click to open restaurant order page directly'}
      className={`group relative bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1 ${
        isUrdu ? 'urdu-text' : ''
      }`}
    >
      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={deal.imageUrl}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 text-xs font-black rounded-lg shadow-md flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {deal.discountPercentage}% {isUrdu ? 'رعایت' : 'OFF'}
          </span>
          {deal.badge && (
            <span className="px-2.5 py-1 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-yellow-400 text-xs font-bold rounded-lg shadow">
              {deal.badge}
            </span>
          )}
        </div>

        {/* Sector Tag & Direct Order Banner */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1 text-slate-200 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs border border-slate-800">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[140px]">{deal.sector}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/30">
            <span>🛵 {isUrdu ? 'براہ راست آرڈر' : 'Direct Order'}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-bold text-emerald-400 tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              {deal.restaurantName}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-white text-xs">{deal.rating}</span>
              <span className="text-[10px] text-slate-500">({deal.reviewCount})</span>
            </div>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors">
            {isUrdu ? deal.titleUrdu : deal.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {isUrdu ? deal.descriptionUrdu : deal.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {deal.tags.map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50">
                #{tag}
              </span>
            ))}
            {deal.isStudentSpecial && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-semibold">
                🎓 {isUrdu ? 'اسٹوڈنٹ آفر' : 'Student Special'}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-white">
                PKR {deal.discountedPrice.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 line-through">
                PKR {deal.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 block font-medium">
              {isUrdu ? 'بچت:' : 'Save:'} PKR {(deal.originalPrice - deal.discountedPrice).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Direct Order Link Button */}
            <button
              onClick={handleDirectOrder}
              className="px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-emerald-600/30 active:scale-95 transition-all"
              title={isUrdu ? 'ریسٹورنٹ کی آفیشل ایپ یا ویب سائٹ پر آرڈر کریں' : 'Order directly from restaurant website / Foodpanda'}
            >
              <span>🛵 {isUrdu ? 'آرڈر' : 'Order'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Smart Basket Add Button */}
            <button
              ref={addBtnRef}
              onClick={handleAdd}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white font-bold rounded-xl text-xs border border-slate-700 active:scale-95 transition-all"
              title={isUrdu ? 'لوکل باسکٹ میں شامل کریں' : 'Add to Smart Basket'}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

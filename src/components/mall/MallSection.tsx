import React, { useRef } from 'react';
import { DealItem } from '../../types';
import { Store, ShoppingCart, Tag, Sparkles, Check, Plus } from 'lucide-react';
import { triggerFlyToCartAnimation } from '../../utils/flyToCart';

interface Props {
  onAddToCart: (deal: DealItem) => void;
  isUrdu: boolean;
}

const MALL_STORES = [
  { name: 'Metro Cash & Carry', location: 'I-11 Islamabad Highway', discount: 'Up to 35% OFF on wholesale packages' },
  { name: 'Imtiaz Super Market', location: 'Gulberg Greens & Islamabad', discount: 'Weekly Super Saver discounts' },
  { name: 'Al-Fateh Department Store', location: 'Centaurus Mall & DHA 2', discount: 'Imported essentials & member points' },
  { name: 'Greenvalley Premium Mart', location: 'Mall of Islamabad & Bahria', discount: 'Organic fresh bakery & meat specials' },
  { name: 'Esajee’s Gourmet Grocers', location: 'Kohsar Market, Sector F-6', discount: 'Exotic teas, cheeses & imported chocolates' }
];

const GROCERY_BUNDLES: DealItem[] = [
  {
    id: 'groc-1',
    restaurantId: 'metro-isb',
    restaurantName: 'Metro Cash & Carry Islamabad',
    title: 'Hostel Student Essentials Care Package',
    titleUrdu: 'ہاسٹل اسٹوڈنٹ گروسری پیک (نوڈلز، چائے، دودھ، بسکٹس)',
    description: 'Includes 12 packs Knorr/Maggi noodles, Olper’s Milk (1L x 4), Tapal Danedar Tea (450g), 4 large biscuit packs, and instant coffee sachets.',
    descriptionUrdu: '12 پیک نوڈلز، 4 لیٹر اولپرز دودھ، تاپال دانے دار چائے، 4 فیملی بسکٹ پیک اور انسٹنٹ کافی ساشے کا مکمل پیک۔',
    category: 'Mall & Mart Grocery',
    sector: 'Centaurus & Safa',
    originalPrice: 4200,
    discountedPrice: 2899,
    discountPercentage: 31,
    rating: 4.8,
    reviewCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    badge: '🎓 Hostel Saver',
    validUntil: '2026-11-30',
    directOrderUrl: 'https://metro.pk',
    websiteUrl: 'https://metro.pk',
    address: 'Metro Cash & Carry, I-11, Islamabad',
    isStudentSpecial: true,
    tags: ['Hostel', 'Grocery', 'Student', 'Discount']
  },
  {
    id: 'groc-2',
    restaurantId: 'greenvalley',
    restaurantName: 'Greenvalley Hypermarket',
    title: 'Margalla Trekker High-Protein Energy Pack',
    titleUrdu: 'مارگلہ ٹریکر ہائی پروٹین انرجی پیک (ڈرائی فروٹ، بارز و پانی)',
    description: 'Fresh roasted California almonds & walnuts (500g), 6 Protein oat energy bars, Electrolyte sachets, and 4 Himalayan mineral water bottles.',
    descriptionUrdu: '500 گرام بھنے ہوئے بادام و اخروٹ، 6 انرجی بارز، الیکٹرولائٹ ساشے اور 4 منرل واٹر بوتلیں—ہائیکرز کا بہترین ساتھی۔',
    category: 'Mall & Mart Grocery',
    sector: 'Margalla Hills & Monal',
    originalPrice: 3800,
    discountedPrice: 2650,
    discountPercentage: 30,
    rating: 4.9,
    reviewCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800&auto=format&fit=crop&q=80',
    badge: '🌲 Trekker Fuel',
    validUntil: '2026-12-15',
    directOrderUrl: 'https://greenvalley.pk',
    websiteUrl: 'https://greenvalley.pk',
    address: 'Greenvalley Hypermarket, Bahria Town & Mall of Islamabad',
    tags: ['Hiking', 'Trail Food', 'Protein', 'Dry Fruit']
  },
  {
    id: 'groc-3',
    restaurantId: 'imtiaz-isb',
    restaurantName: 'Imtiaz Super Market Islamabad',
    title: 'Family Monthly Kitchen Mega Saver Bundle',
    titleUrdu: 'ماہانہ فیملی کچن میگا سیور بنڈل (چاول، گھی، دالیں)',
    description: '10kg Premium Super Kernel Basmati Rice, 5L Cooking Oil, 2kg Daal Chana & Daal Mash, 2kg Sugar, and premium salt & spice pack.',
    descriptionUrdu: '10 کلو سپر کرنل باسمتی چاول، 5 لیٹر کوکنگ آئل، 2 کلو دالیں، 2 کلو چینی اور مکمل مسالہ جات کا پیکٹ۔',
    category: 'Mall & Mart Grocery',
    sector: 'F-10 (Markaz)',
    originalPrice: 9400,
    discountedPrice: 6999,
    discountPercentage: 26,
    rating: 4.7,
    reviewCount: 1650,
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    badge: '🛒 Mega Value',
    validUntil: '2026-11-28',
    directOrderUrl: 'https://imtiaz.com.pk',
    websiteUrl: 'https://imtiaz.com.pk',
    address: 'Imtiaz Super Market, Gulberg Greens, Islamabad',
    tags: ['Kitchen', 'Basmati', 'Family Pack', 'Savings']
  },
  {
    id: 'groc-4',
    restaurantId: 'esajees-f6',
    restaurantName: 'Esajee’s Kohsar Market F-6',
    title: 'Kohsar Gourmet Breakfast & Artisanal Coffee Kit',
    titleUrdu: 'کوہسار گورمے بریک فاسٹ اور تازہ کافی کٹ',
    description: 'Single-origin roasted coffee beans (250g), Dutch Gouda cheese wheel portion, organic Margalla wild honey, and French berry jam.',
    descriptionUrdu: 'تازہ بھنی کافی بینز، ڈچ گؤڈا چیز، خالص مارگلہ جنگلی شہد اور فرانسیسی بیری جیم—شاہانہ ناشتے کا مزہ۔',
    category: 'Mall & Mart Grocery',
    sector: 'F-6 (Kohsar & Beverly)',
    originalPrice: 5500,
    discountedPrice: 3850,
    discountPercentage: 30,
    rating: 4.9,
    reviewCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    badge: '✨ Gourmet Elite',
    validUntil: '2026-12-01',
    directOrderUrl: 'https://esajee.com',
    websiteUrl: 'https://esajee.com',
    address: 'Kohsar Market, Sector F-6/3, Islamabad',
    tags: ['Gourmet', 'Coffee', 'Cheese', 'Kohsar']
  }
];

export const MallSection: React.FC<Props> = ({ onAddToCart, isUrdu }) => {
  return (
    <div className={`space-y-8 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Store className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'اسلام آباد مالز و سپر مارٹس' : 'Islamabad Malls & Hypermarket Hub'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isUrdu ? 'انٹرایکٹو مال، گروسری شاپس اور سپر سیور ڈیلز' : 'Interactive Mall, Grocery Marts & Student Packs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isUrdu 
              ? 'میٹرو، امتیاز، الفتح اور کوہسار ایساجیز سے کم ترین قیمت پر ہاسٹل راشن، ٹریکنگ سنیکس اور گروسری بنڈلز خریدیں اور باسکٹ میں ڈالیں۔'
              : 'Add grocery bundles directly to your interactive basket from Metro, Imtiaz, Al-Fateh, and Esajee’s with flying item physics and instant bulk savings.'
            }
          </p>
        </div>

        {/* Mart highlights */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MALL_STORES.slice(0, 3).map((st, i) => (
            <div key={i} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <h4 className="text-xs font-bold text-white">{st.name}</h4>
              <p className="text-[10px] text-slate-400">📍 {st.location}</p>
              <span className="text-[10px] text-emerald-400 font-semibold block">{st.discount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grocery Bundles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GROCERY_BUNDLES.map(bundle => {
          const btnRef = React.createRef<HTMLButtonElement>();

          const handleAdd = () => {
            if (btnRef.current) {
              triggerFlyToCartAnimation(btnRef.current);
            }
            onAddToCart(bundle);
          };

          return (
            <div
              key={bundle.id}
              className="group bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row gap-5 transition-all duration-300"
            >
              <div className="w-full sm:w-44 h-44 rounded-2xl overflow-hidden shrink-0 relative bg-slate-950">
                <img
                  src={bundle.imageUrl}
                  alt={bundle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black">
                  {bundle.discountPercentage}% OFF
                </span>
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-yellow-400 text-[10px] font-bold">
                  {bundle.badge}
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                    {bundle.restaurantName}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                    {isUrdu ? bundle.titleUrdu : bundle.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {isUrdu ? bundle.descriptionUrdu : bundle.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-white">
                        PKR {bundle.discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        PKR {bundle.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      Save PKR {(bundle.originalPrice - bundle.discountedPrice).toLocaleString()}
                    </span>
                  </div>

                  <button
                    ref={btnRef}
                    onClick={handleAdd}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isUrdu ? 'باسکٹ میں ڈالیں' : 'Drop to Basket'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


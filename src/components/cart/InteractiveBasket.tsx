import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, ArrowRight, ExternalLink, Sparkles, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../../types';
import confetti from 'canvas-confetti';

interface Props {
  items: CartItem[];
  onUpdateQuantity: (dealId: string, delta: number) => void;
  onRemoveItem: (dealId: string) => void;
  onClearCart: () => void;
  isOpen: boolean;
  onClose: () => void;
  isUrdu: boolean;
}

export const InteractiveBasket: React.FC<Props> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isOpen,
  onClose,
  isUrdu
}) => {
  const [studentCardApplied, setStudentCardApplied] = useState<boolean>(true);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('Muhammad Zunurain');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Street 12, Sector F-7/2, Islamabad');
  const [phone, setPhone] = useState<string>('0300-1234567');

  const subtotal = items.reduce((sum, item) => sum + (item.deal.discountedPrice * item.quantity), 0);
  const originalTotal = items.reduce((sum, item) => sum + (item.deal.originalPrice * item.quantity), 0);
  const dealSavings = originalTotal - subtotal;
  const studentDiscountAmount = studentCardApplied ? Math.round(subtotal * 0.10) : 0;
  const grandTotal = Math.max(0, subtotal - studentDiscountAmount);
  const totalCombinedSavings = dealSavings + studentDiscountAmount;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsOrdered(true);
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg bg-slate-900 border-l border-emerald-500/30 flex flex-col h-full shadow-2xl transition-all duration-300 ${
          isUrdu ? 'urdu-text' : ''
        }`}
      >
        {/* Cart Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 relative">
              <ShoppingBag className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                {isUrdu ? 'انٹرایکٹو اسلام آباد باسکٹ' : 'Interactive Islamabad Basket'}
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </h2>
              <p className="text-xs text-emerald-400">
                {isUrdu ? 'ریسٹورنٹ و مارٹ ڈائریکٹ سیور' : 'Direct Restaurant & Mart Savings'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Modal View */}
        {isOrdered ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {isUrdu ? 'مبارک ہو! آرڈر محفوظ کر لیا گیا ہے' : 'Savings Locked & Order Logged!'}
            </h3>
            <p className="text-xs text-slate-300 mb-4 max-w-sm">
              {isUrdu 
                ? `آپ نے اس باسکٹ میں کل ${totalCombinedSavings.toLocaleString()} روپے بچائے ہیں! ریسٹورنٹ کو آپ کا آرڈر ارسال ہو چکا ہے۔`
                : `You successfully saved PKR ${totalCombinedSavings.toLocaleString()} on this order! Direct restaurant dispatcher notified.`
              }
            </p>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-left w-full max-w-xs text-xs space-y-1 mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Customer:</span>
                <span className="text-white font-semibold">{customerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Address:</span>
                <span className="text-white font-semibold">{deliveryAddress}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Grand Total:</span>
                <span className="text-emerald-400 font-bold">PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => {
                onClearCart();
                setIsOrdered(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              {isUrdu ? 'واپس براؤز کریں' : 'Continue Exploring Deals'}
            </button>
          </div>
        ) : (
          <>
            {/* Savings Banner */}
            {items.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border-b border-emerald-500/20 px-5 py-2.5 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-yellow-400" />
                  {isUrdu ? 'آپ کی کل اسلام آباد بچت:' : 'Your Total Islamabad Savings:'}
                </span>
                <span className="text-yellow-400 font-black text-sm">
                  PKR {totalCombinedSavings.toLocaleString()}
                </span>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-sm text-slate-300 font-semibold mb-1">
                    {isUrdu ? 'آپ کی باسکٹ خالی ہے' : 'Your Basket is Empty'}
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mb-4">
                    {isUrdu 
                      ? 'چیزئیئس، سیور، مونال یا اسلام آباد مارٹس سے ڈیلز پر کلک کریں اور انٹرایکٹو باسکٹ میں ڈالیں!'
                      : 'Browse deals from Cheezious, Savour, Monal, Tehzeeb or Islamabad Marts to drop items right here!'
                    }
                  </p>
                </div>
              ) : (
                items.map(item => (
                  <div
                    key={item.deal.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex gap-3 items-center group hover:border-emerald-500/40 transition-colors"
                  >
                    <img
                      src={item.deal.imageUrl}
                      alt={item.deal.title}
                      className="w-16 h-16 rounded-lg object-cover ring-1 ring-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-400 truncate">
                          {item.deal.restaurantName}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.deal.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate">
                        {isUrdu ? item.deal.titleUrdu : item.deal.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-white">
                            PKR {(item.deal.discountedPrice * item.quantity).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 line-through">
                            PKR {(item.deal.originalPrice * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center border border-slate-700 bg-slate-900 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.deal.id, -1)}
                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs text-white font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.deal.id, 1)}
                            className="px-2 py-0.5 text-xs text-slate-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-4">
                {/* Student Discount Toggle */}
                <div className="flex items-center justify-between p-3 bg-slate-900/90 border border-emerald-500/30 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-200 font-medium">
                      {isUrdu ? 'طلباء کارڈ ڈسکاؤنٹ (-10%)' : 'Islamabad Student Pass (-10%)'}
                    </span>
                  </div>
                  <button
                    onClick={() => setStudentCardApplied(!studentCardApplied)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      studentCardApplied ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {studentCardApplied ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>

                {/* Delivery details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400">Deliver to (ISB Sector):</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Contact Number:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Bill breakdown */}
                <div className="space-y-1.5 text-xs border-t border-slate-800/80 pt-3">
                  <div className="flex justify-between text-slate-400">
                    <span>{isUrdu ? 'سب ٹوٹل' : 'Original Subtotal'}:</span>
                    <span className="line-through">PKR {originalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>{isUrdu ? 'ڈیل بچت' : 'Deal Discount'}:</span>
                    <span>- PKR {dealSavings.toLocaleString()}</span>
                  </div>
                  {studentCardApplied && (
                    <div className="flex justify-between text-yellow-400">
                      <span>{isUrdu ? 'اسٹوڈنٹ بونس' : 'Student Bonus'}:</span>
                      <span>- PKR {studentDiscountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-white pt-1 border-t border-slate-800">
                    <span>{isUrdu ? 'قابلِ ادائیگی کل رقم' : 'Final Amount Payable'}:</span>
                    <span className="text-emerald-400">PKR {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout & Direct Order Actions */}
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
                  >
                    <span>{isUrdu ? 'آرڈر کنفرم کریں اور بچت حاصل کریں' : 'Lock Savings & Place Order'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex gap-2">
                    <a
                      href={items[0]?.deal.directOrderUrl || 'https://foodpanda.pk'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'ریسٹورنٹ ویب سائٹ' : 'Order on Restaurant Site'}</span>
                    </a>
                    <button
                      onClick={onClearCart}
                      className="px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                    >
                      {isUrdu ? 'صاف کریں' : 'Clear'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};


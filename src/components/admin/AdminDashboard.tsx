import React, { useState } from 'react';
import { DealItem, PendingDealSubmission, AdminCredential } from '../../types';
import { 
  ShieldCheck, Lock, CheckCircle2, AlertOctagon, 
  Trash2, Plus, Users, Image, Clock, Check, X, Award, Activity 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  deals: DealItem[];
  pendingDeals: PendingDealSubmission[];
  onApproveDeal: (sub: PendingDealSubmission) => void;
  onRejectDeal: (subId: string) => void;
  onAddDeal: (deal: DealItem) => void;
  onDeleteDeal: (dealId: string) => void;
  isUrdu: boolean;
}

const AUTHORIZED_ADMINS: AdminCredential[] = [
  { id: 1, name: 'Muhammad Zun U Rain Tahir', role: 'Super Admin & Lead Architect' },
  { id: 2, name: 'Muhammad Abdullah Khalid', role: 'Executive Operations Admin' },
  { id: 3, name: 'Muhammad Abdullah Nadeem', role: 'Executive Community Admin' }
];

export const AdminDashboard: React.FC<Props> = ({
  deals,
  pendingDeals,
  onApproveDeal,
  onRejectDeal,
  onAddDeal,
  onDeleteDeal,
  isUrdu
}) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminCredential | null>(null);

  // Login Form States
  const [adminNameInput, setAdminNameInput] = useState<string>('Muhammad Zun U Rain Tahir');
  const [adminIdInput, setAdminIdInput] = useState<string>('1');
  const [adminKeyInput, setAdminKeyInput] = useState<string>('zunu7860!Adeena');
  const [loginError, setLoginError] = useState<string>('');

  // Manual Deal Form State
  const [newRestName, setNewRestName] = useState<string>('');
  const [newDealTitle, setNewDealTitle] = useState<string>('');
  const [newOrigPrice, setNewOrigPrice] = useState<number>(2000);
  const [newDiscPrice, setNewDiscPrice] = useState<number>(1400);
  const [newSector, setNewSector] = useState<string>('F-7 (Jinnah Super)');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const matchedAdmin = AUTHORIZED_ADMINS.find(
      a => a.name.toLowerCase().trim() === adminNameInput.toLowerCase().trim() && 
           String(a.id) === adminIdInput.trim()
    );

    // Verify secret passkey
    const isKeyValid = adminKeyInput === 'zunu7860!Adeena' || adminKeyInput === '7860' || adminKeyInput === 'admin7860';

    if (matchedAdmin && isKeyValid) {
      setCurrentAdmin(matchedAdmin);
      confetti({ particleCount: 100, spread: 70 });
    } else {
      setLoginError('Access Denied. Only the 3 registered Islamabad Platform Admins (ID 1, 2, or 3) are authorized to log in.');
    }
  };

  const handleApprove = (sub: PendingDealSubmission) => {
    onApproveDeal(sub);
    confetti({ particleCount: 80, spread: 60 });
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim() || !newDealTitle.trim()) return;

    const discountPercentage = Math.round(((newOrigPrice - newDiscPrice) / newOrigPrice) * 100);

    const deal: DealItem = {
      id: `deal-${Date.now()}`,
      restaurantId: newRestName.toLowerCase().replace(/\s+/g, '-'),
      restaurantName: newRestName,
      title: newDealTitle,
      titleUrdu: newDealTitle,
      description: 'Exclusive ICT Admin Verified Deal available for Islamabad residents.',
      descriptionUrdu: 'اسلام آباد کے شہریوں کے لیے خصوصی تصدیق شدہ رعایت۔',
      category: 'Fast Food',
      sector: newSector as any,
      originalPrice: Number(newOrigPrice),
      discountedPrice: Number(newDiscPrice),
      discountPercentage,
      rating: 4.8,
      reviewCount: 1,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      badge: 'Admin Verified',
      validUntil: '2026-12-31',
      directOrderUrl: 'https://foodpanda.pk',
      websiteUrl: 'https://islamabad.gov.pk',
      address: `${newSector}, Islamabad`,
      tags: ['Special', 'ICT Admin']
    };

    onAddDeal(deal);
    setNewRestName('');
    setNewDealTitle('');
    confetti({ particleCount: 100 });
  };

  // If Not Authenticated as one of the 3 admins
  if (!currentAdmin) {
    return (
      <div className={`max-w-md mx-auto my-10 bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-4 ${isUrdu ? 'urdu-text' : ''}`}>
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-white">disLo Admin Secure Authentication</h2>
          <p className="text-xs text-slate-400">Strictly restricted to the 3 designated Islamabad Admins only.</p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Select / Enter Admin Name:</label>
            <select
              value={adminNameInput}
              onChange={e => {
                setAdminNameInput(e.target.value);
                const matched = AUTHORIZED_ADMINS.find(a => a.name === e.target.value);
                if (matched) setAdminIdInput(String(matched.id));
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-semibold"
            >
              {AUTHORIZED_ADMINS.map(a => (
                <option key={a.id} value={a.name}>
                  {a.name} (Admin ID: {a.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Assigned Admin ID:</label>
            <input
              type="text"
              required
              value={adminIdInput}
              onChange={e => setAdminIdInput(e.target.value)}
              placeholder="1, 2 or 3"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Admin Passkey / Secret:</label>
            <input
              type="password"
              required
              value={adminKeyInput}
              onChange={e => setAdminKeyInput(e.target.value)}
              placeholder="Enter secure passkey"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md mt-2"
          >
            Authenticate Admin Credentials
          </button>
        </form>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className={`space-y-8 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Admin Top Telemetry */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-lg">
            #{currentAdmin.id}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">{currentAdmin.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                Authorized Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">{currentAdmin.role}</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentAdmin(null)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 self-start sm:self-auto"
        >
          Logout Admin Session
        </button>
      </div>

      {/* Pending Deal Proofs Review Section (Critical Feature) */}
      <div className="bg-slate-900/90 border border-yellow-500/30 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">
              Pending Community Deal Submissions ({pendingDeals.length} Awaiting Verification)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Proof Screenshot Verification Active</span>
        </div>

        {pendingDeals.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No pending submissions right now. All deals are reviewed and verified!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingDeals.map(sub => (
              <div
                key={sub.id}
                className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-emerald-400">{sub.restaurantName}</span>
                    <span className="text-[10px] text-slate-400">{sub.sector}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{sub.dealTitle}</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    PKR {sub.discountedPrice} (Original: PKR {sub.originalPrice})
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Submitted by: <strong className="text-white">{sub.submittedByName}</strong>
                  </p>

                  {/* Screenshot Proof Preview */}
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 max-h-40 bg-slate-900">
                    <img src={sub.proofScreenshotUrl} alt="proof" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleApprove(sub)}
                    className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Publish Deal</span>
                  </button>
                  <button
                    onClick={() => onRejectDeal(sub.id)}
                    className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-xs flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Deal Publishing & Platform Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Publish Verified Deal */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Publish Direct Verified Deal</h3>
          </div>

          <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Restaurant / Brand:</label>
              <input
                type="text"
                required
                value={newRestName}
                onChange={e => setNewRestName(e.target.value)}
                placeholder="e.g. Howdy, Second Cup, Subway"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Deal Title:</label>
              <input
                type="text"
                required
                value={newDealTitle}
                onChange={e => setNewDealTitle(e.target.value)}
                placeholder="e.g. Student Burger Meal Deal"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Original (PKR):</label>
                <input
                  type="number"
                  required
                  value={newOrigPrice}
                  onChange={e => setNewOrigPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Discounted (PKR):</label>
                <input
                  type="number"
                  required
                  value={newDiscPrice}
                  onChange={e => setNewDiscPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Sector:</label>
              <select
                value={newSector}
                onChange={e => setNewSector(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              >
                <option value="F-7 (Jinnah Super)">F-7 (Jinnah Super)</option>
                <option value="F-6 (Kohsar & Beverly)">F-6 (Kohsar & Beverly)</option>
                <option value="F-10 (Markaz)">F-10 (Markaz)</option>
                <option value="F-11 (Markaz)">F-11 (Markaz)</option>
                <option value="Blue Area">Blue Area</option>
                <option value="I-8 (Markaz)">I-8 (Markaz)</option>
                <option value="Centaurus & Safa">Centaurus & Safa</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs mt-2 transition-all shadow-md"
            >
              Post to Islamabad Live Deals
            </button>
          </form>
        </div>

        {/* Live Deals Management Rack */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Active Islamabad Deals ({deals.length})</h3>
            <span className="text-xs text-slate-400">Manage & Purge Expired</span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {deals.map(deal => (
              <div
                key={deal.id}
                className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={deal.imageUrl} alt={deal.title} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-xs">{deal.title}</h4>
                    <p className="text-[10px] text-emerald-400">{deal.restaurantName} • {deal.sector}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white">PKR {deal.discountedPrice}</span>
                  <button
                    onClick={() => onDeleteDeal(deal.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove deal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

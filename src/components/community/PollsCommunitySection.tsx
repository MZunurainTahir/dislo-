import React, { useState, useRef } from 'react';
import { CommunityPoll, PendingDealSubmission, UserAccount, Sector, DealCategory } from '../../types';
import { 
  Vote, Plus, ShieldCheck, Sparkles, Upload, 
  Award, CheckCircle2, AlertTriangle, Users, MapPin, Calendar, Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  polls: CommunityPoll[];
  currentUser: UserAccount;
  onVotePoll: (pollId: string, optionId: string) => void;
  onCreatePoll: (poll: CommunityPoll) => void;
  onSubmitDealProof: (submission: PendingDealSubmission) => void;
  onUpdatePfp: (pfpUrl: string, name: string) => void;
  isUrdu: boolean;
}

export const PollsCommunitySection: React.FC<Props> = ({
  polls,
  currentUser,
  onVotePoll,
  onCreatePoll,
  onSubmitDealProof,
  onUpdatePfp,
  isUrdu
}) => {
  const [showPollModal, setShowPollModal] = useState<boolean>(false);
  const [showDealModal, setShowDealModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Poll Form State
  const [pollTitle, setPollTitle] = useState<string>('');
  const [pollVenue, setPollVenue] = useState<string>('Trail 5 Gate / Monal');
  const [pollDate, setPollDate] = useState<string>('Sunday 06:00 AM');
  const [pollCategory, setPollCategory] = useState<'Hike Meetup' | 'Food Outing' | 'Sunset Chai Plan'>('Hike Meetup');
  const [pollOptions, setPollOptions] = useState<string[]>(['Yes, Count me in!', 'Prefer another time / location']);

  // Deal Submission Form State
  const [dealRestName, setDealRestName] = useState<string>('');
  const [dealTitle, setDealTitle] = useState<string>('');
  const [dealSector, setDealSector] = useState<Sector>('F-7 (Jinnah Super)');
  const [dealCategory, setDealCategory] = useState<DealCategory>('Fast Food');
  const [dealOrigPrice, setDealOrigPrice] = useState<number>(1800);
  const [dealDiscPrice, setDealDiscPrice] = useState<number>(1200);
  const [dealScreenshot, setDealScreenshot] = useState<string>('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80');

  // PFP Upload State
  const [tempName, setTempName] = useState<string>(currentUser.fullName);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dealProofFileRef = useRef<HTMLInputElement | null>(null);

  const handleCreatePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollTitle.trim()) return;

    const newPoll: CommunityPoll = {
      id: `poll-${Date.now()}`,
      creatorName: currentUser.fullName,
      creatorAvatar: currentUser.avatar,
      title: pollTitle,
      category: pollCategory,
      venue: pollVenue,
      dateProposed: pollDate,
      options: pollOptions.map((opt, i) => ({ id: `opt-${i + 1}`, text: opt, votes: 0 })),
      votedUserIds: [],
      createdAt: 'Just now'
    };

    onCreatePoll(newPoll);
    setShowPollModal(false);
    setPollTitle('');
    confetti({ particleCount: 90 });
  };

  const handleDealSubmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealRestName.trim() || !dealTitle.trim()) return;

    const newSub: PendingDealSubmission = {
      id: `sub-${Date.now()}`,
      submittedByUserId: currentUser.id,
      submittedByName: currentUser.fullName,
      restaurantName: dealRestName,
      dealTitle: dealTitle,
      sector: dealSector,
      category: dealCategory,
      originalPrice: Number(dealOrigPrice),
      discountedPrice: Number(dealDiscPrice),
      proofScreenshotUrl: dealScreenshot,
      status: 'Pending Admin Verification',
      submittedAt: 'Just now',
      notes: 'Submitted with receipt/banner screenshot proof for admin review.'
    };

    onSubmitDealProof(newSub);
    setShowDealModal(false);
    setDealRestName('');
    setDealTitle('');
    confetti({ particleCount: 100 });
    alert('Deal submitted with proof! It has been dispatched to the 3 Admins for review.');
  };

  const handlePfpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdatePfp(reader.result as string, tempName);
      setShowProfileModal(false);
      confetti({ particleCount: 60 });
    };
    reader.readAsDataURL(file);
  };

  const handleDealProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDealScreenshot(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`space-y-8 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Community Header & Safety Policy */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                {isUrdu ? 'اسلام آباد محفوظ کمیونٹی اور پولز ہب' : 'Safe Islamabad Community & Outing Polls'}
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Strict Anti-Spam
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isUrdu 
                  ? 'صرف ہائیکنگ، فوڈ پلانز اور چائے سیشنز کے لیے پولز۔ ذاتی معلومات، چیٹنگ یا فلرٹنگ کی سختی سے ممانعت ہے۔'
                  : 'Structured outdoor & food plans only. Zero flirting, no personal contacts, strictly family & student safe.'
                }
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowPollModal(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isUrdu ? 'نیا آؤٹنگ پول بنائیں' : 'Create Outing Poll'}</span>
            </button>
            <button
              onClick={() => setShowDealModal(true)}
              className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-yellow-400/20 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{isUrdu ? 'ڈیل مع ثبوت پوسٹ کریں' : 'Post Deal with Proof SS'}</span>
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
            >
              <img src={currentUser.avatar} alt="pfp" className="w-5 h-5 rounded-full object-cover" />
              <span>Change PFP</span>
            </button>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-3 bg-slate-950/70 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Code of Conduct:</strong> All meetups are democratically organized via structured polls. No private direct messages or harassment is permitted.
          </span>
        </div>
      </div>

      {/* Gamified Partner Achievements & Commission Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Your Partner Badge</span>
            <span className="text-sm font-black text-amber-400">{currentUser.partnerTier}</span>
          </div>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Deals Approved by Admin</span>
          <span className="text-xl font-black text-white">{currentUser.publishedDealsCount} Verified Deals</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Commission Earned</span>
          <span className="text-xl font-black text-emerald-400">PKR {currentUser.earnedCommissionPkr.toLocaleString()}</span>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Next Destination Badge</span>
          <span className="text-xs font-bold text-yellow-300">Platinum Partner (At 10 Deals)</span>
        </div>
      </div>

      {/* Active Community Polls */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          <span>{isUrdu ? 'اسلام آباد آؤٹنگ اور کھانے کے لائیو پولز' : 'Live Community Outing & Food Polls'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map(poll => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

            return (
              <div
                key={poll.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-4 transition-colors"
              >
                {/* Poll Creator & Meta */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <img src={poll.creatorAvatar} alt={poll.creatorName} className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500/50" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{poll.creatorName}</h4>
                      <p className="text-[10px] text-slate-400">{poll.createdAt}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                    {poll.category}
                  </span>
                </div>

                {/* Poll Title */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{poll.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <MapPin className="w-3 h-3" /> {poll.venue}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3" /> {poll.dateProposed}
                    </span>
                  </div>
                </div>

                {/* Poll Options */}
                <div className="space-y-2 pt-1">
                  {poll.options.map(opt => {
                    const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          onVotePoll(poll.id, opt.id);
                          confetti({ particleCount: 50, spread: 40 });
                        }}
                        className="w-full relative text-left p-3 rounded-xl border border-slate-800 hover:border-emerald-500/50 bg-slate-950/70 overflow-hidden group transition-all"
                      >
                        {/* Progress Fill Bar */}
                        <div
                          className="absolute inset-0 bg-emerald-500/15 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />

                        <div className="relative z-10 flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-200 group-hover:text-white">
                            {opt.text}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-400">
                            {opt.votes} ({percentage}%)
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] text-slate-500 text-right">
                  Total Votes: {totalVotes} Islamabad Citizens
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Create Poll */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Vote className="w-5 h-5 text-emerald-400" />
              <span>Create Outing / Food Poll</span>
            </h3>

            <form onSubmit={handleCreatePollSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Poll Title / Plan:</label>
                <input
                  type="text"
                  required
                  value={pollTitle}
                  onChange={e => setPollTitle(e.target.value)}
                  placeholder="e.g. Saturday Evening Hike on Trail 3 or Trail 5?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category:</label>
                <select
                  value={pollCategory}
                  onChange={e => setPollCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Hike Meetup">Hike Meetup</option>
                  <option value="Food Outing">Food Outing</option>
                  <option value="Sunset Chai Plan">Sunset Chai Plan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Proposed Venue:</label>
                  <input
                    type="text"
                    required
                    value={pollVenue}
                    onChange={e => setPollVenue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Date & Time:</label>
                  <input
                    type="text"
                    required
                    value={pollDate}
                    onChange={e => setPollDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Publish Poll
                </button>
                <button
                  type="button"
                  onClick={() => setShowPollModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Post Deal with Proof Screenshot */}
      {showDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-yellow-500/40 rounded-3xl p-6 text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-yellow-400" />
                <h3 className="text-base font-bold text-white">Post Islamabad Deal (Requires Screenshot Proof)</h3>
              </div>
              <button onClick={() => setShowDealModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              To prevent fake discounts, attach a photo of the restaurant bill, receipt, or official flyer. Admin will review and approve.
            </p>

            <form onSubmit={handleDealSubmissionSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Restaurant / Brand Name:</label>
                  <input
                    type="text"
                    required
                    value={dealRestName}
                    onChange={e => setDealRestName(e.target.value)}
                    placeholder="e.g. Howdy, Second Cup"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Deal Title:</label>
                  <input
                    type="text"
                    required
                    value={dealTitle}
                    onChange={e => setDealTitle(e.target.value)}
                    placeholder="e.g. BOGO Burger Platter"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Sector:</label>
                  <select
                    value={dealSector}
                    onChange={e => setDealSector(e.target.value as Sector)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  >
                    <option value="F-7 (Jinnah Super)">F-7</option>
                    <option value="F-6 (Kohsar & Beverly)">F-6</option>
                    <option value="F-10 (Markaz)">F-10</option>
                    <option value="F-11 (Markaz)">F-11</option>
                    <option value="Blue Area">Blue Area</option>
                    <option value="I-8 (Markaz)">I-8</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Original (PKR):</label>
                  <input
                    type="number"
                    required
                    value={dealOrigPrice}
                    onChange={e => setDealOrigPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Discounted (PKR):</label>
                  <input
                    type="number"
                    required
                    value={dealDiscPrice}
                    onChange={e => setDealDiscPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white"
                  />
                </div>
              </div>

              {/* Upload Proof Screenshot */}
              <div>
                <label className="text-slate-400 block mb-1">Upload Receipt or Flyer Screenshot Proof:</label>
                <input
                  type="file"
                  ref={dealProofFileRef}
                  onChange={handleDealProofUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => dealProofFileRef.current?.click()}
                  className="border border-dashed border-slate-700 hover:border-yellow-400 rounded-2xl p-4 text-center cursor-pointer bg-slate-950 flex flex-col items-center justify-center gap-2"
                >
                  {dealScreenshot ? (
                    <img src={dealScreenshot} alt="proof" className="max-h-36 rounded-xl object-contain shadow" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-yellow-400" />
                      <span className="text-slate-300">Click to attach screenshot from your device</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black rounded-xl text-xs"
                >
                  Submit for Admin Approval
                </button>
                <button
                  type="button"
                  onClick={() => setShowDealModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change PFP from local system */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 space-y-4 text-center">
            <h3 className="text-base font-bold text-white">Update Your Profile & PFP</h3>
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto ring-4 ring-emerald-500/40 relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <img src={currentUser.avatar} alt="pfp" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white font-bold">
                Change Photo
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePfpChange}
              accept="image/*"
              className="hidden"
            />

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Display Name:</label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Upload from Computer
              </button>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


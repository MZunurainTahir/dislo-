import React, { useState } from 'react';
import { UserAccount, GenerationType, Sector } from '../../types';
import { ShieldCheck, Sparkles, User, Mail, Lock, Calendar, AtSign, Compass, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onLoginSuccess: (user: UserAccount) => void;
  onClose?: () => void;
  isUrdu: boolean;
}

export const AuthModal: React.FC<Props> = ({ isOpen, onLoginSuccess, onClose, isUrdu }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);

  // Form Fields
  const [firstName, setFirstName] = useState<string>('Muhammad Zun U Rain');
  const [lastName, setLastName] = useState<string>('Tahir');
  const [dob, setDob] = useState<string>('2003-05-14');
  const [email, setEmail] = useState<string>('zunuraintahir5@gmail.com');
  const [username, setUsername] = useState<string>('zunu_isb');
  const [password, setPassword] = useState<string>('password123');
  const [confirmPassword, setConfirmPassword] = useState<string>('password123');
  const [generation, setGeneration] = useState<GenerationType>('Gen Z');
  const [sector, setSector] = useState<Sector>('F-7 (Jinnah Super)');
  const [locationChecked, setLocationChecked] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const account: UserAccount = {
      id: `usr-${Date.now()}`,
      firstName: firstName || 'Islamabadi',
      lastName: lastName || 'Citizen',
      fullName: `${firstName} ${lastName}`.trim(),
      dob,
      email,
      username: username.startsWith('@') ? username.slice(1) : username,
      generation,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      sector,
      isVerifiedPakistani: locationChecked,
      isPremium: false,
      publishedDealsCount: 0,
      partnerTier: 'Bronze Scout',
      earnedCommissionPkr: 0,
      points: 250,
      savedDeals: [],
      friends: ['user-ali', 'user-sara'],
      friendRequests: []
    };

    confetti({ particleCount: 120, spread: 80 });
    onLoginSuccess(account);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className={`w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(16,185,129,0.2)] text-slate-100 space-y-5 max-h-[90vh] overflow-y-auto ${
          isUrdu ? 'urdu-text' : ''
        }`}
      >
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black">
            <span>🏔️ disLo Super-App</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isSignUp ? (isUrdu ? 'disLo میں خوش آمدید' : 'Create Your disLo Account') : (isUrdu ? 'disLo لاگ ان' : 'Welcome Back to disLo')}
          </h2>
          <p className="text-xs text-slate-400">
            {isUrdu 
              ? 'اسلام آباد کے شہریوں اور طلباء کے لیے پریمیم لائف اسٹائل، ڈیلز و کمیونٹی'
              : 'Exclusive to Islamabad & Pakistan. Live deals, Margalla spots & real community.'
            }
          </p>
        </div>

        {/* Location & Pakistani Citizenship Check Badge */}
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-200 font-semibold">
              {isUrdu ? 'اسلام آباد و پاکستان ویریفائیڈ زون' : 'Verified Location: Islamabad, Pakistan'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px]">
            Eligible ✓
          </span>
        </div>

        {/* Switcher Tab */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              isSignUp ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isUrdu ? 'سائن اپ (نیا اکاؤنٹ)' : 'Sign Up (New User)'}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 rounded-lg font-bold transition-all ${
              !isSignUp ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isUrdu ? 'لاگ ان' : 'Sign In'}
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {isSignUp && (
            <>
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">First Name:</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Last Name:</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* DOB & Username */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Date of Birth:</label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Username:</label>
                  <div className="relative">
                    <AtSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="e.g. zunu_isb"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Generation Selector */}
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Choose Your Generation (Influences Slangs & Vibe Bird):</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Gen Z', 'Gen Alpha', 'Millennial'] as GenerationType[]).map(gen => (
                    <button
                      key={gen}
                      type="button"
                      onClick={() => setGeneration(gen)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        generation === gen
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {gen}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector Selector */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Your Islamabad Sector / Location:</span>
                </label>
                <select
                  value={sector}
                  onChange={e => setSector(e.target.value as Sector)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="F-7 (Jinnah Super)">F-7 (Jinnah Super)</option>
                  <option value="F-6 (Kohsar & Beverly)">F-6 (Kohsar & Beverly)</option>
                  <option value="F-10 (Markaz)">F-10 (Markaz)</option>
                  <option value="F-11 (Markaz)">F-11 (Markaz)</option>
                  <option value="Blue Area">Blue Area</option>
                  <option value="I-8 (Markaz)">I-8 (Markaz)</option>
                  <option value="G-9 (Karachi Company)">G-9 (Karachi Company)</option>
                  <option value="E-11">E-11</option>
                  <option value="Centaurus & Safa">Centaurus & Safa</option>
                  <option value="Margalla Hills & Monal">Margalla Hills & Monal</option>
                  <option value="DHA & Bahria Town">DHA & Bahria Town</option>
                </select>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Email Address:</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className={`grid ${isSignUp ? 'grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Confirm Password:</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all pt-2.5"
          >
            <span>{isSignUp ? (isUrdu ? 'اکاؤنٹ بنائیں اور شروع کریں' : 'Join disLo Capital App') : (isUrdu ? 'لاگ ان کریں' : 'Enter disLo')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};


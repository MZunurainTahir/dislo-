import React, { useState } from 'react';
import { CitizenComplaint, Sector } from '../../types';
import { 
  AlertCircle, ShieldAlert, PhoneCall, CheckCircle2, 
  Clock, Search, FileText, Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isUrdu: boolean;
}

const INITIAL_COMPLAINTS: CitizenComplaint[] = [
  {
    id: 'cmp-1',
    trackingId: 'ISB-CMP-7842',
    restaurantOrPlace: 'Fast Food Stall near F-10 Markaz',
    sector: 'F-10 (Markaz)',
    issueType: 'Overcharging / Fake Deal',
    description: 'BOGO voucher was advertised on banner but cashier refused to honor and charged full 1,800 PKR.',
    contactEmail: 'zunurain@example.com',
    contactPhone: '0300-1234567',
    status: 'Under Investigation',
    resolutionNotes: 'ICT Consumer Protection officer assigned for verification.',
    createdAt: '2026-11-06'
  },
  {
    id: 'cmp-2',
    trackingId: 'ISB-CMP-4910',
    restaurantOrPlace: 'Trail 3 Margalla Viewpoint',
    sector: 'Margalla Hills & Monal',
    issueType: 'Trail Littering',
    description: 'Empty plastic bottles and disposable cups left near Rest Point 2. Needs CDA eco-bins.',
    contactEmail: 'citizen@isb.gov.pk',
    contactPhone: '0321-9876543',
    status: 'Resolved',
    resolutionNotes: 'CDA Margalla Sanitation team cleared the area and installed 2 eco-friendly waste bins.',
    createdAt: '2026-11-04'
  }
];

export const ComplaintsSection: React.FC<Props> = ({ isUrdu }) => {
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(INITIAL_COMPLAINTS);
  const [trackingSearch, setTrackingSearch] = useState<string>('');
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Form State
  const [place, setPlace] = useState<string>('');
  const [sector, setSector] = useState<Sector>('F-7 (Jinnah Super)');
  const [issueType, setIssueType] = useState<CitizenComplaint['issueType']>('Hygiene & Food Safety');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('citizen@isb.pk');
  const [phone, setPhone] = useState<string>('0300-0000000');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!place.trim() || !description.trim()) return;

    const newId = `ISB-CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: CitizenComplaint = {
      id: `cmp-${Date.now()}`,
      trackingId: newId,
      restaurantOrPlace: place,
      sector,
      issueType,
      description,
      contactEmail: email,
      contactPhone: phone,
      status: 'Received',
      resolutionNotes: 'Complaint logged into ICT citizen portal. Assigned to inspection team.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setComplaints(prev => [newRecord, ...prev]);
    setSubmittedId(newId);
    setShowSubmitModal(false);
    setPlace('');
    setDescription('');
    confetti({ particleCount: 100 });
  };

  const filteredComplaints = trackingSearch.trim()
    ? complaints.filter(c => c.trackingId.toLowerCase().includes(trackingSearch.toLowerCase()))
    : complaints;

  return (
    <div className={`space-y-8 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-2xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                {isUrdu ? 'شہری شکایات و صارفی تحفظ پورٹل اسلام آباد' : 'Islamabad Citizen Voice & Consumer Rights Portal'}
              </h2>
              <p className="text-xs text-slate-400">
                {isUrdu 
                  ? 'ناقص خوراک، زائد قیمت، جھوٹی ڈیلز یا مارگلہ پر کچرا پھینکنے کی باضابطہ شکایت درج کرائیں'
                  : 'Report unhygienic restaurants, overpricing, fake discounts or Margalla littering with live tracking'
                }
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all self-start md:self-auto"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{isUrdu ? 'نئی شکایت درج کریں' : 'Lodge Official Complaint'}</span>
          </button>
        </div>

        {/* Emergency Helplines Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="block text-[10px] text-slate-500">Rescue ICT</span>
              <span className="font-black text-white text-sm">1122</span>
            </div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-blue-400" />
            <div>
              <span className="block text-[10px] text-slate-500">Police Emergency</span>
              <span className="font-black text-white text-sm">15</span>
            </div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-yellow-400" />
            <div>
              <span className="block text-[10px] text-slate-500">CDA Citizen Portal</span>
              <span className="font-black text-white text-sm">1819</span>
            </div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <div>
              <span className="block text-[10px] text-slate-500">ICT Food Authority</span>
              <span className="font-black text-white text-sm">0800-02345</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Success Notice */}
      {submittedId && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Complaint successfully registered! Your Tracking ID is <strong className="text-white font-mono">{submittedId}</strong></span>
          </div>
          <button onClick={() => setSubmittedId(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Tracking Search & Status List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>{isUrdu ? 'شکایات کی لائیو ٹریکنگ' : 'Live Complaint Status & ICT Resolutions'}</span>
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={trackingSearch}
              onChange={e => setTrackingSearch(e.target.value)}
              placeholder="Search Tracking ID (e.g. 7842)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredComplaints.map(item => (
            <div
              key={item.id}
              className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1 rounded-lg">
                    {item.trackingId}
                  </span>
                  <h4 className="text-sm font-bold text-white">{item.restaurantOrPlace}</h4>
                  <span className="text-xs text-slate-400">({item.sector})</span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                  item.status === 'Resolved' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <p><strong className="text-slate-400">Issue:</strong> {item.issueType}</p>
                <p><strong className="text-slate-400">Details:</strong> {item.description}</p>
                {item.resolutionNotes && (
                  <p className="text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 p-2.5 rounded-xl mt-2">
                    <strong>Action Taken:</strong> {item.resolutionNotes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lodge Complaint Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Submit Citizen Complaint (Islamabad)</span>
            </h3>

            <form onSubmit={handleSubmitComplaint} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Restaurant or Place Name:</label>
                <input
                  type="text"
                  required
                  value={place}
                  onChange={e => setPlace(e.target.value)}
                  placeholder="e.g. Savour Foods, Cheezious, Trail 3"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Sector:</label>
                  <select
                    value={sector}
                    onChange={e => setSector(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="F-6 (Kohsar & Beverly)">F-6</option>
                    <option value="F-7 (Jinnah Super)">F-7</option>
                    <option value="F-10 (Markaz)">F-10</option>
                    <option value="F-11 (Markaz)">F-11</option>
                    <option value="Blue Area">Blue Area</option>
                    <option value="I-8 (Markaz)">I-8</option>
                    <option value="Centaurus & Safa">Centaurus & Safa</option>
                    <option value="Margalla Hills & Monal">Margalla Hills</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Issue Category:</label>
                  <select
                    value={issueType}
                    onChange={e => setIssueType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="Hygiene & Food Safety">Hygiene & Food Safety</option>
                    <option value="Overcharging / Fake Deal">Overcharging / Fake Deal</option>
                    <option value="Trail Littering">Trail Littering</option>
                    <option value="Staff Behavior">Staff Behavior</option>
                    <option value="Delay / Quality">Delay / Quality</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Detailed Explanation:</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe what occurred, bill details, or health concerns..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Your Email (for updates):</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number:</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs"
                >
                  Submit Official Report
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


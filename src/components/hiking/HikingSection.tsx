import React, { useState } from 'react';
import { MargallaTrail, HikingGroup } from '../../types';
import { 
  Mountain, Users, Clock, Footprints, Droplets, AlertTriangle, 
  CheckCircle, Plus, ExternalLink, ShieldAlert, Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  trails: MargallaTrail[];
  groups: HikingGroup[];
  isUrdu: boolean;
}

export const HikingSection: React.FC<Props> = ({ trails, groups: initialGroups, isUrdu }) => {
  const [groups, setGroups] = useState<HikingGroup[]>(initialGroups);
  const [selectedTrail, setSelectedTrail] = useState<MargallaTrail>(trails[0]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(['group-1']);

  // New Group Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPace, setNewPace] = useState<'Casual Walk' | 'Brisk Walk' | 'Running' | 'Intense Hike'>('Brisk Walk');
  const [newMeetingPoint, setNewMeetingPoint] = useState<string>('Trail 5 Entrance, F-5');
  const [newDate, setNewDate] = useState<string>('Saturday 6:00 AM');

  const toggleJoinGroup = (groupId: string) => {
    const isJoined = joinedGroupIds.includes(groupId);
    if (isJoined) {
      setJoinedGroupIds(prev => prev.filter(id => id !== groupId));
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, currentParticipants: g.currentParticipants - 1 } : g));
    } else {
      setJoinedGroupIds(prev => [...prev, groupId]);
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, currentParticipants: g.currentParticipants + 1 } : g));
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGroup: HikingGroup = {
      id: `group-${Date.now()}`,
      title: newTitle,
      titleUrdu: newTitle,
      trailId: selectedTrail.id,
      trailName: selectedTrail.name,
      organizer: 'Muhammad Zunurain Tahir',
      organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      meetingPoint: newMeetingPoint,
      date: newDate,
      time: '06:00 AM',
      maxParticipants: 30,
      currentParticipants: 1,
      pace: newPace,
      whatsappGroupUrl: 'https://chat.whatsapp.com/ISBHikersOfficial',
      joinedUserIds: ['current-user']
    };

    setGroups(prev => [newGroup, ...prev]);
    setJoinedGroupIds(prev => [...prev, newGroup.id]);
    setShowCreateModal(false);
    setNewTitle('');
    confetti({ particleCount: 100 });
  };

  return (
    <div className={`space-y-8 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 p-6 sm:p-8 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Mountain className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'مارگلہ ہلز نیشنل پارک اسلام آباد' : 'Margalla Hills National Park ICT'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {isUrdu ? 'مارگلہ ٹریکس، رننگ کلب اور ہائیکنگ نیٹ ورک' : 'Margalla Trails, Running Club & Hiking Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isUrdu 
              ? 'ٹرائل 3، ٹرائل 5 اور ایف 9 پارک کے لائیو حالات، واٹس ایپ رننگ گروپس اور دوستوں کے ساتھ پہاڑوں کا سفر۔'
              : 'Real-time trail status, weekend sunrise running groups, elevation telemetry & WhatsApp hiker communities.'
            }
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isUrdu ? 'نیا رننگ / ہائیکنگ گروپ بنائیں' : 'Create Running / Hiking Group'}</span>
            </button>
            <a
              href="https://chat.whatsapp.com/ISBHikersOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'واٹس ایپ گروپ جوائن کریں' : 'Join WhatsApp Group'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Margalla Trails Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Footprints className="w-5 h-5 text-emerald-400" />
          <span>{isUrdu ? 'اسلام آباد کے مشہور ٹریکس' : 'Explore Margalla Trails'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trails.map(trail => (
            <div
              key={trail.id}
              onClick={() => setSelectedTrail(trail)}
              className={`cursor-pointer rounded-2xl overflow-hidden border p-4 transition-all duration-300 ${
                selectedTrail.id === trail.id
                  ? 'bg-slate-900 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="h-32 rounded-xl overflow-hidden mb-3 relative">
                <img src={trail.imageUrl} alt={trail.name} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                  trail.difficulty === 'Easy' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                }`}>
                  {trail.difficulty}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white truncate">
                {isUrdu ? trail.nameUrdu : trail.name}
              </h3>

              <div className="mt-2.5 grid grid-cols-3 gap-1 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                <div>
                  <span className="block text-[9px] uppercase text-slate-500">Dist</span>
                  <span className="font-bold text-white">{trail.distanceKm} km</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase text-slate-500">Elev</span>
                  <span className="font-bold text-white">{trail.elevationMeters} m</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase text-slate-500">Time</span>
                  <span className="font-bold text-white">{trail.avgTimeMinutes}m</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Trail Deep Dive & Running / Walking Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trail Detail Card */}
        <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              {selectedTrail.trailNumber}
            </span>
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <Award className="w-3.5 h-3.5" />
              <span>Scenic {selectedTrail.scenicRating}/5</span>
            </div>
          </div>

          <h3 className="text-lg font-black text-white">
            {isUrdu ? selectedTrail.nameUrdu : selectedTrail.name}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {isUrdu ? selectedTrail.descriptionUrdu : selectedTrail.description}
          </p>

          <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Start:</span>
              <span className="text-white font-medium text-right max-w-[180px] truncate">{selectedTrail.startingPoint}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Summit:</span>
              <span className="text-white font-medium text-right max-w-[180px] truncate">{selectedTrail.endingPoint}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Water Points:</span>
              <span className="text-emerald-400 font-bold">{selectedTrail.waterPoints} Springs / Kiosks</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Active Hikers Now:</span>
              <span className="text-yellow-400 font-bold">~{selectedTrail.activeHikersCount} people</span>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Margalla Wildlife & Safety Alert:</span>
            </div>
            <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
              {selectedTrail.safetyTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Running & Hiking Groups Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>{isUrdu ? 'فعال رننگ اور ہائیکنگ گروپس' : 'Active Islamabad Meetup & Running Groups'}</span>
            </h3>
            <span className="text-xs text-slate-400">{groups.length} Meetups</span>
          </div>

          <div className="space-y-3">
            {groups.map(group => {
              const isJoined = joinedGroupIds.includes(group.id);
              return (
                <div
                  key={group.id}
                  className="p-4 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={group.organizerAvatar}
                      alt={group.organizer}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-400">{group.trailName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                          {group.pace}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {isUrdu ? group.titleUrdu : group.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        📍 {group.meetingPoint} • 🕒 {group.date} at {group.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right text-xs">
                      <span className="font-bold text-white">{group.currentParticipants}</span>
                      <span className="text-slate-500">/{group.maxParticipants} hikers</span>
                    </div>

                    <button
                      onClick={() => toggleJoinGroup(group.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isJoined
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      {isJoined ? 'Joined ✓' : 'Join Group'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mountain className="w-5 h-5 text-emerald-400" />
              <span>{isUrdu ? 'نیا رننگ / ہائیکنگ گروپ بنائیں' : 'Create New Running / Hiking Group'}</span>
            </h3>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Group / Meetup Name:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Saturday Trail 5 Sunrise Runners"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Pace:</label>
                  <select
                    value={newPace}
                    onChange={e => setNewPace(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  >
                    <option value="Casual Walk">Casual Walk</option>
                    <option value="Brisk Walk">Brisk Walk</option>
                    <option value="Running">Running</option>
                    <option value="Intense Hike">Intense Hike</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Date & Time:</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    placeholder="e.g. Sunday 6:00 AM"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Meeting Point:</label>
                <input
                  type="text"
                  value={newMeetingPoint}
                  onChange={e => setNewMeetingPoint(e.target.value)}
                  placeholder="e.g. Trail 5 Gate / Bolan Gate F-9"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Publish Group
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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


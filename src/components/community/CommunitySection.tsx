import React, { useState } from 'react';
import { 
  CommunityChannel, ChatMessage, UserProfile 
} from '../../types';
import { 
  MessageSquare, Users, Plus, Send, Image, Smile, Heart, 
  CheckCircle, UserPlus, ShieldCheck, Sparkles, Hash, Search 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  channels: CommunityChannel[];
  initialMessages: Record<string, ChatMessage[]>;
  currentUser: UserProfile;
  isUrdu: boolean;
}

export const CommunitySection: React.FC<Props> = ({
  channels: initialChannels,
  initialMessages,
  currentUser: initialUser,
  isUrdu
}) => {
  const [channels, setChannels] = useState<CommunityChannel[]>(initialChannels);
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-foodies');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(initialMessages);
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [inputText, setInputText] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');

  // Channel Creation Modal
  const [showChannelModal, setShowChannelModal] = useState<boolean>(false);
  const [newChanName, setNewChanName] = useState<string>('');
  const [newChanDesc, setNewChanDesc] = useState<string>('');
  const [newChanCategory, setNewChanCategory] = useState<'Foodies' | 'Hiking & Fitness' | 'Students & Tech' | 'Deals & Discounts' | 'Chai & ChitChat'>('Foodies');

  // Friends & Social Vibe Modal / Tab
  const [activeTab, setActiveTab] = useState<'chat' | 'social'>('chat');

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const currentChannelMessages = messages[activeChannelId] || [];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderId: user.id,
      senderName: user.fullName,
      senderAvatar: user.avatar,
      senderBadge: user.studentIdVerified ? 'Student Rep' : 'Local Foodie',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: { '🔥': 1, '❤️': 1 }
    };

    setMessages(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
    }));
    setInputText('');
  };

  const handleReaction = (msgId: string, emoji: string) => {
    setMessages(prev => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map(m => {
        if (m.id === msgId) {
          const rx = { ...(m.reactions || {}) };
          rx[emoji] = (rx[emoji] || 0) + 1;
          return { ...m, reactions: rx };
        }
        return m;
      });
      return { ...prev, [activeChannelId]: updated };
    });
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanName.trim()) return;

    const newChan: CommunityChannel = {
      id: `chan-${Date.now()}`,
      name: newChanName,
      nameUrdu: newChanName,
      description: newChanDesc || 'A buzzing community group for Islamabad residents.',
      descriptionUrdu: 'اسلام آباد کے شہریوں اور طلباء کے لیے ایک پرجوش کمیونٹی۔',
      category: newChanCategory,
      icon: '💬',
      memberCount: 1,
      isVerified: false
    };

    setChannels(prev => [...prev, newChan]);
    setActiveChannelId(newChan.id);
    setMessages(prev => ({ ...prev, [newChan.id]: [] }));
    setShowChannelModal(false);
    setNewChanName('');
    setNewChanDesc('');
    confetti({ particleCount: 90 });
  };

  const handleAcceptFriend = (friendId: string) => {
    setUser(prev => ({
      ...prev,
      friends: [...prev.friends, friendId],
      friendRequests: prev.friendRequests.filter(id => id !== friendId)
    }));
    confetti({ particleCount: 70, spread: 50 });
  };

  return (
    <div className={`space-y-6 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Top Header Switcher */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              {isUrdu ? 'اسلام آباد واٹس ایپ اسٹائل چینلز و سوشل نیٹ ورک' : 'Islamabad WhatsApp-style Channels & Social Network'}
            </h2>
            <p className="text-xs text-slate-400">
              {isUrdu ? 'کھانوں کے راز، مارگلہ مہمات اور دوستیاں' : 'Real-time discussions, secret foodie hacks & instant connections'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chat' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Channels
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'social' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Friends ({user.friends.length})</span>
            {user.friendRequests.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
                {user.friendRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'social' ? (
        /* Social / Friends View (Instagram / Follow Vibe) */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-full h-full rounded-full object-cover ring-4 ring-emerald-500/50 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-slate-950 font-black">
                ✓
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-white">{user.fullName}</h3>
              <p className="text-xs text-emerald-400 font-semibold">@{user.username}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              {user.bio}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Sector</span>
                <span className="font-bold text-slate-200">{user.sector}</span>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">ISB Points</span>
                <span className="font-bold text-yellow-400">{user.points} pts</span>
              </div>
            </div>
          </div>

          {/* Friend Requests & Friends List */}
          <div className="md:col-span-2 space-y-5">
            {/* Friend Requests */}
            {user.friendRequests.length > 0 && (
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Pending Friend Requests ({user.friendRequests.length})</span>
                </h3>
                <div className="space-y-2">
                  {user.friendRequests.map((reqId, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          {reqId[0].toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-white">{reqId}</span>
                      </div>
                      <button
                        onClick={() => handleAcceptFriend(reqId)}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Friends List */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Your Islamabad Friends Network ({user.friends.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.friends.map((f, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <p className="text-xs font-bold text-white capitalize">{f.replace('-', ' ')}</p>
                        <p className="text-[10px] text-slate-400">Islamabad Active</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
                    >
                      Chat
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* WhatsApp-Style Channel Chat Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[580px]">
          {/* Channels Sidebar */}
          <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 flex flex-col shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isUrdu ? 'اسلام آباد چینلز' : 'Islamabad Channels'}
              </span>
              <button
                onClick={() => setShowChannelModal(true)}
                className="p-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                title="Create Channel"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
              {channels.map(chan => {
                const isActive = chan.id === activeChannelId;
                return (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-emerald-950/60 border-emerald-500/50 shadow-md'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{chan.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">
                          {isUrdu ? chan.nameUrdu : chan.name}
                        </h4>
                        {chan.isVerified && (
                          <span className="text-[10px] text-emerald-400">✓</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {isUrdu ? chan.descriptionUrdu : chan.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Channel Chat View */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl flex flex-col shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeChannel.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isUrdu ? activeChannel.nameUrdu : activeChannel.name}
                  </h3>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{activeChannel.memberCount} Islamabad members</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
              {currentChannelMessages.map(msg => {
                const isMe = msg.senderId === user.id;
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                      />
                    )}
                    <div
                      className={`max-w-[78%] p-3 rounded-2xl text-xs space-y-1.5 ${
                        isMe
                          ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-xs shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400">
                        <span className={`font-bold ${isMe ? 'text-slate-900' : 'text-emerald-400'}`}>
                          {msg.senderName}
                        </span>
                        <span className={isMe ? 'text-slate-900/70' : 'text-slate-500'}>
                          {msg.timestamp}
                        </span>
                      </div>

                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                      {msg.mediaUrl && (
                        <img
                          src={msg.mediaUrl}
                          alt="shared"
                          className="rounded-xl max-h-48 w-full object-cover mt-1"
                        />
                      )}

                      {/* Emoji Reactions */}
                      <div className="flex items-center gap-1 pt-1">
                        {['🔥', '❤️', '🤤', '🏔️'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            className="px-1.5 py-0.5 rounded-md bg-black/20 hover:bg-black/40 text-[10px] transition-colors"
                          >
                            {emoji} {msg.reactions?.[emoji] || ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={isUrdu ? 'اسلام آباد چینل میں میسج لکھیں...' : 'Share a deal, food tip, or trek update in channel...'}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-emerald-400" />
              <span>Create New Islamabad Channel</span>
            </h3>

            <form onSubmit={handleCreateChannel} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Channel Name:</label>
                <input
                  type="text"
                  required
                  value={newChanName}
                  onChange={e => setNewChanName(e.target.value)}
                  placeholder="e.g. F-11 Night Owls or FAST Carpooling"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category:</label>
                <select
                  value={newChanCategory}
                  onChange={e => setNewChanCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                >
                  <option value="Foodies">Foodies</option>
                  <option value="Hiking & Fitness">Hiking & Fitness</option>
                  <option value="Students & Tech">Students & Tech</option>
                  <option value="Deals & Discounts">Deals & Discounts</option>
                  <option value="Chai & ChitChat">Chai & ChitChat</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Short Description:</label>
                <textarea
                  rows={2}
                  value={newChanDesc}
                  onChange={e => setNewChanDesc(e.target.value)}
                  placeholder="What is this channel about?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Create Channel
                </button>
                <button
                  type="button"
                  onClick={() => setShowChannelModal(false)}
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


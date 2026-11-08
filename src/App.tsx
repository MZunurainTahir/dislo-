import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DealsSection } from './components/deals/DealsSection';
import { HiddenSpotsSection } from './components/hidden/HiddenSpotsSection';
import { MallSection } from './components/mall/MallSection';
import { AiAssistantSection } from './components/ai/AiAssistantSection';
import { HikingSection } from './components/hiking/HikingSection';
import { GamesLounge } from './components/games/GamesLounge';
import { PollsCommunitySection } from './components/community/PollsCommunitySection';
import { EventsSection } from './components/events/EventsSection';
import { ComplaintsSection } from './components/complaints/ComplaintsSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InteractiveBasket } from './components/cart/InteractiveBasket';
import { AuthModal } from './components/auth/AuthModal';
import { FlyingBirdQuote } from './components/birds/FlyingBirdQuote';
import { 
  INITIAL_DEALS, HIDDEN_SPOTS, INITIAL_POLLS, INITIAL_PENDING_DEALS, 
  MARGALLA_TRAILS, HIKING_GROUPS, ISB_EVENTS, INITIAL_USER_ACCOUNT 
} from './data/islamabadData';
import { fetchIslamabadWeather, fetchMarketRates } from './services/api';
import { 
  DealItem, CartItem, WeatherInfo, MarketRate, Language, 
  UserAccount, HiddenSpot, CommunityPoll, PendingDealSubmission 
} from './types';
import { LocalStorageManager } from './services/supabaseClient';

export function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('isb_language') as Language) || 'en';
  });
  const [activeTab, setActiveTab] = useState<string>('deals');
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    return LocalStorageManager.get<UserAccount>('user', INITIAL_USER_ACCOUNT);
  });
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const [deals, setDeals] = useState<DealItem[]>(() => {
    return LocalStorageManager.get<DealItem[]>('deals', INITIAL_DEALS);
  });
  const [pendingDeals, setPendingDeals] = useState<PendingDealSubmission[]>(() => {
    return LocalStorageManager.get<PendingDealSubmission[]>('pending_deals', INITIAL_PENDING_DEALS);
  });
  const [polls, setPolls] = useState<CommunityPoll[]>(() => {
    return LocalStorageManager.get<CommunityPoll[]>('polls', INITIAL_POLLS);
  });
  const [spots, setSpots] = useState<HiddenSpot[]>(HIDDEN_SPOTS);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return LocalStorageManager.get<CartItem[]>('cart', []);
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [marketRate, setMarketRate] = useState<MarketRate | null>(null);

  const isUrdu = language === 'ur';

  // Toggle Language
  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ur' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('isb_language', nextLang);
  };

  // Sync state to local storage
  useEffect(() => {
    LocalStorageManager.set('user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    LocalStorageManager.set('cart', cartItems);
  }, [cartItems]);

  useEffect(() => {
    LocalStorageManager.set('deals', deals);
  }, [deals]);

  useEffect(() => {
    LocalStorageManager.set('pending_deals', pendingDeals);
  }, [pendingDeals]);

  useEffect(() => {
    LocalStorageManager.set('polls', polls);
  }, [polls]);

  // Fetch telemetry on load
  useEffect(() => {
    fetchIslamabadWeather().then(w => setWeather(w));
    fetchMarketRates().then(m => setMarketRate(m));
  }, []);

  // Cart operations
  const handleAddToCart = (deal: DealItem) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.deal.id === deal.id);
      if (existing) {
        return prev.map(item =>
          item.deal.id === deal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { deal, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (dealId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.deal.id === dealId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (dealId: string) => {
    setCartItems(prev => prev.filter(item => item.deal.id !== dealId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Community Poll operations
  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls(prev =>
      prev.map(p => {
        if (p.id === pollId) {
          return {
            ...p,
            options: p.options.map(opt =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
            votedUserIds: [...p.votedUserIds, currentUser.id]
          };
        }
        return p;
      })
    );
  };

  const handleCreatePoll = (poll: CommunityPoll) => {
    setPolls(prev => [poll, ...prev]);
  };

  // Community Deal Proof Submissions
  const handleSubmitDealProof = (submission: PendingDealSubmission) => {
    setPendingDeals(prev => [submission, ...prev]);
  };

  const handleUpdatePfp = (pfpUrl: string, name: string) => {
    setCurrentUser(prev => ({
      ...prev,
      avatar: pfpUrl,
      fullName: name,
      firstName: name.split(' ')[0] || name
    }));
  };

  // Admin Approval of Community Deals
  const handleApproveDeal = (sub: PendingDealSubmission) => {
    const approvedDeal: DealItem = {
      id: `deal-${Date.now()}`,
      restaurantId: sub.restaurantName.toLowerCase().replace(/\s+/g, '-'),
      restaurantName: sub.restaurantName,
      title: sub.dealTitle,
      titleUrdu: sub.dealTitle,
      description: `Verified Community Deal submitted by ${sub.submittedByName}. Verified with receipt proof.`,
      descriptionUrdu: `${sub.submittedByName} کی طرف سے تصدیق شدہ اسلام آباد ڈیل۔`,
      category: sub.category,
      sector: sub.sector,
      originalPrice: sub.originalPrice,
      discountedPrice: sub.discountedPrice,
      discountPercentage: Math.round(((sub.originalPrice - sub.discountedPrice) / sub.originalPrice) * 100),
      rating: 4.8,
      reviewCount: 1,
      imageUrl: sub.proofScreenshotUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      badge: 'Community Verified',
      validUntil: '2026-12-31',
      directOrderUrl: 'https://foodpanda.pk',
      websiteUrl: 'https://islamabad.gov.pk',
      address: `${sub.sector}, Islamabad`,
      tags: ['Community', 'Verified Proof'],
      submittedBy: sub.submittedByName,
      proofScreenshotUrl: sub.proofScreenshotUrl
    };

    // Add to live deals
    setDeals(prev => [approvedDeal, ...prev]);

    // Remove from pending
    setPendingDeals(prev => prev.filter(p => p.id !== sub.id));

    // Award badges & commission to user
    setCurrentUser(prev => {
      const nextCount = prev.publishedDealsCount + 1;
      let nextTier = prev.partnerTier;
      if (nextCount >= 10) nextTier = 'Platinum Partner';
      else if (nextCount >= 5) nextTier = 'Gold Margalla Ambassador';
      else if (nextCount >= 3) nextTier = 'Silver Explorer';

      return {
        ...prev,
        publishedDealsCount: nextCount,
        partnerTier: nextTier,
        earnedCommissionPkr: prev.earnedCommissionPkr + 600,
        points: prev.points + 200
      };
    });
  };

  const handleRejectDeal = (subId: string) => {
    setPendingDeals(prev => prev.filter(p => p.id !== subId));
  };

  // Direct Admin Deal Operations
  const handleAddDeal = (deal: DealItem) => {
    setDeals(prev => [deal, ...prev]);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
  };

  const handleUpgradePremium = () => {
    setCurrentUser(prev => ({ ...prev, isPremium: true }));
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col relative ${isUrdu ? 'urdu-text' : ''}`}>
      {/* Random Flying Bird with Slangs/Quotes (Flies across every ~14s) */}
      <FlyingBirdQuote
        generation={currentUser.generation}
        isUrdu={isUrdu}
      />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        weather={weather}
        marketRate={marketRate}
        language={language}
        toggleLanguage={toggleLanguage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative z-10">
        {activeTab === 'deals' && (
          <DealsSection
            deals={deals}
            onAddToCart={handleAddToCart}
            isUrdu={isUrdu}
          />
        )}

        {activeTab === 'hidden' && (
          <HiddenSpotsSection
            spots={spots}
            isPremium={currentUser.isPremium}
            onUpgradePremium={handleUpgradePremium}
            isUrdu={isUrdu}
          />
        )}

        {activeTab === 'mall' && (
          <MallSection
            onAddToCart={handleAddToCart}
            isUrdu={isUrdu}
          />
        )}

        {activeTab === 'ai-dost' && (
          <AiAssistantSection
            deals={deals}
            onAddToCart={handleAddToCart}
            isUrdu={isUrdu}
          />
        )}

        {activeTab === 'hiking' && (
          <HikingSection
            trails={MARGALLA_TRAILS}
            groups={HIKING_GROUPS}
            isUrdu={isUrdu}
          />
        )}

        {activeTab === 'games' && (
          <GamesLounge isUrdu={isUrdu} />
        )}

        {activeTab === 'community' && (
          <PollsCommunitySection
            polls={polls}
            currentUser={currentUser}
            onVotePoll={handleVotePoll}
            onCreatePoll={handleCreatePoll}
            onSubmitDealProof={handleSubmitDealProof}
            onUpdatePfp={handleUpdatePfp}
            isUrdu={isUrdu}
          />
        )}

        {activeTab === 'events' && (
          <EventsSection
            events={ISB_EVENTS}
            isUrdu={isUrdu}
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintsSection isUrdu={isUrdu} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            deals={deals}
            pendingDeals={pendingDeals}
            onApproveDeal={handleApproveDeal}
            onRejectDeal={handleRejectDeal}
            onAddDeal={handleAddDeal}
            onDeleteDeal={handleDeleteDeal}
            isUrdu={isUrdu}
          />
        )}
      </main>

      {/* Auth Sign Up / Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onLoginSuccess={user => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }}
        onClose={() => setIsAuthOpen(false)}
        isUrdu={isUrdu}
      />

      {/* Interactive Smart Basket Drawer */}
      <InteractiveBasket
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        isUrdu={isUrdu}
      />

      {/* Global Footer */}
      <Footer isUrdu={isUrdu} />
    </div>
  );
}

export default App;

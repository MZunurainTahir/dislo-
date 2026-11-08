export type Language = 'en' | 'ur';

export type GenerationType = 'Gen Z' | 'Gen Alpha' | 'Millennial';

export type Sector = 
  | 'All' 
  | 'F-6 (Kohsar & Beverly)' 
  | 'F-7 (Jinnah Super)' 
  | 'F-10 (Markaz)' 
  | 'F-11 (Markaz)' 
  | 'Blue Area' 
  | 'I-8 (Markaz)' 
  | 'G-9 (Karachi Company)' 
  | 'E-11' 
  | 'Centaurus & Safa' 
  | 'Margalla Hills & Monal' 
  | 'DHA & Bahria Town';

export type DealCategory = 
  | 'All'
  | 'Fast Food'
  | 'Desi & BBQ'
  | 'Cafe & Bakery'
  | 'Student Budget'
  | 'Fine Dining'
  | 'Buffet & Hi-Tea'
  | 'Late Night'
  | 'Mall & Mart Grocery';

export interface DealItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  category: DealCategory;
  sector: Sector;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badge?: string;
  validUntil: string;
  directOrderUrl: string;
  websiteUrl: string;
  phone?: string;
  address: string;
  isStudentSpecial?: boolean;
  isPopular?: boolean;
  isHalalCertified?: boolean;
  calories?: number;
  tags: string[];
  submittedBy?: string;
  proofScreenshotUrl?: string;
}

export interface CartItem {
  deal: DealItem;
  quantity: number;
  notes?: string;
}

export interface MargallaTrail {
  id: string;
  name: string;
  nameUrdu: string;
  trailNumber: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Extreme';
  distanceKm: number;
  elevationMeters: number;
  avgTimeMinutes: number;
  startingPoint: string;
  endingPoint: string;
  description: string;
  descriptionUrdu: string;
  safetyTips: string[];
  waterPoints: number;
  scenicRating: number;
  imageUrl: string;
  recommendedTime: string;
  activeHikersCount: number;
}

export interface HikingGroup {
  id: string;
  title: string;
  titleUrdu: string;
  trailId: string;
  trailName: string;
  organizer: string;
  organizerAvatar: string;
  meetingPoint: string;
  date: string;
  time: string;
  maxParticipants: number;
  currentParticipants: number;
  pace: 'Casual Walk' | 'Brisk Walk' | 'Running' | 'Intense Hike';
  whatsappGroupUrl?: string;
  joinedUserIds: string[];
}

export interface CommunityChannel {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  category: 'Foodies' | 'Hiking & Fitness' | 'Students & Tech' | 'Deals & Discounts' | 'Chai & ChitChat';
  icon: string;
  memberCount: number;
  isPrivate?: boolean;
  isVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderBadge?: string;
  text: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  reactions?: Record<string, number>;
  isUrdu?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  sector: Sector;
  favoriteSpot: string;
  points: number;
  studentIdVerified?: boolean;
  friends: string[];
  friendRequests: string[];
  isAdmin?: boolean;
}

export interface CommunityPoll {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  category: 'Hike Meetup' | 'Food Outing' | 'Sunset Chai Plan';
  venue: string;
  dateProposed: string;
  options: { id: string; text: string; votes: number }[];
  votedUserIds: string[];
  createdAt: string;
}

export interface PendingDealSubmission {
  id: string;
  submittedByUserId: string;
  submittedByName: string;
  restaurantName: string;
  dealTitle: string;
  sector: Sector;
  category: DealCategory;
  originalPrice: number;
  discountedPrice: number;
  proofScreenshotUrl: string;
  status: 'Pending Admin Verification' | 'Approved' | 'Rejected';
  submittedAt: string;
  notes?: string;
}

export interface HiddenSpot {
  id: string;
  title: string;
  titleUrdu: string;
  category: 'Secret Scenic View' | 'Hidden Waterfall & Spring' | 'Historic Cave & Ridge' | 'Underrated Food & Cafe' | 'Tranquil Sunset Spot';
  sector: string;
  locationDetails: string;
  googleMapsUrl: string;
  description: string;
  descriptionUrdu: string;
  bestTime: string;
  imageUrl: string;
  isPremium: boolean;
}

export interface UserAccount {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dob: string;
  email: string;
  username: string;
  generation: GenerationType;
  avatar: string;
  sector: Sector;
  isVerifiedPakistani: boolean;
  isPremium: boolean;
  publishedDealsCount: number;
  partnerTier: 'Bronze Scout' | 'Silver Explorer' | 'Gold Margalla Ambassador' | 'Platinum Partner';
  earnedCommissionPkr: number;
  points: number;
  savedDeals: string[];
  friends: string[];
  friendRequests: string[];
}

export interface AdminCredential {
  id: 1 | 2 | 3;
  name: 'Muhammad Zun U Rain Tahir' | 'Muhammad Abdullah Khalid' | 'Muhammad Abdullah Nadeem';
  role: 'Super Admin & Lead Architect' | 'Executive Operations Admin' | 'Executive Community Admin';
}

export interface CitizenComplaint {
  id: string;
  trackingId: string;
  restaurantOrPlace: string;
  sector: Sector;
  issueType: 'Hygiene & Food Safety' | 'Overcharging / Fake Deal' | 'Trail Littering' | 'Staff Behavior' | 'Delay / Quality';
  description: string;
  evidenceUrl?: string;
  contactEmail: string;
  contactPhone: string;
  status: 'Received' | 'Under Investigation' | 'Forwarded to Punjab/ICT Authority' | 'Resolved';
  resolutionNotes?: string;
  createdAt: string;
}

export interface IslamabadEvent {
  id: string;
  title: string;
  titleUrdu: string;
  venue: string;
  venueUrdu: string;
  date: string;
  time: string;
  ticketPrice: string;
  ticketUrl: string;
  imageUrl: string;
  category: 'Food Fest' | 'Live Music' | 'Hiking Meetup' | 'Tech & AI' | 'Family Expo' | 'National Day';
  description: string;
  isNationalDaySpecial?: boolean;
}

export interface WeatherInfo {
  temp: number;
  feelsLike: number;
  condition: string;
  conditionUrdu: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  airQuality: string;
  margallaHillsStatus: string;
}

export interface MarketRate {
  usdToPkr: number;
  eurToPkr: number;
  gbpToPkr: number;
  goldPerTolaPkr: number;
  petrolPerLiterPkr: number;
  cngRatePkr: number;
  lastUpdated: string;
}

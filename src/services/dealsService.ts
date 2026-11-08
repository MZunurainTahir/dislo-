import { DealItem, Sector, DealCategory } from '../types';
import { INITIAL_DEALS } from '../data/islamabadData';

export type TimeSlot = 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'midnight';

export interface DealTimeMeta {
  slot: TimeSlot;
  labelEn: string;
  labelUrdu: string;
  descriptionEn: string;
  descriptionUrdu: string;
  icon: string;
}

export function getCurrentTimeSlot(): DealTimeMeta {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    return {
      slot: 'morning',
      labelEn: 'Margalla Morning & Nashta',
      labelUrdu: 'مارگلہ مارننگ اور روایتی ناشتہ',
      descriptionEn: 'Fresh halwa puri, chai platters & bakery ovens fresh in ICT',
      descriptionUrdu: 'تازہ حلوہ پوری، کوہسار کی چائے اور گرم اوون نان',
      icon: '🌅'
    };
  }
  if (hour >= 11 && hour < 16) {
    return {
      slot: 'lunch',
      labelEn: 'Student & Corporate Lunch Rush',
      labelUrdu: 'اسٹوڈنٹ اور کارپوریٹ لنچ رش',
      descriptionEn: 'Savour pulao, express thalis & fast food combo deals',
      descriptionUrdu: 'سیور پلاؤ، برگر کمبوز اور بجٹ فرینڈلی لنچ آفرز',
      icon: '🍽️'
    };
  }
  if (hour >= 16 && hour < 19) {
    return {
      slot: 'afternoon',
      labelEn: 'Kohsar Hi-Tea & Sunset Chill',
      labelUrdu: 'کوہسار ہائی ٹی اور مارگلہ سن سیٹ',
      descriptionEn: 'Artisanal coffee, cakes, puffs & scenic Margalla views',
      descriptionUrdu: 'اسپیشل کافی، کیک سلائسز اور شام کا پرسکون منظر',
      icon: '☕'
    };
  }
  if (hour >= 19 && hour < 23) {
    return {
      slot: 'dinner',
      labelEn: 'Grand Islamabad Dinner Feasts',
      labelUrdu: 'اسلام آباد ڈنر اور لائیو باربی کیو',
      descriptionEn: 'Shinwari karahi, cheesy pizzas & rooftop dining',
      descriptionUrdu: 'شنواری کڑاہی، ووڈ فائرڈ پیزا اور شاندار چھتوں پر ضیافت',
      icon: '🌙'
    };
  }
  return {
    slot: 'midnight',
    labelEn: 'Midnight Cravings & Late Night Owl',
    labelUrdu: 'آدھی رات کے کباب اور سحری نائٹ آفرز',
    descriptionEn: 'Hot cheesy slices, loaded fries & 3 AM deliveries',
    descriptionUrdu: 'لیٹ نائٹ چیزئیئس، لوڈڈ فرائز اور ہاسٹل ہیک ڈیلز',
    icon: '🦉'
  };
}

/**
 * Filter and prioritize deals based on the current time slot and popular vibes
 */
export function getSortedFreshDeals(deals: DealItem[]): DealItem[] {
  const current = getCurrentTimeSlot().slot;

  return [...deals].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    const tagsA = a.tags.map(t => t.toLowerCase());
    const tagsB = b.tags.map(t => t.toLowerCase());

    if (current === 'morning') {
      if (tagsA.some(t => t.includes('breakfast') || t.includes('chai') || t.includes('bakery'))) scoreA += 15;
      if (tagsB.some(t => t.includes('breakfast') || t.includes('chai') || t.includes('bakery'))) scoreB += 15;
    } else if (current === 'lunch') {
      if (tagsA.some(t => t.includes('pulao') || t.includes('student') || t.includes('thali') || t.includes('burger'))) scoreA += 15;
      if (tagsB.some(t => t.includes('pulao') || t.includes('student') || t.includes('thali') || t.includes('burger'))) scoreB += 15;
    } else if (current === 'afternoon') {
      if (tagsA.some(t => t.includes('hi-tea') || t.includes('coffee') || t.includes('view') || t.includes('dessert'))) scoreA += 15;
      if (tagsB.some(t => t.includes('hi-tea') || t.includes('coffee') || t.includes('view') || t.includes('dessert'))) scoreB += 15;
    } else if (current === 'dinner') {
      if (tagsA.some(t => t.includes('bbq') || t.includes('karahi') || t.includes('pizza') || t.includes('buffet'))) scoreA += 15;
      if (tagsB.some(t => t.includes('bbq') || t.includes('karahi') || t.includes('pizza') || t.includes('buffet'))) scoreB += 15;
    } else {
      // midnight
      if (tagsA.some(t => t.includes('late night') || t.includes('burger') || t.includes('pizza'))) scoreA += 15;
      if (tagsB.some(t => t.includes('late night') || t.includes('burger') || t.includes('pizza'))) scoreB += 15;
    }

    if (a.isStudentSpecial) scoreA += 3;
    if (b.isStudentSpecial) scoreB += 3;
    if (a.isPopular) scoreA += 2;
    if (b.isPopular) scoreB += 2;

    return scoreB - scoreA;
  });
}

/**
 * Dynamic deal of the hour calculation that shifts naturally every 60 minutes
 */
export function getDealOfTheHour(deals: DealItem[]): DealItem {
  if (!deals || deals.length === 0) return INITIAL_DEALS[0];
  const hour = new Date().getHours();
  const index = (hour * 7) % deals.length;
  return deals[index];
}

/**
 * Generate randomized live simulated radar feed of fresh discounts in Islamabad
 */
export function getLiveRadarPulse() {
  const count = 30 + (new Date().getDate() % 12);
  const minutesAgo = (new Date().getMinutes() % 8) + 1;
  return {
    activeDealsCount: count,
    lastRefreshedMins: minutesAgo,
    verifiedCount: count - 2,
    studentSpecialsCount: Math.round(count * 0.45)
  };
}


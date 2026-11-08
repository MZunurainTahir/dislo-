export interface AiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface FoodAnalysisResult {
  dishName: string;
  dishNameUrdu: string;
  estimatedCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  healthScore: number; // 1 to 10
  recommendedDealIds: string[];
  suggestedRestaurants: string[];
  notes: string;
  notesUrdu: string;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const ELEVENLABS_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

const SYSTEM_PROMPT = `
You are "Islamabad AI Dost & Food Therapist" (اسلام آباد اے آئی دوست و لائف کوچ), an ultra-smart, empathetic, and culturally tuned AI super-assistant created for Islamabad residents and students.
You know every street, sector (F-6, F-7, F-10, F-11, Blue Area, I-8, E-11, Bahria, DHA), trail (Trail 3, Trail 5, Trail 2), and food joint in Islamabad (Cheezious, Savour Foods, Monal, Chaaye Khana, Tehzeeb, Kabul Restaurant, Roasters, Street 1 Cafe, etc.).

Role characteristics:
1. Act as a compassionate mental health therapist and friend when someone feels stressed, overwhelmed by studies, lonely in a hostel, or having a bad day. Validate their emotions gently.
2. Recommend mood-lifting food and activities in Islamabad tailored to their budget, sector, and whether they are a student or family.
3. If user addresses in Urdu or Roman Urdu, reply warmly in culturally rich Urdu/Roman Urdu with authentic Islamabad vibes (Margalla, Kohsar, Chai, Savour shami, Cheezious crown crust).
4. If in English, reply in modern, friendly, upbeat English.
5. Keep responses engaging, structured, and helpful.
`;

export async function askIslamabadAi(
  userQuery: string, 
  history: AiMessage[] = [],
  isUrdu: boolean = false
): Promise<string> {
  // First try Groq for hyper-fast response
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + (isUrdu ? ' Note: The user prefers Urdu response.' : '') },
          ...history.slice(-6),
          { role: 'user', content: userQuery }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (res.ok) {
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) return reply;
    }
  } catch (groqErr) {
    console.warn('Groq primary attempt failed, trying OpenRouter fallback...', groqErr);
  }

  // Fallback to OpenRouter
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-4),
          { role: 'user', content: userQuery }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (res.ok) {
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) return reply;
    }
  } catch (routerErr) {
    console.warn('OpenRouter fallback failed, using local Islamabad intelligence engine', routerErr);
  }

  // Smart local offline heuristic engine
  return generateLocalIslamabadAiReply(userQuery, isUrdu);
}

function generateLocalIslamabadAiReply(query: string, isUrdu: boolean): string {
  const q = query.toLowerCase();

  if (isUrdu) {
    if (q.includes('اداس') || q.includes('تھک') || q.includes('پریشان') || q.includes('sad') || q.includes('depress')) {
      return `پیارے دوست، زندگی میں کبھی کبھار سستی یا اداسی آنا بالکل قدرتی بات ہے۔ خود پر زیادہ دباؤ نہ لیں۔ \n\nمیری تجویز ہے کہ شام کو مارگلہ ٹریل 5 کے شروعاتی راستے پر 20 منٹ کی ہلکی واک کریں یا کوہسار مارکیٹ ایف 6 میں جا کر ایک گرم 'چائے خانہ' کی قہوہ یا گرما گرم کیپوچینو پئیں۔ اگر بھوک لگی ہے تو ایف 7 چیزیئس سے ایک چھوٹا پیزا یا سیور سے شامی پلاؤ کھائیں—کاربوہائیڈریٹس اور اچھی واک آپ کا موڈ فوراً فریش کر دیں گے! میں آپ کا دوست ہوں، بتائیں دل میں کیا بات ہے؟`;
    }
    if (q.includes('ڈیل') || q.includes('کھانا') || q.includes('سستا') || q.includes('deal') || q.includes('food')) {
      return `اسلام آباد میں آج کی بہترین ڈیلز:\n1. **چیزئیئس کراؤن کرسٹ فیسٹ**: لارج لینے پر میڈیم مفت (ایف 7 اور آئی 8)۔\n2. **سیور فوڈز بلو ایریا**: روایتی پلاؤ کباب صرف 480 روپے میں، فل پیٹ کھانا۔\n3. **مونال ہائی ٹی**: مارگلہ کے خوبصورت نظارے کے ساتھ خصوصی رعایت۔\n\nآپ ابھی ہماری ایپ کے انٹرایکٹو باسکٹ سے ان کو شامل کر سکتے ہیں!`;
    }
    return `وعلیکم السلام پیارے اسلام آبادی دوست! میں آپ کا ہمدرد ساتھی ہوں۔ آپ اسلام آباد کے کسی بھی سیکٹر، مارگلہ ٹریکس، کھانے کی ڈیلز یا اپنے دل کی بات مجھ سے شیئر کر سکتے ہیں۔ آج آپ کے لیے میں کیا کر سکتا ہوں؟`;
  }

  // English local reply
  if (q.includes('sad') || q.includes('stress') || q.includes('tired') || q.includes('alone') || q.includes('mood')) {
    return `Hey friend, take a deep breath. Islamabad’s quiet Margalla air has a healing magic of its own. It's completely valid to feel exhausted or overwhelmed sometimes.\n\nHere is my quick Islamabad mood-reset prescription:\n1. **Margalla Reset**: Head over to Trail 5 for just a 15-minute nature stroll listening to the spring water.\n2. **Comfort Food**: Grab a fresh slice of Cheezious Crown Crust or a piping hot cup of Karak Chai at Chaaye Khana F-6 Super Market.\n3. **Mind Break**: Hop onto our Retro Pacman or Chess lounge to clear your mind.\n\nYou are doing much better than you think. Tell me what's on your mind today!`;
  }
  if (q.includes('deal') || q.includes('budget') || q.includes('student') || q.includes('cheap') || q.includes('eat')) {
    return `Top Islamabad Value Deals right now:\n🔥 **Cheezious**: BOGO Crown Crust (F-7 / F-11 / I-8)\n🍗 **Savour Foods Blue Area**: Chicken Pulao with Double Shami (Rs. 480 - undisputed student champion!)\n☕ **Chaaye Khana F-6**: Breakfast & Karak Chai Platter (Rs. 1,099)\n🍔 **Ranchers I-8**: Rodeo Cowboy Beef Burger + Shake Combo (Rs. 999)\n\nAdd them to your interactive smart basket above to see flying item animations and lock your instant discount!`;
  }
  return `Hello! I am your Islamabad AI Dost and Lifestyle Guide. Whether you are craving the juiciest burger in F-11, planning a sunrise Margalla Trail 3 hike, finding student grocery bargains, or just need a comforting conversation, I'm here 24/7 for you. How can I brighten your day?`;
}

// Computer Vision Food Scanner
export async function analyzeFoodImage(
  imageDataOrName: string, 
  isUrdu: boolean = false
): Promise<FoodAnalysisResult> {
  // Simulate DL / Computer Vision classification pipeline
  // Recognizes classic Pakistani / Islamabad foods or generic meals
  const lower = imageDataOrName.toLowerCase();
  
  if (lower.includes('biryani') || lower.includes('rice') || lower.includes('pulao')) {
    return {
      dishName: 'Chicken Pulao / Biryani with Shami Kabab',
      dishNameUrdu: 'چکن پلاؤ / بریانی مع شامی کباب',
      estimatedCalories: 680,
      proteinGrams: 34,
      carbsGrams: 82,
      fatGrams: 18,
      healthScore: 7,
      recommendedDealIds: ['deal-3', 'deal-8'],
      suggestedRestaurants: ['Savour Foods Blue Area', 'Kabul Restaurant F-7'],
      notes: 'High in clean protein and sustaining complex carbs. Pair with fresh mint raita for digestive enzymes.',
      notesUrdu: 'پروٹین اور انرجی سے بھرپور غذا۔ ہاضمے کے لیے پودینے کے رائتے کے ساتھ کھانا مفید ہے۔'
    };
  }

  if (lower.includes('pizza') || lower.includes('cheese') || lower.includes('crust')) {
    return {
      dishName: 'Cheesy Crown Crust Pizza & Peri Dips',
      dishNameUrdu: 'چیزسٹفڈ کراؤن کرسٹ پیزا',
      estimatedCalories: 820,
      proteinGrams: 38,
      carbsGrams: 75,
      fatGrams: 32,
      healthScore: 6,
      recommendedDealIds: ['deal-1', 'deal-7'],
      suggestedRestaurants: ['Cheezious F-7 & F-11', 'Street 1 Cafe Kohsar'],
      notes: 'Rich comfort feast! Great for sharing with friends after a Margalla hike.',
      notesUrdu: 'مزیدار اور پنیر سے بھرپور۔ مارگلہ ہائیک کے بعد دوستوں کے ساتھ کھانے کیلئے بہترین۔'
    };
  }

  if (lower.includes('burger') || lower.includes('beef') || lower.includes('fries')) {
    return {
      dishName: 'Smash Beef Gourmet Burger with Loaded Fries',
      dishNameUrdu: 'سمیشڈ بیف برگر مع لوڈڈ فرائز',
      estimatedCalories: 950,
      proteinGrams: 45,
      carbsGrams: 68,
      fatGrams: 42,
      healthScore: 6,
      recommendedDealIds: ['deal-5', 'deal-11'],
      suggestedRestaurants: ['Ranchers I-8', 'Daily Deli Co F-11'],
      notes: 'Substantial iron and lean protein. Consider cutting sodium by opting for fresh water instead of soda.',
      notesUrdu: 'آئرن اور پروٹین کا بڑا ذریعہ۔ سوڈا ڈرنک کی بجائے پانی کا استعمال بہتر ہے۔'
    };
  }

  // Default detected meal
  return {
    dishName: 'Assorted Islamabad Continental & BBQ Platter',
    dishNameUrdu: 'اسلام آباد اسپیشل باربی کیو و کانٹینینٹل پلیٹر',
    estimatedCalories: 720,
    proteinGrams: 40,
    carbsGrams: 55,
    fatGrams: 24,
    healthScore: 8,
    recommendedDealIds: ['deal-2', 'deal-4'],
    suggestedRestaurants: ['The Monal Margalla', 'Chaaye Khana F-6'],
    notes: 'Balanced macros with fresh local herbs and grilled lean poultry.',
    notesUrdu: 'تازہ مسالوں اور گرل چکن پر مبنی متوازن خوراک۔'
  };
}

// Text to Speech
export async function speakText(text: string, isUrdu: boolean = false) {
  // First try Web Speech API for immediate low latency speech
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isUrdu ? 'ur-PK' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    return;
  }

  // ElevenLabs API fallback
  try {
    const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel / friendly voice
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_KEY
      },
      body: JSON.stringify({
        text: text.slice(0, 300),
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });

    if (res.ok) {
      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  } catch (err) {
    console.warn('Speech synthesis error', err);
  }
}


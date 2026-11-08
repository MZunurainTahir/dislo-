import React, { useState, useRef } from 'react';
import { 
  Bot, Send, Mic, Volume2, Sparkles, Camera, Upload, 
  BrainCircuit, HeartPulse, Flame, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { askIslamabadAi, analyzeFoodImage, speakText, AiMessage, FoodAnalysisResult } from '../../services/aiService';
import { DealItem } from '../../types';

interface Props {
  deals: DealItem[];
  onAddToCart: (deal: DealItem) => void;
  isUrdu: boolean;
}

const QUICK_MOOD_PROMPTS = [
  { label: '😔 Sad & Exhausted', prompt: 'I had a really tough day, feeling stressed and lonely. What comfort food or calming spot in Islamabad do you recommend?' },
  { label: '📚 NUST/FAST Exam Night', prompt: 'Late night study session! Need affordable energy food in Islamabad under 600 PKR that delivers late.' },
  { label: '🌲 Margalla Trek & Chai', prompt: 'Planning an early morning hike on Trail 3 or Trail 5. What should I eat before and after at Monal or Chaaye Khana?' },
  { label: '💸 Student Budget (< PKR 500)', prompt: 'I only have 500 rupees in my pocket. Where is the absolute most filling meal in Islamabad right now?' },
  { label: '☔ Rainy Day Islamabad Vibe', prompt: 'The weather in Islamabad is rainy and Margalla is covered in clouds. What is the classic food plan for today?' }
];

export const AiAssistantSection: React.FC<Props> = ({ deals, onAddToCart, isUrdu }) => {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      role: 'assistant',
      content: isUrdu
        ? 'السلام علیکم! میں آپ کا اسلام آباد اے آئی دوست، ہمدرد تھیراپسٹ اور فوڈ گائیڈ ہوں۔ چاہے آپ پڑھائی یا ہاسٹل لائف سے پریشان ہوں، کم بجٹ میں بہترین کھانا ڈھونڈ رہے ہوں، یا مارگلہ ہائیک کا پلان بنا رہے ہوں—میں ہمیشہ آپ کے ساتھ ہوں۔ آج آپ کیسا محسوس کر رہے ہیں؟'
        : 'Assalam-o-Alaikum! I am your Islamabad AI Dost & Food Therapist. Whether you are feeling overwhelmed, hunting student deals under 500 PKR, planning a Margalla sunrise trek, or need someone to listen, I am right here for you. Tell me your mood today!'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Computer Vision Scanner State
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<FoodAnalysisResult | null>(null);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AiMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askIslamabadAi(textToSend, messages, isUrdu);
      const aiMsg: AiMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = isUrdu ? 'ur-PK' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  };

  // Computer Vision Image Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setVisionImage(base64);
      setIsAnalyzingVision(true);

      try {
        const result = await analyzeFoodImage(file.name, isUrdu);
        setVisionResult(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzingVision(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`space-y-8 ${isUrdu ? 'urdu-text' : ''}`}>
      {/* AI Dost & Therapist Interface */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <BrainCircuit className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                {isUrdu ? 'اسلام آباد اے آئی دوست و لائف تھیراپسٹ' : 'Islamabad AI Dost & Food Therapist'}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  NLP & GenAI 2.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isUrdu 
                  ? 'ذہنی سکون، احساسات کی قدر اور موڈ کے مطابق اسلام آباد کے کھانوں کی رہنمائی'
                  : 'Mental wellness, emotional empathy, student survival & mood-matched Islamabad food cravings'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {isUrdu ? 'آن لائن ساتھی' : 'Online & Active'}
            </span>
          </div>
        </div>

        {/* Quick Mood Pills */}
        <div className="py-4">
          <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            {isUrdu ? 'فوری موڈ سلیکٹر:' : 'Quick Mood & Cravings Presets:'}
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_MOOD_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(item.prompt)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-800 hover:border-emerald-500/40 whitespace-nowrap transition-all shadow-sm"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Box */}
        <div className="h-96 overflow-y-auto space-y-4 p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-1 border border-emerald-500/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-xs shadow-md shadow-emerald-600/10'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs whitespace-pre-line shadow-sm'
                }`}
              >
                {msg.content}

                {/* Speak button for assistant */}
                {msg.role === 'assistant' && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-[10px] text-emerald-400/80">Islamabad AI Core</span>
                    <button
                      onClick={() => speakText(msg.content, isUrdu)}
                      className="p-1 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Listen Voice</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-xs text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {isUrdu ? 'اے آئی دوست جواب تیار کر رہا ہے...' : 'AI Dost is thinking...'}
              </div>
            </div>
          )}
        </div>

        {/* Input & Voice Controls */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-500/20 text-red-400 border-red-500 animate-pulse'
                : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
            }`}
            title="Speech to Text"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={
              isUrdu
                ? 'اپنے جذبات، بھوک یا مسئلہ شیئر کریں...'
                : 'Ask for food comfort, therapy advice, or Margalla hiking plans...'
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Computer Vision (CV) Scanner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-2xl">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {isUrdu ? 'اسمارٹ فوڈ و رسید کیلوری اسکینر' : 'Smart Food & Receipt Calorie Scanner'}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  Instant AI Scanner
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isUrdu 
                  ? 'کھانے یا رسید کی تصویر اپلوڈ کر کے کیلوریز، نیوٹریشن اور سستی اسلام آباد ڈیلز حاصل کریں'
                  : 'Snap or upload any meal or restaurant receipt to estimate calories, macros & find matching deals'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Upload Box */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-teal-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/60 flex flex-col items-center justify-center min-h-[220px]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {visionImage ? (
              <img
                src={visionImage}
                alt="Uploaded meal"
                className="max-h-48 rounded-xl object-contain shadow-lg"
              />
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-teal-400">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  {isUrdu ? 'تصویر منتخب کریں یا یہاں ڈراپ کریں' : 'Click to Upload Food Image or Receipt'}
                </p>
                <p className="text-xs text-slate-500">
                  Supports JPG, PNG, WEBP (Biryani, Burger, Pizza, BBQ)
                </p>
              </div>
            )}
          </div>

          {/* Analysis Result */}
          <div>
            {isAnalyzingVision ? (
              <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-2xl">
                <Sparkles className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-white mb-1">
                  {isUrdu ? 'اسمارٹ ماڈل کھانے کا تجزیہ کر رہا ہے...' : 'AI Scanner Analyzing Meal & Nutrition...'}
                </p>
                <p className="text-xs text-slate-400">
                  Extracting visual features, food classification & calorie telemetry
                </p>
              </div>
            ) : visionResult ? (
              <div className="p-5 bg-slate-950/80 border border-teal-500/30 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-teal-400 uppercase font-black tracking-wider">
                      CV Identified Meal
                    </span>
                    <h4 className="text-base font-black text-white">
                      {isUrdu ? visionResult.dishNameUrdu : visionResult.dishName}
                    </h4>
                  </div>
                  <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-xl text-center">
                    <span className="text-xs font-black text-amber-400">
                      {visionResult.estimatedCalories} kcal
                    </span>
                  </div>
                </div>

                {/* Macro metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Protein</span>
                    <span className="font-bold text-white">{visionResult.proteinGrams}g</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Carbs</span>
                    <span className="font-bold text-white">{visionResult.carbsGrams}g</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Fats</span>
                    <span className="font-bold text-white">{visionResult.fatGrams}g</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isUrdu ? visionResult.notesUrdu : visionResult.notes}
                </p>

                {/* Matching Islamabad Deals */}
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-[11px] font-bold text-emerald-400 mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isUrdu ? 'متعلقہ اسلام آباد ڈیلز:' : 'Matching Islamabad Restaurants:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {visionResult.suggestedRestaurants.map((res, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg">
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl text-center text-xs text-slate-400 space-y-2">
                <Flame className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="font-semibold text-slate-200">
                  {isUrdu ? 'کوئی تصویر اپلوڈ کریں' : 'No image analyzed yet'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Upload a photo of your lunch or dinner to inspect calories and match top active deals across Islamabad!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Receipt,
  Percent,
  Plus,
  Share2,
  CheckCheck,
  Trash2,
  ArrowRight,
  Loader2,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Target,
  Trophy,
  ServerCrash,
  BookOpen,
  Quote,
  Film,
  Camera,
  Image as ImageIcon,
  Mic,
  Volume2,
  Brain,
  Infinity as InfinityIcon,
  Activity,
  Flame,
  Skull,
  Search,
  Globe,
  Coffee,
  Moon,
  Book,
  Smile,
  Box,
  GraduationCap,
  Briefcase,
  Newspaper,
  User,
  Video,
  Wand2,
  Palette,
  Play,
  Cake,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Person {
  id: string;
  name: string;
}

interface LineItem {
  id: string;
  name: string;
  price: number;
  sharedBy: string[];
}

interface CuanIdea {
  title: string;
  description: string;
  steps: string[];
  estimatedCapital: string;
  potentialProfit: string;
  vibe: string;
}

interface IqtibasIdea {
  context: string;
  quote: string;
  source: string;
  explanation: string;
}

interface StoryFrameItem {
  frameNumber: number;
  visualPrompt: string;
  motionPrompt: string;
  voiceOverText: string;
  cameraAngle: string;
  generatedImageBase64?: string;
  isGeneratingImage?: boolean;
  generatedAudioBase64?: string;
  isGeneratingAudio?: boolean;
}

interface StoryFrameIdea {
  title: string;
  niche: string;
  angle: string;
  targetAudience: string;
  frames: StoryFrameItem[];
}

interface InnerParadoxIdea {
  surfacePersona: string;
  coreWound: string;
  theParadox: string;
  behavioralQuirks: string[];
  breakingPoint: string;
}

interface AnimasiCharacter {
  name: string;
  visualPrompt: string;
}

interface AnimasiScene {
  sceneNumber: number;
  setting: string;
  action: string;
  videoPrompt: string;
  imagePrompt: string;
  voiceOver: string;
  generatedImageBase64?: string;
  isGeneratingImage?: boolean;
  generatedAudioBase64?: string;
  isGeneratingAudio?: boolean;
}

interface AnimasiIdea {
  title: string;
  artStyle: string;
  colorPalette: string;
  characters: AnimasiCharacter[];
  scenes: AnimasiScene[];
}

interface CommercialIdea {
  title: string;
  hook: string;
  painPoint: string;
  solution: string;
  scenes: { shot: string; visual: string; audio: string }[];
  cta: string;
}

interface ElementorIdea {
  niche: string;
  heroHeadline: string;
  heroSubheadline: string;
  benefitPoints: string[];
  features: { title: string; description: string }[];
  targetAudience: string;
  pricingStrategy: string;
  ctaText: string;
}

interface CanvaIdea {
  niche: string;
  bundleName: string;
  description: string;
  categories: { name: string; count: number; description: string }[];
  targetAudience: string;
  marketingAngle: string;
  pricingIdea: string;
  ctaText: string;
}

interface JualagiIdea {
  productName: string;
  tagline: string;
  benefitList: string[];
  featuresList: string[];
  targetMarket: string;
  pricingResell: string;
  ctaSales: string;
}

interface MagnetIdea {
  ideBisnis: string;
  metodePencarian: string;
  blueprintPenjualan: string[];
  strategiSkalasi: string[];
  targetMarket: string;
  potensiIncome: string;
}

const STORYFRAME_NICHES = [
  {
    id: "misteri",
    icon: Search,
    title: "Misteri & Konspirasi",
    desc: "Mengungkap rahasia dan kisah tersembunyi.",
  },
  {
    id: "travel",
    icon: Globe,
    title: "Travel & Cerita Dunia",
    desc: "Sejarah tempat & fakta unik dunia.",
  },
  {
    id: "kuliner",
    icon: Coffee,
    title: "Kuliner & Kisah Budaya",
    desc: "Filosofi makanan & tradisi lokal.",
  },
  {
    id: "fiksi",
    icon: BookOpen,
    title: "Cerita Fiksi & Novel",
    desc: "Cerpen, novel, kisah cinta, dan drama fiksi.",
  },
  {
    id: "islami",
    icon: Moon,
    title: "Kisah Islami (Sejarah)",
    desc: "Sejarah murni & riwayat nabi yang autentik.",
  },
  {
    id: "kristiani",
    icon: Book,
    title: "Kisah Kristiani (Sejarah)",
    desc: "Perjalanan tokoh Alkitab & sejarah Gereja.",
  },
  {
    id: "biografi",
    icon: User,
    title: "Biografi Tokoh",
    desc: "Kisah inspiratif dari tokoh-tokoh dunia.",
  },
  {
    id: "anak",
    icon: Smile,
    title: "Cerita Animasi Anak",
    desc: "Kisah ceria, mendidik, dan penuh pesan moral.",
  },
  {
    id: "clay3d",
    icon: Box,
    title: "Animasi Clay 3D",
    desc: "Kisah dengan gaya visual plastisin.",
  },
  {
    id: "edukasi",
    icon: GraduationCap,
    title: "Edukasi & Sains",
    desc: "Menjelaskan hal rumit menjadi sederhana.",
  },
  {
    id: "psikologi",
    icon: Brain,
    title: "Psikologi & Self-Dev",
    desc: "Wawasan untuk pengembangan diri.",
  },
  {
    id: "bisnis",
    icon: Briefcase,
    title: "Bisnis & Marketing",
    desc: "Strategi, studi kasus, dan tren pasar.",
  },
  {
    id: "berita",
    icon: Newspaper,
    title: "Berita & Politik Terkini",
    desc: "Berita viral, ekonomi, dan update.",
  },
  {
    id: "parenting",
    icon: Users,
    title: "Parenting & Keluarga",
    desc: "Kisah keluarga & pendidikan karakter.",
  },
  {
    id: "pastry",
    icon: Cake,
    title: "Pastry & Bakery",
    desc: "Tutorial, resep, dan rahasia membuat pastry lezat.",
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<
    | "split"
    | "cuan"
    | "haji"
    | "iqtibas"
    | "storyframe"
    | "paradox"
    | "animasi"
    | "commercial"
    | "elementor"
    | "canva"
    | "jualagi"
    | "magnet"
  >("split");

  // ============================================
  // COMMERCIAL STATE
  // ============================================
  const [commercialInput, setCommercialInput] = useState("");
  const [commercialLoading, setCommercialLoading] = useState(false);
  const [commercialIdea, setCommercialIdea] = useState<CommercialIdea | null>(
    null,
  );
  const [commercialError, setCommercialError] = useState("");
  const [copiedCommercial, setCopiedCommercial] = useState(false);

  // ============================================
  // ELEMENTOR STATE
  // ============================================
  const [elementorInput, setElementorInput] = useState("");
  const [elementorLoading, setElementorLoading] = useState(false);
  const [elementorIdea, setElementorIdea] = useState<ElementorIdea | null>(
    null,
  );
  const [elementorError, setElementorError] = useState("");
  const [copiedElementor, setCopiedElementor] = useState(false);

  // ============================================
  // CANVA STATE
  // ============================================
  const [canvaInput, setCanvaInput] = useState("");
  const [canvaLoading, setCanvaLoading] = useState(false);
  const [canvaIdea, setCanvaIdea] = useState<CanvaIdea | null>(null);
  const [canvaError, setCanvaError] = useState("");
  const [copiedCanva, setCopiedCanva] = useState(false);

  // ============================================
  // JUALAGI STATE
  // ============================================
  const [jualagiInput, setJualagiInput] = useState("");
  const [jualagiLoading, setJualagiLoading] = useState(false);
  const [jualagiIdea, setJualagiIdea] = useState<JualagiIdea | null>(null);
  const [jualagiError, setJualagiError] = useState("");
  const [copiedJualagi, setCopiedJualagi] = useState(false);

  // ============================================
  // MAGNET STATE
  // ============================================
  const [magnetInput, setMagnetInput] = useState("");
  const [magnetLoading, setMagnetLoading] = useState(false);
  const [magnetIdea, setMagnetIdea] = useState<MagnetIdea | null>(null);
  const [magnetError, setMagnetError] = useState("");
  const [copiedMagnet, setCopiedMagnet] = useState(false);

  // ============================================
  // ANIMASI STATE
  // ============================================
  const [animasiSector, setAnimasiSector] = useState<
    "pipeline" | "infografik" | "storyboard" | "fotostudio" | "voiceover"
  >("pipeline");

  // PIPELINE
  const [animasiInput, setAnimasiInput] = useState("");
  const [animasiLoading, setAnimasiLoading] = useState(false);
  const [animasiIdea, setAnimasiIdea] = useState<AnimasiIdea | null>(null);
  const [animasiError, setAnimasiError] = useState("");
  const [copiedAnimasi, setCopiedAnimasi] = useState(false);

  // INFOGRAFIK
  const [infoInput, setInfoInput] = useState("");
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoIdea, setInfoIdea] = useState<any>(null);
  const [infoError, setInfoError] = useState("");

  // STORYBOARD (SECTOR)
  const [sbInput, setSbInput] = useState("");
  const [sbLoading, setSbLoading] = useState(false);
  const [sbIdea, setSbIdea] = useState<any>(null);
  const [sbError, setSbError] = useState("");

  // FOTOSTUDIO
  const [fotoImg, setFotoImg] = useState<string | null>(null);
  const [fotoLoading, setFotoLoading] = useState(false);
  const [fotoOutput, setFotoOutput] = useState("");
  const [fotoError, setFotoError] = useState("");

  // VOICEOVER
  const [voInput, setVoInput] = useState("");
  const [voVoice, setVoVoice] = useState("Puck");
  const [voLoading, setVoLoading] = useState(false);
  const [voOutput, setVoOutput] = useState("");
  const [voError, setVoError] = useState("");

  // ============================================
  // SPLIT BILL STATE
  // ============================================
  const [people, setPeople] = useState<Person[]>([
    { id: "1", name: "Aku" },
    { id: "2", name: "Kamu" },
  ]);
  const [items, setItems] = useState<LineItem[]>([]);
  const [newPersonName, setNewPersonName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemSharedBy, setNewItemSharedBy] = useState<string[]>([]);
  const [taxPercent, setTaxPercent] = useState<number>(11);
  const [servicePercent, setServicePercent] = useState<number>(5);
  const [payments, setPayments] = useState<Record<string, boolean>>({});
  const [copiedSplit, setCopiedSplit] = useState(false);

  // ============================================
  // INFO CUAN STATE
  // ============================================
  const [cuanInput, setCuanInput] = useState("");
  const [cuanLoading, setCuanLoading] = useState(false);
  const [cuanIdea, setCuanIdea] = useState<CuanIdea | null>(null);
  const [cuanError, setCuanError] = useState("");
  const [copiedCuan, setCopiedCuan] = useState(false);

  // ============================================
  // IQTIBAS STATE
  // ============================================
  const [iqtibasInput, setIqtibasInput] = useState("");
  const [iqtibasLoading, setIqtibasLoading] = useState(false);
  const [iqtibasIdea, setIqtibasIdea] = useState<IqtibasIdea | null>(null);
  const [iqtibasError, setIqtibasError] = useState("");
  const [copiedIqtibasIdea, setCopiedIqtibasIdea] = useState(false);

  // ============================================
  // STORYFRAME STATE
  // ============================================
  const [storyFrameInput, setStoryFrameInput] = useState("");
  const [storyFrameSelectedNiche, setStoryFrameSelectedNiche] = useState("");
  const [storyFrameLoading, setStoryFrameLoading] = useState(false);
  const [storyFrameIdea, setStoryFrameIdea] = useState<StoryFrameIdea | null>(
    null,
  );
  const [storyFrameError, setStoryFrameError] = useState("");
  const [copiedStoryFrame, setCopiedStoryFrame] = useState(false);

  // ============================================
  // INNER PARADOX STATE
  // ============================================
  const [paradoxInput, setParadoxInput] = useState("");
  const [paradoxLoading, setParadoxLoading] = useState(false);
  const [paradoxIdea, setParadoxIdea] = useState<InnerParadoxIdea | null>(null);
  const [paradoxError, setParadoxError] = useState("");
  const [copiedParadox, setCopiedParadox] = useState(false);

  // ============================================
  // WAR HAJI STATE
  // ============================================
  const [hajiPhase, setHajiPhase] = useState<
    "idle" | "countdown" | "queue" | "spam" | "result"
  >("idle");
  const [hajiQueue, setHajiQueue] = useState(0);
  const [hajiClicks, setHajiClicks] = useState(0);
  const [hajiTime, setHajiTime] = useState(0);
  const [hajiIsSuccess, setHajiIsSuccess] = useState(false);

  // ============================================
  // LOGIC: SPLIT BILL
  // ============================================
  const togglePayment = (id: string) => {
    setPayments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addPerson = () => {
    if (!newPersonName.trim()) return;
    const newId = Math.random().toString(36).substr(2, 9);
    setPeople([...people, { id: newId, name: newPersonName.trim() }]);
    setNewItemSharedBy([...newItemSharedBy, newId]);
    setNewPersonName("");
  };

  const removePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id));
    setItems(
      items.map((item) => ({
        ...item,
        sharedBy: item.sharedBy.filter((pid) => pid !== id),
      })),
    );
  };

  const addItem = () => {
    if (!newItemName.trim() || !newItemPrice || newItemSharedBy.length === 0)
      return;
    const price = parseFloat(newItemPrice.replace(/,/g, ""));
    if (isNaN(price)) return;

    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newItemName.trim(),
        price,
        sharedBy: newItemSharedBy,
      },
    ]);

    setNewItemName("");
    setNewItemPrice("");
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleItemShare = (personId: string) => {
    if (newItemSharedBy.includes(personId)) {
      setNewItemSharedBy(newItemSharedBy.filter((id) => id !== personId));
    } else {
      setNewItemSharedBy([...newItemSharedBy, personId]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const { subtotal, totalTaxService, finalTotal, personTotals } =
    useMemo(() => {
      let subtotal = 0;
      const personShares: Record<string, number> = {};

      people.forEach((p) => (personShares[p.id] = 0));

      items.forEach((item) => {
        subtotal += item.price;
        const validSharers = item.sharedBy.filter((id) =>
          people.some((p) => p.id === id),
        );
        if (validSharers.length > 0) {
          const costPerPerson = item.price / validSharers.length;
          validSharers.forEach((pid) => {
            if (personShares[pid] !== undefined) {
              personShares[pid] += costPerPerson;
            }
          });
        }
      });

      const taxAmount = subtotal * (taxPercent / 100);
      const serviceAmount = subtotal * (servicePercent / 100);
      const totalTaxService = taxAmount + serviceAmount;
      const finalTotal = subtotal + totalTaxService;

      const personTotalsMap = people.map((p) => {
        const pSubtotal = personShares[p.id] || 0;
        const proportion = subtotal > 0 ? pSubtotal / subtotal : 0;
        const pTaxService = proportion * totalTaxService;
        const pTotal = pSubtotal + pTaxService;
        return {
          ...p,
          subtotal: pSubtotal,
          taxService: pTaxService,
          total: pTotal,
        };
      });

      return {
        subtotal,
        totalTaxService,
        finalTotal,
        personTotals: personTotalsMap,
      };
    }, [items, people, taxPercent, servicePercent]);

  const amountCollected = personTotals.reduce(
    (sum, p) => sum + (payments[p.id] ? p.total : 0),
    0,
  );
  const amountRemaining = finalTotal - amountCollected;

  const handleShareSplit = async () => {
    let text = `🧾 *TAGIHAN SPLIT BILL*\n\n`;
    text += `Subtotal: ${formatCurrency(subtotal)}\n`;
    text += `Pajak (${taxPercent}%) & Servis (${servicePercent}%): ${formatCurrency(totalTaxService)}\n`;
    text += `*TOTAL KESELURUHAN: ${formatCurrency(finalTotal)}*\n\n`;
    text += `🎯 *RINCIAN PER ORANG:*\n`;
    personTotals.forEach((p) => {
      if (p.total > 0) {
        const isPaid = payments[p.id] ? "[LUNAS] ✅" : "[BELUM] ❌";
        text += `- *${p.name}*: ${formatCurrency(p.total)} ${isPaid}\n`;
      }
    });

    text += `\n🚀 Dihitung via Brutal Tools`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Split Bill Tagihan", text });
      } catch (e) {
        console.log("Error sharing:", e);
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopiedSplit(true);
      setTimeout(() => setCopiedSplit(false), 2000);
    }
  };

  // ============================================
  // LOGIC: INFO CUAN
  // ============================================
  const getCuanInfo = async () => {
    if (!cuanInput.trim()) {
      setCuanError("Isi dulu modal atau skill kamu bos!");
      return;
    }
    setCuanLoading(true);
    setCuanError("");
    setCuanIdea(null);

    try {
      const prompt = `Kamu adalah konsultan bisnis Indonesia yang gaul, asik, dan pintar mencari celah bisnis. User meminta "info cuan" dengan kondisi/modal: "${cuanInput}". Berikan 1 ide bisnis atau cara menghasilkan uang yang spesifik, realistis, dan kreatif. Format jawaban HARUS dalam bentuk JSON: {"title": "Nama Ide", "description": "Penjelasan singkat", "steps": ["Langkah 1", "Langkah 2"], "estimatedCapital": "Estimasi modal", "potentialProfit": "Estimasi keuntungan harian/bulanan", "vibe": "Kalimat penyemangat"}. TANPA MARKDOWN \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.8 },
      });

      const textFormat =
        response.text
          ?.replace(/```json/g, "")
          .replace(/```/g, "")
          .trim() || "";
      try {
        const parsedData = JSON.parse(textFormat);
        setCuanIdea(parsedData);
      } catch (e) {
        setCuanError("Waduh, AI-nya lagi pusing mikirin cuan. Coba lagi bos!");
      }
    } catch (err) {
      setCuanError("Gagal narik info cuan dari server. Coba lagi ya!");
    } finally {
      setCuanLoading(false);
    }
  };

  const handleShareCuan = async () => {
    if (!cuanIdea) return;
    const shareText = `🎯 ${cuanIdea.title}\n\n${cuanIdea.description}\n\n💸 Modal: ${cuanIdea.estimatedCapital}\n📈 Potensi: ${cuanIdea.potentialProfit}\n\n🚀 Dapatkan ide cuan via Brutal Tools`;
    if (navigator.share) {
      try {
        await navigator.share({ title: cuanIdea.title, text: shareText });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopiedCuan(true);
      setTimeout(() => setCopiedCuan(false), 2000);
    }
  };

  // ============================================
  // LOGIC: IQTIBAS
  // ============================================
  const getIqtibasInfo = async () => {
    if (!iqtibasInput.trim()) {
      setIqtibasError("Ceritain dulu kondisinya bos!");
      return;
    }
    setIqtibasLoading(true);
    setIqtibasError("");
    setIqtibasIdea(null);

    try {
      const prompt = `Kamu adalah pakar Sastra Arab (Balaghah) tingkat tinggi yang ahli dalam seni "Iqtibas" (menyisipkan potongan ayat Al-Qur'an atau Hadis ke dalam kalimat sehari-hari tanpa menyebut spesifik itu firman/sabda). User meminta dibuatkan kalimat Iqtibas untuk situasi/konteks: "${iqtibasInput}". Berikan 1 contoh iqtibas yang relevan, natural, dan menyentuh. Format HARUS JSON murni: {"context": "Situasi yang diberikan", "quote": "Teks bahasa Indonesia dengan ayat Arab/transliterasi di tengahnya", "source": "Sumber kutipan (cth: QS. Al-Baqarah: x)", "explanation": "Penjelasan detail tentang iqtibas ini"}. TANPA MARKDOWN \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.8 },
      });

      const textFormat =
        response.text
          ?.replace(/\`\`\`json/g, "")
          .replace(/\`\`\`/g, "")
          .trim() || "";
      try {
        const parsedData = JSON.parse(textFormat);
        setIqtibasIdea(parsedData);
      } catch (e) {
        setIqtibasError("AI lagi nyari wangsit ayat, coba lagi bos!");
      }
    } catch (err) {
      setIqtibasError(
        "Gagal merangkai kata suci dari server. Pastikan API key kamu valid.",
      );
    } finally {
      setIqtibasLoading(false);
    }
  };

  const handleShareIqtibas = async () => {
    if (!iqtibasIdea) return;
    const shareText = `✨ Sastra Iqtibas:\n"${iqtibasIdea.quote}"\n\n📖 ${iqtibasIdea.source}\n\n💡 Makna: ${iqtibasIdea.explanation}\n\n🚀 Generated via Brutal Tools`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Iqtibas Quote", text: shareText });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopiedIqtibasIdea(true);
      setTimeout(() => setCopiedIqtibasIdea(false), 2000);
    }
  };

  // ============================================
  // LOGIC: STORY FRAME AI
  // ============================================
  const getStoryFrameInfo = async () => {
    if (!storyFrameSelectedNiche) {
      setStoryFrameError("Pilih Niche Studio dulu bos!");
      return;
    }
    if (!storyFrameInput.trim()) {
      setStoryFrameError("Input ide ceritanya dulu bos!");
      return;
    }
    setStoryFrameLoading(true);
    setStoryFrameError("");
    setStoryFrameIdea(null);

    try {
      const prompt = `Kamu adalah seorang AI Film Director dan Content Strategist kelas atas. User memilih Niche Studio: "${storyFrameSelectedNiche}" dan meminta dibuatkan "StoryFrame Pipeline" untuk ide kasar: "${storyFrameInput}". Berikan kerangka yang sangat kuat, mencakup Niche, Angle, Scene Builder, Visual/Motion Prompts, dan Voice-over. Format jawaban HARUS dalam bentuk JSON murni: 
      {
        "title": "Judul Konten Hook",
        "niche": "Kategori spesifik di dalam ${storyFrameSelectedNiche} (cth: Tech Edu, Comedy Skit)",
        "angle": "Sudut pandang/perspektif penceritaan unik",
        "targetAudience": "Deskripsi target audiens spesifik",
        "frames": [
          {
            "frameNumber": 1,
            "visualPrompt": "Deskripsi visual yang hiper-spesifik & estetik untuk di-generate AI Image",
            "motionPrompt": "Arah gerakan objek/subjek di dalam frame",
            "voiceOverText": "Narasi/Dialog untuk adegan ini",
            "cameraAngle": "Sudut/Pergerakan Kamera"
          }
        ]
      }. 
      Pastikan minimal 3 frames. JANGAN GUNAKAN MARKDOWN \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.8 },
      });

      const textFormat =
        response.text
          ?.replace(/\`\`\`json/g, "")
          .replace(/\`\`\`/g, "")
          .trim() || "";
      try {
        const parsedData = JSON.parse(textFormat);
        setStoryFrameIdea(parsedData);
      } catch (e) {
        setStoryFrameError(
          "AI sutradara lagi writer's block, coba kata kunci lain!",
        );
      }
    } catch (err) {
      setStoryFrameError(
        "Jaringan gagal memanggil sutradara dari server (API error).",
      );
    } finally {
      setStoryFrameLoading(false);
    }
  };

  const generateImageForFrame = async (frameIdx: number, prompt: string) => {
    setStoryFrameIdea((prev) => {
      if (!prev) return prev;
      const newFrames = [...prev.frames];
      newFrames[frameIdx] = { ...newFrames[frameIdx], isGeneratingImage: true };
      return { ...prev, frames: newFrames };
    });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: `Create a highly detailed cinematic frame, hyper-realistic, dramatic lighting, 8k resolution. Scene: ${prompt}`,
      });
      let base64 = "";
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            base64 = part.inlineData.data;
            break;
          }
        }
      }
      if (base64) {
        setStoryFrameIdea((prev) => {
          if (!prev) return prev;
          const newFrames = [...prev.frames];
          newFrames[frameIdx] = {
            ...newFrames[frameIdx],
            isGeneratingImage: false,
            generatedImageBase64: base64,
          };
          return { ...prev, frames: newFrames };
        });
      } else {
        throw new Error("No image returned");
      }
    } catch (e) {
      alert("Gagal meng-generate Visual! Coba lagi.");
      setStoryFrameIdea((prev) => {
        if (!prev) return prev;
        const newFrames = [...prev.frames];
        newFrames[frameIdx] = {
          ...newFrames[frameIdx],
          isGeneratingImage: false,
        };
        return { ...prev, frames: newFrames };
      });
    }
  };

  const generateAudioForFrame = async (frameIdx: number, text: string) => {
    setStoryFrameIdea((prev) => {
      if (!prev) return prev;
      const newFrames = [...prev.frames];
      newFrames[frameIdx] = { ...newFrames[frameIdx], isGeneratingAudio: true };
      return { ...prev, frames: newFrames };
    });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" },
            },
          },
        },
      });
      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        setStoryFrameIdea((prev) => {
          if (!prev) return prev;
          const newFrames = [...prev.frames];
          newFrames[frameIdx] = {
            ...newFrames[frameIdx],
            isGeneratingAudio: false,
            generatedAudioBase64: base64Audio,
          };
          return { ...prev, frames: newFrames };
        });
      } else {
        throw new Error("No audio returned");
      }
    } catch (e) {
      alert("Gagal meng-generate Voice-Over! Coba lagi.");
      setStoryFrameIdea((prev) => {
        if (!prev) return prev;
        const newFrames = [...prev.frames];
        newFrames[frameIdx] = {
          ...newFrames[frameIdx],
          isGeneratingAudio: false,
        };
        return { ...prev, frames: newFrames };
      });
    }
  };

  const handleShareStoryFrame = async () => {
    if (!storyFrameIdea) return;
    let shareText = `🎬 ${storyFrameIdea.title}\n📍 Niche: ${storyFrameIdea.niche}\n📐 Angle: ${storyFrameIdea.angle}\n\n`;
    storyFrameIdea.frames.forEach((f) => {
      shareText += `--- FRAME ${f.frameNumber} ---\n👁 Visual: ${f.visualPrompt}\n🏃 Motion: ${f.motionPrompt}\n🎙 Voice: ${f.voiceOverText}\n🎥 Kamera: ${f.cameraAngle}\n\n`;
    });
    shareText += `🚀 Directed via Brutal Tools StoryFrame AI`;

    if (navigator.share) {
      try {
        await navigator.share({ title: storyFrameIdea.title, text: shareText });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopiedStoryFrame(true);
      setTimeout(() => setCopiedStoryFrame(false), 2000);
    }
  };

  // ============================================
  // LOGIC: INNER PARADOX
  // ============================================
  const getParadoxInfo = async () => {
    if (!paradoxInput.trim()) {
      setParadoxError("Input deskripsi karakternya dulu!");
      return;
    }
    setParadoxLoading(true);
    setParadoxError("");
    setParadoxIdea(null);

    try {
      const prompt = `Kamu adalah pakar Psikologi Karakter dan Scriptwriter profesional. User memberikan deskripsi kasar seorang karakter/subjek: "${paradoxInput}". Buatlah analisis 'Inner Paradox' (Paradoks Internal) dari karakter ini untuk membuatnya sangat nyata, kompleks, dan memiliki kedalaman psikologis. Format jawaban HARUS dalam bentuk JSON murni: 
      {
        "surfacePersona": "Bagaimana sifat/topeng yang dia tunjukkan ke dunia luar sehari-hari",
        "coreWound": "Luka batin atau trauma masa lalu yang disembunyikan",
        "theParadox": "Pernyataan satu kalimat tentang paradoks terbesarnya (cth: Sangat mendambakan koneksi tapi selalu menyabotase keintiman karena takut ditinggalkan)",
        "behavioralQuirks": ["Kebiasaan aneh 1", "Kebiasaan aneh 2", "Micro-expression saat tertekan"],
        "breakingPoint": "Situasi spesifik apa yang akan membuat paradoks ini hancur dan membongkar sifat aslinya"
      }.
      JANGAN GUNAKAN MARKDOWN \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.9 },
      });

      const textFormat =
        response.text
          ?.replace(/\`\`\`json/g, "")
          .replace(/\`\`\`/g, "")
          .trim() || "";
      try {
        const parsedData = JSON.parse(textFormat);
        setParadoxIdea(parsedData);
      } catch (e) {
        setParadoxError(
          "Gagal menembus alam bawah sadar, coba deskripsi yang berbeda.",
        );
      }
    } catch (err) {
      setParadoxError(
        "Gagal terhubung ke server neuro-psikologis (API error).",
      );
    } finally {
      setParadoxLoading(false);
    }
  };

  const handleShareParadox = async () => {
    if (!paradoxIdea) return;
    const shareText = `🧠 INNER PARADOX DIAGNOSIS 🧠\n\n🛡 Persona: ${paradoxIdea.surfacePersona}\n🗡 Core Wound: ${paradoxIdea.coreWound}\n🌪 The Paradox: ${paradoxIdea.theParadox}\n\n⚠️ Breaking Point:\n${paradoxIdea.breakingPoint}\n\nDi-diagnosa via Brutal Tools`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Inner Paradox", text: shareText });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopiedParadox(true);
      setTimeout(() => setCopiedParadox(false), 2000);
    }
  };

  // ============================================
  // LOGIC: ELEMENTOR
  // ============================================
  const getElementorInfo = async () => {
    if (!elementorInput.trim()) {
      setElementorError("Input ide bisnis atau produk lu bos!");
      return;
    }

    setElementorLoading(true);
    setElementorError("");
    setElementorIdea(null);

    try {
      const prompt = `Kamu adalah Expert Copywriter & Landing Page Specialist. User ingin membuat Landing Page (bisa dibuat via Elementor) untuk produk/jasa: "${elementorInput}".
      Buatlah struktur wireframe Landing Page yang persuasif tinggi. Format HARUS JSON:
      {
        "niche": "Kategori spesifik bisnis",
        "heroHeadline": "Headline utama (maks 10 kata, super bombastis)",
        "heroSubheadline": "Penjelasan singkat bawah headline",
        "benefitPoints": ["Benefit 1", "Benefit 2", "Benefit 3"],
        "features": [
          {"title": "Nama Fitur 1", "description": "Penjelasan fitur dan keuntungannya"},
          {"title": "Nama Fitur 2", "description": "Penjelasan fitur dan keuntungannya"},
          {"title": "Nama Fitur 3", "description": "Penjelasan fitur dan keuntungannya"}
        ],
        "targetAudience": "Siapa yang paling butuh ini",
        "pricingStrategy": "Saran harga atau gimik diskon",
        "ctaText": "Tombol Call to Action yang mantap"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let responseText = response.text;

      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
        const parsedData = JSON.parse(responseText);
        setElementorIdea(parsedData);
      } else {
        setElementorError("Gagal men-generate struktur copy Landing Page.");
      }
    } catch (err: any) {
      setElementorError("Gagal merumuskan Landing Page (API error).");
      console.error(err);
    } finally {
      setElementorLoading(false);
    }
  };

  const handleShareElementor = async () => {
    if (!elementorIdea) return;
    const shareText = `🚀 LANDING PAGE BLUEPRINT 🚀\n\n🎯 Niche/Target: ${elementorIdea.niche} - ${elementorIdea.targetAudience}\n\n💥 HEADLINE: ${elementorIdea.heroHeadline}\n✨ Subheadline: ${elementorIdea.heroSubheadline}\n\n🔥 THE BENEFITS:\n${elementorIdea.benefitPoints.map((b) => `- ${b}`).join("\n")}\n\n🛠 KILLER FEATURES:\n${elementorIdea.features.map((f) => `🔹 ${f.title}: ${f.description}`).join("\n")}\n\n💰 PRICING: ${elementorIdea.pricingStrategy}\n\n👉 CTA: ${elementorIdea.ctaText}\n\nDi-generate via Brutal Tools`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Landing Page Blueprint",
          text: shareText,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedElementor(true);
      setTimeout(() => setCopiedElementor(false), 2000);
    }
  };

  // ============================================
  // LOGIC: JUALAGI
  // ============================================
  const getJualagiInfo = async () => {
    if (!jualagiInput.trim()) {
      setJualagiError("Input ide produk digital lu bos!");
      return;
    }

    setJualagiLoading(true);
    setJualagiError("");
    setJualagiIdea(null);

    try {
      const prompt = `Kamu adalah Expert Digital Product & MRR/PLR Creator. User ingin membuat paketan bisnis digital "JUALAGI 6.0" (Atau versi custom) tentang: "${jualagiInput}".
      Buatlah landing page copy dan susunan bundle produk MRR/PLR yang bernilai tinggi dan bisa dijual ulang oleh pembelinya. Format HARUS JSON murni:
      {
        "productName": "Nama bundle produk digital",
        "tagline": "Hook mematikan di awal halaman",
        "benefitList": ["Keuntungan pembeli 1", "Keuntungan 2", "Keuntungan 3"],
        "featuresList": ["Isi produk 1", "Isi produk 2", "Isi produk 3"],
        "targetMarket": "Siapa yang wajib beli produk ini",
        "pricingResell": "Harga jual bundle ini beserta harga rekomendasi jual ulangnya",
        "ctaSales": "Tombol call to action yang mendesak"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let responseText = response.text;

      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
        const parsedData = JSON.parse(responseText);
        setJualagiIdea(parsedData);
      } else {
        setJualagiError("Gagal men-generate susunan JUALAGI 6.0.");
      }
    } catch (err: any) {
      setJualagiError("Gagal merumuskan produk (API error).");
      console.error(err);
    } finally {
      setJualagiLoading(false);
    }
  };

  const handleShareJualagi = async () => {
    if (!jualagiIdea) return;
    const shareText = `🔥 JUALAGI 6.0 - DIGITAL ASSET 🔥\n\n💥 NAMA PRODUK: ${jualagiIdea.productName}\n✨ Tagline: ${jualagiIdea.tagline}\n\n🎯 TARGET MARKET: ${jualagiIdea.targetMarket}\n\n🚀 BENEFIT UNTUK RESELLER:\n${jualagiIdea.benefitList.map((b) => `- ${b}`).join("\n")}\n\n📦 ISI BUNDLE:\n${jualagiIdea.featuresList.map((f) => `✔️ ${f}`).join("\n")}\n\n💰 PRICING STRATEGY: ${jualagiIdea.pricingResell}\n\n👉 CTA: ${jualagiIdea.ctaSales}\n\nDi-generate via Brutal Tools`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Jualagi 6.0 Blueprint",
          text: shareText,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedJualagi(true);
      setTimeout(() => setCopiedJualagi(false), 2000);
    }
  };

  // ============================================
  // LOGIC: MAGNET UANG
  // ============================================
  const getMagnetInfo = async () => {
    if (!magnetInput.trim()) {
      setMagnetError("Input interest/keahlian/ide awal lu bos!");
      return;
    }

    setMagnetLoading(true);
    setMagnetError("");
    setMagnetIdea(null);

    try {
      const prompt = `Kamu adalah Business Strategist & Funnel Expert. User ingin mencari "MAGNET UANG" dari topik/keahlian berikut: "${magnetInput}".
      Terapkan "Metode Pencarian Ide Magnet Uang" yang belum tergarap, "Blueprint Penjualan Berulang Otomatis", dan "Strategi Monetisasi & Skalasi Cepat".
      Hasilkan output format HARUS JSON murni:
      {
        "ideBisnis": "Ide bisnis online spesifik dari topik tersebut",
        "metodePencarian": "Penjelasan framework kenapa ide ini berpotensi tinggi secara konsisten",
        "blueprintPenjualan": ["Langkah 1 funnel otomatis", "Langkah 2 funnel otomatis", "Langkah 3 funnel otomatis"],
        "strategiSkalasi": ["Strategi 1 lipatgandakan omzet", "Strategi 2 lipatgandakan omzet", "Strategi 3"],
        "targetMarket": "Siapakah pembeli paling loyal",
        "potensiIncome": "Estimasi pertumbuhan misal dari Rp0 ke Puluhan Juta dalam waktu X bulan"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let responseText = response.text;

      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
        const parsedData = JSON.parse(responseText);
        setMagnetIdea(parsedData);
      } else {
        setMagnetError("Gagal men-generate blueprint Magnet Uang.");
      }
    } catch (err: any) {
      setMagnetError("Gagal merumuskan Magnet Uang (API error).");
      console.error(err);
    } finally {
      setMagnetLoading(false);
    }
  };

  const handleShareMagnet = async () => {
    if (!magnetIdea) return;
    const shareText = `💸 MAGNET UANG BLUEPRINT 💸\n\n🎯 IDE BISNIS: ${magnetIdea.ideBisnis}\n\n🕵️ METODE PENCARIAN & POTENSI:\n${magnetIdea.metodePencarian}\n\n🔄 BLUEPRINT PENJUALAN BERULANG:\n${magnetIdea.blueprintPenjualan.map((b, i) => `${i + 1}. ${b}`).join("\n")}\n\n🚀 STRATEGI SKALASI & MONETISASI CEPAT:\n${magnetIdea.strategiSkalasi.map((s) => `✔️ ${s}`).join("\n")}\n\n💰 POTENSI INCOME: ${magnetIdea.potensiIncome}\n\nDi-generate via Brutal Tools`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Magnet Uang Blueprint",
          text: shareText,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedMagnet(true);
      setTimeout(() => setCopiedMagnet(false), 2000);
    }
  };

  // ============================================
  // LOGIC: CANVA
  // ============================================
  const getCanvaInfo = async () => {
    if (!canvaInput.trim()) {
      setCanvaError("Input target niche / topik template lu bos!");
      return;
    }

    setCanvaLoading(true);
    setCanvaError("");
    setCanvaIdea(null);

    try {
      const prompt = `Kamu adalah Expert Digital Product Creator. User ingin membuat paketan "PREMIUM TEMPLATE CANVA BUNDLE PACKAGE (WHITELABEL)" untuk niche/topik: "${canvaInput}".
      Buat susunan produk bundle yang terlihat sangat "value for money" alias bernilai jutaan rupiah tapi dijual murah. Format HARUS JSON murni:
      {
        "niche": "Kategori niche",
        "bundleName": "Nama Bundle (super menarik, bombastis)",
        "description": "Deskripsi singkat yang menjual",
        "categories": [
          {"name": "Nama Kategori Kumpulan Template", "count": 250, "description": "Penjelasan isinya"}
        ],
        "targetAudience": "Target pasar spesifik",
        "marketingAngle": "Sudut pandang jualan supaya laku keras",
        "pricingIdea": "Coret harga asli (mahal) -> Harga diskon gila-gilaan",
        "ctaText": "Tombol action"
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let responseText = response.text;

      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
        const parsedData = JSON.parse(responseText);
        setCanvaIdea(parsedData);
      } else {
        setCanvaError("Gagal men-generate struktur Bundle Canva.");
      }
    } catch (err: any) {
      setCanvaError("Gagal menyusun Bundle Canva (API error).");
      console.error(err);
    } finally {
      setCanvaLoading(false);
    }
  };

  const handleShareCanva = async () => {
    if (!canvaIdea) return;
    const shareText = `🎨 CANVA PREMIUM BUNDLE 🎨\n\n🎯 Niche/Target: ${canvaIdea.niche} - ${canvaIdea.targetAudience}\n\n💥 BUNDLE NAME: ${canvaIdea.bundleName}\n✨ Deskripsi: ${canvaIdea.description}\n\n📦 WHAT'S INSIDE:\n${canvaIdea.categories.map((c) => `🔹 ${c.name} (${c.count} items)\n   ${c.description}`).join("\n\n")}\n\n🔥 MARKETING ANGLE: ${canvaIdea.marketingAngle}\n💰 PRICING: ${canvaIdea.pricingIdea}\n\n👉 CTA: ${canvaIdea.ctaText}\n\nDi-generate via Brutal Tools`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Canva Bundle Blueprint",
          text: shareText,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedCanva(true);
      setTimeout(() => setCopiedCanva(false), 2000);
    }
  };

  // ============================================
  // LOGIC: COMMERCIAL
  // ============================================
  const getCommercialInfo = async () => {
    if (!commercialInput.trim()) {
      setCommercialError("Input produk atau jualan lu bos!");
      return;
    }

    setCommercialLoading(true);
    setCommercialError("");
    setCommercialIdea(null);

    try {
      const prompt = `Kamu adalah seorang Sutradara Iklan Cinematic dan Scriptwriter profesional. User ingin membuat video iklan cinematic (hanya pakai HP) untuk produk/jasa: "${commercialInput}". Buatkan konsep video pendek (Reels/TikTok) yang memukau secara visual, murni berfokus pada teknik sinematik HP. Format HARUS JSON:
      {
        "title": "Judul Iklan Pendek",
        "hook": "Detik 1-3 yang nyari perhatian",
        "painPoint": "Masalah yang diangkat secara visual",
        "solution": "Cara produk ini jadi solusi",
        "scenes": [
          {"shot": "Wide/Close-up/Macro/dsb", "visual": "Deskripsi adegan visual", "audio": "SFX / Musik / VO"}
        ],
        "cta": "Call to action di akhir video"
      }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let responseText = response.text;

      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");

      if (jsonStart !== -1 && jsonEnd !== -1) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
        const parsedData = JSON.parse(responseText);
        setCommercialIdea(parsedData);
      } else {
        setCommercialError("Gagal men-generate konsep iklan cinematic.");
      }
    } catch (err: any) {
      setCommercialError("Gagal terhubung ke sutradara internal (API error).");
      console.error(err);
    } finally {
      setCommercialLoading(false);
    }
  };

  const handleShareCommercial = async () => {
    if (!commercialIdea) return;
    const shareText = `🎬 CINEMATIC COMMERCIAL 🎬\n\n📌 Title: ${commercialIdea.title}\n🔥 Hook: ${commercialIdea.hook}\n🎯 Pain Point: ${commercialIdea.painPoint}\n✨ Solution: ${commercialIdea.solution}\n\n🎬 SCENES:\n${commercialIdea.scenes.map((s, i) => `[Scene ${i + 1} - ${s.shot}]\nVisual: ${s.visual}\nAudio: ${s.audio}`).join("\n\n")}\n\n🚀 CTA: ${commercialIdea.cta}\n\nDi-generate via Brutal Tools`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cinematic Commercial",
          text: shareText,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedCommercial(true);
      setTimeout(() => setCopiedCommercial(false), 2000);
    }
  };

  // ============================================
  // LOGIC: ANIMASI AI
  // ============================================
  const getAnimasiInfo = async () => {
    if (!animasiInput.trim()) {
      setAnimasiError("Input ide video animasinya bos!");
      return;
    }
    setAnimasiLoading(true);
    setAnimasiError("");
    setAnimasiIdea(null);

    try {
      const prompt = `Kamu adalah seorang AI Animation Director yang ahli menggunakan Midjourney, Runway, Kling, dan Luma. User ingin membuat video animasi berdasarkan ide: "${animasiInput}". 
      Tugasmu:
      1. Tentukan Art Style dan Color Palette yang paling cocok (misal: "Pixar 3D Style", "Ghibli 2D Retro").
      2. Buat Daftar Karakter dengan nama dan visualPrompt (prompt Midjourney) yang sangat detail agar karakter konsisten.
      3. Buat Scene-by-scene (adegan per adegan) yang mencakup latar (setting), tindakan (action), videoPrompt (seperti untuk Runway/Kling), imagePrompt (seperti untuk Midjourney), dan Voice-over / Dialog.
      
      Format jawaban HARUS dalam bentuk JSON murni: 
      {
        "title": "Judul Film Animasi",
        "artStyle": "Gaya visual (cth: 3D Claymation, Cyberpunk Anime)",
        "colorPalette": "Palet warna utama (cth: Neon Pink & Cyan)",
        "characters": [
          {
            "name": "Nama Karakter",
            "visualPrompt": "Detailed character sheet concept art prompt for Midjourney..."
          }
        ],
        "scenes": [
          {
            "sceneNumber": 1,
            "setting": "Latar tempat dan suasana",
            "action": "Tindakan yang terjadi",
            "videoPrompt": "Prompt spesifik untuk text-to-video AI (Kling/Runway/Luma) mendeskripsikan gerakan dan kamera",
            "imagePrompt": "Prompt spesifik untuk text-to-image AI (Midjourney/Gemini) mendeskripsikan frame statis, lighting, angle",
            "voiceOver": "Narasi atau dialog karakter"
          }
        ]
      }.
      Pastikan minimal 3 scenes. JANGAN GUNAKAN MARKDOWN \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.8 },
      });

      const textFormat =
        response.text
          ?.replace(/\`\`\`json/g, "")
          .replace(/\`\`\`/g, "")
          .trim() || "";
      try {
        const parsedData = JSON.parse(textFormat);
        setAnimasiIdea(parsedData);
      } catch (e) {
        setAnimasiError(
          "Gagal merakit prompt sutradara animasi. AIs sedang pusing, coba lagi.",
        );
      }
    } catch (err) {
      setAnimasiError("Gagal menghubungi server GPU.");
    } finally {
      setAnimasiLoading(false);
    }
  };

  const generateAnimasiImage = async (
    sceneIdx: number,
    prompt: string,
    artStyle: string,
  ) => {
    setAnimasiIdea((prev) => {
      if (!prev) return prev;
      const newScenes = [...prev.scenes];
      newScenes[sceneIdx] = { ...newScenes[sceneIdx], isGeneratingImage: true };
      return { ...prev, scenes: newScenes };
    });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: `Create highly detailed animation concept frame. Art Style: ${artStyle}. Scene: ${prompt}`,
      });
      let base64 = "";
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            base64 = part.inlineData.data;
            break;
          }
        }
      }
      if (base64) {
        setAnimasiIdea((prev) => {
          if (!prev) return prev;
          const newScenes = [...prev.scenes];
          newScenes[sceneIdx] = {
            ...newScenes[sceneIdx],
            isGeneratingImage: false,
            generatedImageBase64: base64,
          };
          return { ...prev, scenes: newScenes };
        });
      } else {
        throw new Error("No image returned");
      }
    } catch (e) {
      alert("Gagal meng-generate Visual Animasi! Coba lagi.");
      setAnimasiIdea((prev) => {
        if (!prev) return prev;
        const newScenes = [...prev.scenes];
        newScenes[sceneIdx] = {
          ...newScenes[sceneIdx],
          isGeneratingImage: false,
        };
        return { ...prev, scenes: newScenes };
      });
    }
  };

  const generateAnimasiAudio = async (sceneIdx: number, text: string) => {
    setAnimasiIdea((prev) => {
      if (!prev) return prev;
      const newScenes = [...prev.scenes];
      newScenes[sceneIdx] = { ...newScenes[sceneIdx], isGeneratingAudio: true };
      return { ...prev, scenes: newScenes };
    });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Puck" }, // maybe a different voice like Puck
            },
          },
        },
      });
      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        setAnimasiIdea((prev) => {
          if (!prev) return prev;
          const newScenes = [...prev.scenes];
          newScenes[sceneIdx] = {
            ...newScenes[sceneIdx],
            isGeneratingAudio: false,
            generatedAudioBase64: base64Audio,
          };
          return { ...prev, scenes: newScenes };
        });
      } else {
        throw new Error("No audio returned");
      }
    } catch (e) {
      alert("Gagal meng-generate Voice-Over! Coba lagi.");
      setAnimasiIdea((prev) => {
        if (!prev) return prev;
        const newScenes = [...prev.scenes];
        newScenes[sceneIdx] = {
          ...newScenes[sceneIdx],
          isGeneratingAudio: false,
        };
        return { ...prev, scenes: newScenes };
      });
    }
  };

  const handleShareAnimasi = async () => {
    if (!animasiIdea) return;
    const shareText = `🎨 ANIMATION PROSPECTUS 🎨\n\n🎬 ${animasiIdea.title}\n✨ Style: ${animasiIdea.artStyle}\n\nGenerated via Brutal Tools`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Animation Project",
          text: shareText,
        });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopiedAnimasi(true);
      setTimeout(() => setCopiedAnimasi(false), 2000);
    }
  };

  // ============================================
  // LOGIC: INFOGRAFIK
  // ============================================
  const getInfografik = async () => {
    if (!infoInput.trim()) {
      setInfoError("Input topik infografis dulu bos!");
      return;
    }
    setInfoLoading(true);
    setInfoError("");
    setInfoIdea(null);

    try {
      const prompt = `Buatkan desain poster infografis yang memukau untuk topik: "${infoInput}". 
      Format jawaban HARUS JSON murni:
      {
        "title": "Judul Infografis Catchy",
        "colorTheme": "Saran palet warna",
        "typography": "Saran font yang dipakai",
        "sections": [
          {
            "heading": "Sub-judul",
            "points": ["Poin 1", "Poin 2"],
            "visualIdea": "Ide visual/ikon untuk bagian ini"
          }
        ]
      }
      JANGAN GUNAKAN MARKDOWN \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.7 },
      });
      const textFormat =
        response.text
          ?.replace(/\`\`\`json/g, "")
          .replace(/\`\`\`/g, "")
          .trim() || "";
      setInfoIdea(JSON.parse(textFormat));
    } catch (e) {
      setInfoError("Gagal menyusun infografis!");
    } finally {
      setInfoLoading(false);
    }
  };

  // ============================================
  // LOGIC: STORYBOARD (SECTOR)
  // ============================================
  const getStoryboardSector = async () => {
    if (!sbInput.trim()) {
      setSbError("Input ide video dulu bos!");
      return;
    }
    setSbLoading(true);
    setSbError("");
    setSbIdea(null);

    try {
      const prompt = `Buatkan struktur storyboard animasi terperinci untuk: "${sbInput}".
      Format JSON murni:
      {
        "projectTitle": "Judul Storyboard",
        "panels": [
          {
            "panelNumber": 1,
            "shotType": "Lebar, Close-up, dll",
            "action": "Deskripsi aksi",
            "dialogue": "Dialog atau efek suara",
            "cameraMotion": "Pan, Tilt, Zoom",
            "timing": "Estimasi detik"
          }
        ]
      }
      JANGAN GUNAKAN MARKDOWN \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.8 },
      });
      const textFormat =
        response.text
          ?.replace(/\`\`\`json/g, "")
          .replace(/\`\`\`/g, "")
          .trim() || "";
      setSbIdea(JSON.parse(textFormat));
    } catch (e) {
      setSbError("Gagal merancang storyboard!");
    } finally {
      setSbLoading(false);
    }
  };

  // ============================================
  // LOGIC: FOTOSTUDIO
  // ============================================
  const generateFotoStudio = async () => {
    if (!fotoImg) {
      setFotoError("Upload foto dulu!");
      return;
    }
    setFotoLoading(true);
    setFotoError("");
    setFotoOutput("");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              inlineData: {
                data: fotoImg.split(",")[1],
                mimeType: "image/jpeg",
              },
            },
            {
              text: "Enhance this photo into a professional studio portrait. Clean up the background, add dramatic high-end studio lighting, and make it photorealistic.",
            },
          ],
        },
      });

      let base64 = "";
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            base64 = part.inlineData.data;
            break;
          }
        }
      }
      if (base64) {
        setFotoOutput(base64);
      } else {
        throw new Error("No image generated");
      }
    } catch (e) {
      setFotoError("Gagal meng-generate foto studio!");
    } finally {
      setFotoLoading(false);
    }
  };

  const handleFotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoImg(reader.result as string);
      setFotoOutput("");
      setFotoError("");
    };
    reader.readAsDataURL(file);
  };

  // ============================================
  // LOGIC: VOICEOVER
  // ============================================
  const getVoiceover = async () => {
    if (!voInput.trim()) {
      setVoError("Tulis teksnya dulu!");
      return;
    }
    setVoLoading(true);
    setVoError("");
    setVoOutput("");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-tts-preview",
        contents: [{ parts: [{ text: voInput }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voVoice },
            },
          },
        },
      });
      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        setVoOutput(base64Audio);
      } else {
        throw new Error("No audio returned");
      }
    } catch (e) {
      setVoError("Gagal generate Voice Over!");
    } finally {
      setVoLoading(false);
    }
  };

  // ============================================
  // LOGIC: WAR HAJI
  // ============================================
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hajiPhase === "countdown") {
      if (hajiTime > 0) {
        timer = setTimeout(() => setHajiTime((t) => t - 1), 1000);
      } else {
        setHajiPhase("queue");
        setHajiQueue(Math.floor(Math.random() * 50000) + 20000);
      }
    } else if (hajiPhase === "spam") {
      if (hajiTime > 0) {
        timer = setTimeout(() => setHajiTime((t) => t - 1), 1000);
      } else {
        setHajiPhase("result");
        setHajiIsSuccess(false); // ran out of time
      }
    }
    return () => clearTimeout(timer);
  }, [hajiPhase, hajiTime]);

  useEffect(() => {
    let dropRate: NodeJS.Timeout;
    if (hajiPhase === "queue") {
      dropRate = setInterval(() => {
        setHajiQueue((prev) => {
          const drop = Math.floor(Math.random() * 6000) + 1000;
          if (prev - drop <= 0) {
            setHajiPhase("spam");
            setHajiTime(5); // 5 sec to get clicks
            setHajiClicks(0);
            return 0;
          }
          return prev - drop;
        });
      }, 500);
    }
    return () => clearInterval(dropRate);
  }, [hajiPhase]);

  const handleHajiClick = () => {
    if (hajiPhase !== "spam") return;
    const newClicks = hajiClicks + 1;
    setHajiClicks(newClicks);
    if (newClicks >= 35) {
      setHajiPhase("result");
      setHajiIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-base tracking-normal text-white font-sans selection:bg-neon selection:text-black p-4 md:p-8 flex flex-col gap-6 overflow-x-hidden">
      {/* HEADER & TABS */}
      <header className="flex flex-col border-b border-brutalist pb-4 gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Utility Tool Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-display tracking-tight uppercase leading-none mt-1">
              BRUTAL<span className="text-zinc-600">.TOOLS</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2">
            <button
              onClick={() => setActiveTab("split")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "split" ? "bg-neon text-black border-neon" : "bg-transparent text-zinc-400 border-brutalist hover:border-zinc-500 hover:text-white"}`}
              data-tooltip="Buka Split Bill"
            >
              SPLIT.BILL
            </button>
            <button
              onClick={() => setActiveTab("cuan")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "cuan" ? "bg-neon text-black border-neon" : "bg-transparent text-zinc-400 border-brutalist hover:border-zinc-500 hover:text-white"}`}
              data-tooltip="Buka Info Cuan"
            >
              INFO.CUAN
            </button>
            <button
              onClick={() => setActiveTab("haji")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "haji" ? "bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-red-500 hover:text-red-500"}`}
              data-tooltip="Buka War Haji"
            >
              WAR.HAJI
            </button>
            <button
              onClick={() => setActiveTab("iqtibas")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "iqtibas" ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-white hover:text-white"}`}
              data-tooltip="Buka Iqtibas"
            >
              IQTIBAS
            </button>
            <button
              onClick={() => setActiveTab("storyframe")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "storyframe" ? "bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-cyan-500 hover:text-cyan-500"}`}
              data-tooltip="Buka Story Frame"
            >
              STORY.FRAME
            </button>
            <button
              onClick={() => setActiveTab("paradox")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "paradox" ? "bg-purple-600 text-white border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-purple-500 hover:text-purple-500"}`}
              data-tooltip="Buka Inner Paradox"
            >
              INNER.PARADOX
            </button>
            <button
              onClick={() => setActiveTab("animasi")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "animasi" ? "bg-pink-500 text-black border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-pink-500 hover:text-pink-500"}`}
              data-tooltip="Buka Animasi AI"
            >
              ANIMASI.AI
            </button>
            <button
              onClick={() => setActiveTab("commercial")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "commercial" ? "bg-rose-500 text-black border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-rose-500 hover:text-rose-500"}`}
              data-tooltip="Buka Commercial"
            >
              COMMERCIAL
            </button>
            <button
              onClick={() => setActiveTab("elementor")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "elementor" ? "bg-blue-500 text-black border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-blue-500 hover:text-blue-500"}`}
              data-tooltip="Buka Elementor.ku"
            >
              ELEMENTOR.KU
            </button>
            <button
              onClick={() => setActiveTab("canva")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "canva" ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-emerald-500 hover:text-emerald-500"}`}
              data-tooltip="Buka Canva.pro"
            >
              CANVA.PRO
            </button>
            <button
              onClick={() => setActiveTab("jualagi")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "jualagi" ? "bg-orange-500 text-black border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-orange-500 hover:text-orange-500"}`}
              data-tooltip="Buka Jualagi 6.0"
            >
              JUALAGI.6.0
            </button>
            <button
              onClick={() => setActiveTab("magnet")}
              className={`tooltip-wrap flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-sm md:text-xl transition-colors border ${activeTab === "magnet" ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "bg-transparent text-zinc-400 border-brutalist hover:border-yellow-400 hover:text-yellow-400"}`}
              data-tooltip="Buka Magnet Uang"
            >
              MAGNET UANG
            </button>
          </div>
        </div>
      </header>

      {/* =========================================
             RENDER SPLIT BILL
          ========================================= */}
      {activeTab === "split" && (
        <main className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left Column: Input Sections */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Section 1: People */}
            <section className="bg-zinc-900 border border-brutalist p-6 flex flex-col gap-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-neon flex items-center gap-2">
                <Users className="w-4 h-4" /> 1. Tambah Pasukan
              </h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {people.map((p) => (
                  <motion.div
                    layout
                    key={p.id}
                    className="flex items-center gap-2 bg-black border border-brutalist px-3 py-1.5 group"
                  >
                    <span className="text-sm font-bold uppercase">
                      {p.name}
                    </span>
                    <button
                      onClick={() => removePerson(p.id)}
                      className="text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPerson()}
                  placeholder="Nama teman..."
                  className="tooltip-wrap flex-1 bg-black border border-brutalist px-4 py-3 placeholder-zinc-600 text-white font-mono outline-none focus:border-neon transition-colors"
                  data-tooltip="Tekan enter untuk tambah orang"
                />
                <button
                  onClick={addPerson}
                  className="bg-white text-black px-6 py-3 font-bold uppercase hover:bg-neon hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </section>

            {/* Section 2: Items */}
            <section className="bg-zinc-900 border border-brutalist p-6 flex flex-col gap-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-neon flex items-center gap-2">
                <Receipt className="w-4 h-4" /> 2. Masukkan Pesanan
              </h2>

              {/* Display Added Items */}
              {items.length > 0 && (
                <div className="flex flex-col gap-2 mb-4 border-b border-zinc-800 pb-4">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                    Daftar Pesanan:
                  </span>
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        key={item.id}
                        className="flex justify-between items-center bg-black border border-brutalist p-3 border-l-2 border-l-neon"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold uppercase text-sm">
                            {item.name}{" "}
                            <span className="font-mono text-zinc-400 font-normal normal-case ml-2">
                              {formatCurrency(item.price)}
                            </span>
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            Dimakan oleh:{" "}
                            {item.sharedBy
                              .map(
                                (id) => people.find((p) => p.id === id)?.name,
                              )
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-600 hover:text-red-500 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Add Item Form */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Nama menu (cth: Nasi Goreng)"
                    className="tooltip-wrap sm:col-span-2 bg-black border border-brutalist px-4 py-3 placeholder-zinc-600 text-white font-mono outline-none focus:border-neon transition-colors"
                    data-tooltip="Bisa makanan / minuman"
                  />
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="Harga (cth: 25000)"
                    className="tooltip-wrap bg-black border border-brutalist px-4 py-3 placeholder-zinc-600 text-white font-mono outline-none focus:border-neon transition-colors"
                    data-tooltip="Harga sebelum pajak"
                  />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                    Siapa yang makan/minum ini? (Klik untuk pilih)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {people.map((p) => {
                      const isSelected = newItemSharedBy.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggleItemShare(p.id)}
                          className={`px-3 py-2 border font-bold uppercase text-xs transition-colors flex items-center gap-1
                            ${isSelected ? "bg-neon/10 border-neon text-neon" : "bg-black border-brutalist text-zinc-500 hover:text-white"}`}
                        >
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={addItem}
                  disabled={
                    !newItemName ||
                    !newItemPrice ||
                    newItemSharedBy.length === 0
                  }
                  className="bg-neon text-black px-6 py-4 mt-2 font-display text-xl uppercase hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex items-center justify-center gap-2"
                >
                  MASUKKAN KE BON <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </section>

            {/* Section 3: Fees */}
            <section className="bg-zinc-900 border border-brutalist p-6 flex flex-col gap-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-neon flex items-center gap-2">
                <Percent className="w-4 h-4" /> 3. Biaya Tambahan (%)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                    Pajak / Tax
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={taxPercent}
                      onChange={(e) =>
                        setTaxPercent(parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-black border border-brutalist px-4 py-3 placeholder-zinc-600 text-white font-mono outline-none focus:border-neon transition-colors pr-10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      %
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                    Layanan / Service
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={servicePercent}
                      onChange={(e) =>
                        setServicePercent(parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-black border border-brutalist px-4 py-3 placeholder-zinc-600 text-white font-mono outline-none focus:border-neon transition-colors pr-10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Result / Summary */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-zinc-900 border border-brutalist flex flex-col h-full overflow-hidden relative">
              <div className="p-6 border-b border-brutalist flex justify-between items-center bg-black">
                <h2 className="text-xl font-display uppercase tracking-tight">
                  HASIL SPLIT
                </h2>
                <button
                  onClick={handleShareSplit}
                  className="tooltip-wrap flex items-center gap-2 border border-brutalist bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:border-neon hover:text-neon transition-colors z-20 cursor-pointer text-white"
                  data-tooltip="Salin teks tagihan"
                >
                  {copiedSplit ? (
                    <CheckCheck className="w-3 h-3 text-neon" />
                  ) : (
                    <Share2 className="w-3 h-3" />
                  )}
                  {copiedSplit ? (
                    <span className="text-neon">COPIED</span>
                  ) : (
                    "SHARE"
                  )}
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-4 relative z-10 overflow-y-auto">
                {personTotals.length === 0 || subtotal === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 font-mono text-xs uppercase text-center gap-2">
                    <Receipt className="w-10 h-10 opacity-20" />
                    Belum ada pesanan masukkan dari kolom sebelah kiri.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {personTotals
                      .filter((p) => p.total > 0)
                      .map((p) => {
                        const isPaid = payments[p.id];
                        return (
                          <div
                            key={p.id}
                            className={`bg-black border p-4 flex flex-col gap-2 group transition-colors ${isPaid ? "border-neon/50" : "border-brutalist hover:border-zinc-500"}`}
                          >
                            <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
                              <span
                                className={`font-display text-xl uppercase transition-colors ${isPaid ? "text-neon opacity-70 line-through" : "group-hover:text-neon"}`}
                              >
                                {p.name}
                              </span>
                              <span
                                className={`font-bold text-lg ${isPaid ? "text-neon opacity-70" : "text-white"}`}
                              >
                                {formatCurrency(p.total)}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center text-[10px] uppercase font-mono mt-1 gap-2">
                              <div className="flex flex-wrap gap-x-3 text-zinc-500">
                                <span>Sub: {formatCurrency(p.subtotal)}</span>
                                <span>
                                  Tax+Srv: {formatCurrency(p.taxService)}
                                </span>
                              </div>
                              <button
                                onClick={() => togglePayment(p.id)}
                                className={`px-3 py-1.5 font-bold tracking-widest border transition-colors cursor-pointer ${isPaid ? "bg-neon/20 border-neon text-neon" : "bg-transparent border-zinc-600 text-zinc-500 hover:text-white"} self-start sm:self-auto`}
                              >
                                {isPaid ? "PAID" : "UNPAID"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Grand Total Footer */}
              <div className="bg-neon text-black p-6 border-t border-neon flex flex-col relative z-10">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
                  <span>Sub / Tax / Srv</span>
                  <span>
                    {formatCurrency(subtotal)} /{" "}
                    {formatCurrency(totalTaxService)}
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-black/20 pt-4 mb-4">
                  <span className="font-display text-2xl uppercase tracking-tighter">
                    GRAND TOTAL
                  </span>
                  <span className="font-display text-3xl tracking-tighter">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-black/20 pt-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                      Terkumpul (Paid)
                    </span>
                    <span className="font-mono font-bold text-lg">
                      {formatCurrency(amountCollected)}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 text-red-700">
                      Kekurangan (Unpaid)
                    </span>
                    <span className="font-mono font-bold text-lg text-red-700">
                      {formatCurrency(amountRemaining)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =========================================
             RENDER INFO CUAN
          ========================================= */}
      {activeTab === "cuan" && (
        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6 pt-4">
          <div className="flex items-center gap-3 bg-neon/10 border border-neon/30 text-neon p-4 font-mono text-sm uppercase">
            <Sparkles className="w-5 h-5 flex-shrink-0" /> Generative AI Engine
            Active
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Input Parameters
            </label>
            <div className="bg-zinc-900 border border-brutalist flex flex-col md:flex-row focus-within:border-neon transition-colors">
              <div className="flex-1 flex items-center px-4">
                <span className="text-neon font-mono mr-3 text-lg">{">"}</span>
                <input
                  type="text"
                  value={cuanInput}
                  onChange={(e) => {
                    setCuanInput(e.target.value);
                    if (cuanError) setCuanError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && getCuanInfo()}
                  placeholder="Cth: Modal 100 ribu, skill ngedit video..."
                  className="tooltip-wrap w-full py-5 bg-transparent outline-none text-white font-mono placeholder-zinc-600"
                  disabled={cuanLoading}
                  data-tooltip="Masukkan modal atau skill Anda"
                />
              </div>
              <button
                onClick={getCuanInfo}
                disabled={cuanLoading}
                className="tooltip-wrap bg-neon text-black px-10 py-5 font-display text-2xl uppercase hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-brutalist"
                data-tooltip="Generate info cuan"
              >
                {cuanLoading ? (
                  <>PROCESSING...</>
                ) : (
                  <>
                    EXECUTE <Sparkles className="w-5 h-5 stroke-[3]" />
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {cuanError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/20 border border-red-500 text-red-500 p-4 font-mono text-sm uppercase"
              >
                [ERROR] {cuanError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {cuanLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center border border-brutalist bg-zinc-900/50 backdrop-blur-sm p-12"
                >
                  <div className="flex items-center gap-4 text-neon font-display text-3xl md:text-4xl uppercase tracking-widest animate-pulse">
                    <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" />{" "}
                    Analyzing Market
                  </div>
                  <p className="mt-4 font-mono text-zinc-500 text-sm uppercase">
                    Calculating profit vectors...
                  </p>
                </motion.div>
              )}

              {cuanIdea && !cuanLoading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col gap-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 bg-zinc-900 border border-brutalist p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-black bg-neon px-2 py-1">
                              Success
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              ID:{" "}
                              {(Math.random() * 10000)
                                .toFixed(0)
                                .padStart(4, "0")}
                            </span>
                          </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase tracking-tight leading-none mb-6">
                          {cuanIdea.title}
                        </h2>
                        <div className="mt-auto pt-6 border-t border-zinc-800">
                          <span className="text-[10px] md:text-xs uppercase text-zinc-500 font-bold block mb-2 tracking-widest">
                            Strategy Overview
                          </span>
                          <p className="text-base md:text-lg text-zinc-300 max-w-2xl">
                            {cuanIdea.description}
                          </p>
                        </div>
                      </div>
                      <DollarSign className="absolute -bottom-10 -right-10 w-64 h-64 text-zinc-800/20 -rotate-12 hidden md:block" />
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-6">
                      <div className="flex-1 bg-zinc-900 border border-brutalist p-6 flex flex-col justify-center">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">
                          Required Capital
                        </span>
                        <span className="text-3xl font-display text-white">
                          {cuanIdea.estimatedCapital}
                        </span>
                      </div>
                      <div className="flex-1 bg-neon border border-neon p-6 flex flex-col justify-center text-black shadow-[0_0_30px_rgba(57,255,20,0.2)]">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] uppercase font-bold tracking-widest">
                            Est. Return
                          </span>
                          <TrendingUp className="w-5 h-5 stroke-[3]" />
                        </div>
                        <span className="text-3xl font-display tracking-tight leading-none">
                          {cuanIdea.potentialProfit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-brutalist p-6 md:p-8">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" /> Execution Pipeline
                    </h3>
                    <ul className="space-y-0">
                      {cuanIdea.steps.map((step, idx) => (
                        <li
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 border-b border-zinc-800 py-6 last:border-0 last:pb-0 relative group"
                        >
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-black border border-zinc-700 text-neon font-display text-xl sm:text-2xl flex items-center justify-center group-hover:bg-neon group-hover:text-black group-hover:border-neon transition-colors">
                            {idx + 1}
                          </div>
                          <p className="text-zinc-300 pt-1 sm:pt-2 text-base sm:text-lg font-medium">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      )}

      {/* =========================================
             RENDER WAR HAJI
          ========================================= */}
      {activeTab === "haji" && (
        <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4">
          <div className="bg-red-600 text-white border-y border-white py-2 overflow-hidden flex whitespace-nowrap mt-[-10px] mb-2">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="font-display text-xl md:text-2xl uppercase tracking-widest flex gap-8 whitespace-nowrap"
            >
              <span>✦ BERKHIDMAT UNTUK TAMU-TAMU ALLAH ✦</span>
              <span>✦ BERKHIDMAT UNTUK TAMU-TAMU ALLAH ✦</span>
              <span>✦ BERKHIDMAT UNTUK TAMU-TAMU ALLAH ✦</span>
              <span>✦ BERKHIDMAT UNTUK TAMU-TAMU ALLAH ✦</span>
              <span>✦ BERKHIDMAT UNTUK TAMU-TAMU ALLAH ✦</span>
              <span>✦ BERKHIDMAT UNTUK TAMU-TAMU ALLAH ✦</span>
            </motion.div>
          </div>

          {hajiPhase === "idle" && (
            <div className="bg-zinc-900 border border-brutalist p-10 flex flex-col items-center justify-center text-center gap-6 min-h-[500px]">
              <AlertTriangle className="w-20 h-20 text-red-500 animate-pulse" />
              <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter text-white">
                SIMULASI
                <br />
                <span className="text-red-500 text-6xl md:text-8xl">
                  WAR TIKET HAJI
                </span>
              </h2>
              <div className="bg-red-900/30 border border-red-500 text-white p-4 font-mono text-sm max-w-md uppercase tracking-wider">
                [WARNING]: Server Kemenag VIRTUAL. Kuota sangat terbatas.
                Siapkan kecepatan jari dan mental Anda!
              </div>
              <button
                onClick={() => {
                  setHajiPhase("countdown");
                  setHajiTime(3);
                }}
                className="mt-8 px-12 py-6 bg-red-600 text-white font-display text-3xl uppercase hover:bg-white hover:text-red-600 transition-colors border-2 border-red-600 brutal-shadow cursor-pointer"
              >
                ENTER WAITING ROOM
              </button>
            </div>
          )}

          {hajiPhase === "countdown" && (
            <div className="flex flex-col items-center justify-center py-32 gap-6 min-h-[500px]">
              <span className="font-mono text-zinc-500 uppercase tracking-widest text-lg animate-pulse">
                Menghubungkan ke Pusat...
              </span>
              <motion.span
                key={hajiTime}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[12rem] font-display text-red-500 leading-none"
              >
                {hajiTime}
              </motion.span>
            </div>
          )}

          {hajiPhase === "queue" && (
            <div className="bg-zinc-900 border border-brutalist p-10 flex flex-col items-center justify-center text-center gap-8 min-h-[500px]">
              <Loader2 className="w-16 h-16 text-neon animate-spin" />
              <div className="flex flex-col pb-4 border-b border-zinc-800">
                <h3 className="font-bold font-mono text-neon uppercase tracking-widest">
                  ANDA BERADA DI ANTRIAN PUSAT
                </h3>
                <span className="font-mono text-zinc-500 text-xs mt-2 uppercase">
                  Estimasi Waktu: Tergantung Amal
                </span>
              </div>
              <span className="text-7xl md:text-9xl font-display text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {hajiQueue.toLocaleString("id-ID")}
              </span>
              <p className="bg-red-900 text-white font-bold uppercase text-sm px-6 py-2 animate-pulse mt-4">
                JANGAN REFRESH HALAMAN INI!
              </p>
            </div>
          )}

          {hajiPhase === "spam" && (
            <motion.div
              animate={{ x: [-3, 3, -3, 3, 0] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="bg-zinc-900 border-2 border-red-600 p-6 md:p-12 flex flex-col items-center text-center gap-8 relative overflow-hidden min-h-[500px]"
            >
              <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />

              <div className="flex w-full justify-between items-center mb-4 relative z-10 border-b border-red-900/50 pb-6">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] md:text-xs uppercase font-bold text-zinc-500 tracking-widest">
                    WAKTU TERSISA
                  </span>
                  <span className="font-display text-5xl md:text-6xl text-red-500 tracking-tighter">
                    {hajiTime}s
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] md:text-xs uppercase font-bold text-zinc-500 tracking-widest">
                    TARGET KLIK / KUOTA
                  </span>
                  <span className="font-display text-5xl md:text-6xl text-neon tracking-tighter">
                    {hajiClicks} / 35
                  </span>
                </div>
              </div>

              <button
                onClick={handleHajiClick}
                className="w-full max-w-sm aspect-square rounded-full bg-red-600 hover:bg-red-500 active:bg-white active:scale-95 transition-all outline-none flex flex-col items-center justify-center gap-2 relative z-10 border-8 border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.6)] cursor-crosshair group"
              >
                <Target className="w-20 h-20 text-white group-active:text-red-600 group-active:scale-110 transition-transform" />
                <span className="font-display text-4xl md:text-5xl text-white group-active:text-red-600 tracking-tighter">
                  KLIK DISINI
                </span>
              </button>

              <div className="bg-black/50 px-6 py-3 border border-red-800 relative z-10 w-full mt-4">
                <p className="font-mono text-white text-sm md:text-base uppercase tracking-widest animate-pulse">
                  HANCURKAN TOMBOL INI SEBELUM WAKTU HABIS!
                </p>
              </div>
            </motion.div>
          )}

          {hajiPhase === "result" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-10 flex flex-col items-center text-center gap-8 border min-h-[500px] justify-center ${hajiIsSuccess ? "bg-neon/10 border-neon" : "bg-red-900/20 border-red-600"}`}
            >
              {hajiIsSuccess ? (
                <>
                  <div className="bg-neon text-black p-6 rounded-full shadow-[0_0_50px_rgba(57,255,20,0.5)]">
                    <Trophy className="w-20 h-20" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-5xl md:text-7xl font-display uppercase text-white tracking-tighter">
                      ALHAMDULILLAH!
                    </h2>
                    <p className="font-mono text-neon font-bold tracking-widest text-lg">
                      ANDA BERHASIL MENDAPATKAN PORSI HAJI BERANGKAT TAHUN INI!
                    </p>
                    <p className="font-display text-white text-2xl uppercase tracking-widest mt-4">
                      "BERKHIDMAT UNTUK TAMU-TAMU ALLAH"
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-red-600 text-white p-6 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                    <ServerCrash className="w-20 h-20" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-5xl md:text-7xl font-display uppercase text-white tracking-tighter">
                      GAGAL WAR!
                    </h2>
                    <p className="font-mono text-zinc-300">
                      Server meledak atau kuota habis direbut orang lain.
                    </p>
                    <p className="font-mono text-red-400 font-bold mt-2">
                      Score Klik Anda: {hajiClicks}/35 (Jari kurang senam)
                    </p>
                  </div>
                </>
              )}
              <button
                onClick={() => {
                  setHajiPhase("idle");
                  setHajiClicks(0);
                }}
                className="mt-8 px-10 py-5 bg-black text-white font-display text-2xl uppercase hover:bg-white hover:text-black border border-white transition-colors tracking-widest"
              >
                {hajiIsSuccess ? "KEMBALI KE LOBI" : "COBA LAGI TAHUN DEPAN"}
              </button>
            </motion.div>
          )}
        </main>
      )}

      {/* =========================================
             RENDER IQTIBAS
          ========================================= */}
      {activeTab === "iqtibas" && (
        <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4 pb-12">
          {/* IQTIBAS GENERATOR */}
          <div className="flex items-center gap-3 bg-white/10 border border-white/30 text-white p-4 font-mono text-sm uppercase">
            <Sparkles className="w-5 h-5 flex-shrink-0" /> AI Sastra Generator
            Active
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Input Situasi Kamu (Contoh: Menghadapi teman yang mengkhianati)
            </label>
            <div className="bg-zinc-900 border border-brutalist flex flex-col md:flex-row focus-within:border-white transition-colors">
              <div className="flex-1 flex items-center px-4">
                <span className="text-white font-mono mr-3 text-lg">{">"}</span>
                <input
                  type="text"
                  value={iqtibasInput}
                  onChange={(e) => {
                    setIqtibasInput(e.target.value);
                    if (iqtibasError) setIqtibasError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && getIqtibasInfo()}
                  placeholder="Ceritain kondisinya..."
                  className="tooltip-wrap w-full py-5 bg-transparent outline-none text-white font-mono placeholder-zinc-600"
                  disabled={iqtibasLoading}
                  data-tooltip="Masukkan kondisi situasi kamu"
                />
              </div>
              <button
                onClick={getIqtibasInfo}
                disabled={iqtibasLoading}
                className="tooltip-wrap bg-white text-black px-10 py-5 font-display text-xl md:text-2xl uppercase hover:bg-neon hover:text-black hover:border-l-neon disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-brutalist cursor-pointer"
                data-tooltip="Generate kutipan hikmah"
              >
                {iqtibasLoading ? (
                  <>MERANGKAI...</>
                ) : (
                  <>
                    GENERATE <Quote className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {iqtibasError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/20 border border-red-500 text-red-500 p-4 font-mono text-sm uppercase"
              >
                [ERROR] {iqtibasError}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {iqtibasLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center border border-brutalist bg-black p-12 my-4"
              >
                <div className="flex items-center gap-4 text-white font-display text-2xl uppercase tracking-widest animate-pulse">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" />{" "}
                  MENCARI WAHYU YANG TEPAT...
                </div>
              </motion.div>
            )}

            {iqtibasIdea && !iqtibasLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black border border-white p-6 md:p-8 flex flex-col gap-6 my-4 shadow-[10px_10px_0_0_#fff]"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase text-zinc-400 border border-zinc-600 px-2 py-1 font-mono">
                    Hasil Iqtibas
                  </span>
                  <button
                    onClick={handleShareIqtibas}
                    className="tooltip-wrap flex items-center gap-2 bg-white text-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-neon hover:text-black transition-colors z-20 cursor-pointer"
                    data-tooltip="Bagikan ke sosmed"
                  >
                    {copiedIqtibasIdea ? (
                      <CheckCheck className="w-4 h-4" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                    {copiedIqtibasIdea ? "COPIED" : "SHARE"}
                  </button>
                </div>

                <div className="font-display text-2xl md:text-3xl text-white leading-relaxed border-l-4 border-neon pl-6">
                  "{iqtibasIdea.quote}"
                </div>

                <div className="bg-zinc-900 p-4 border border-zinc-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-neon text-xs font-mono font-bold uppercase tracking-widest">
                    <BookOpen className="w-4 h-4" /> Referensi Sastra
                  </div>
                  <div className="text-zinc-300 font-mono text-sm mt-2">
                    <b>Sumber:</b> {iqtibasIdea.source}
                  </div>
                  <div className="text-zinc-300 font-mono text-sm leading-relaxed mt-1">
                    <b>Makna:</b> {iqtibasIdea.explanation}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* IQTIBAS STATIC ARTICLE */}
          <div className="bg-zinc-900 border border-brutalist p-8 md:p-12 relative overflow-hidden flex flex-col gap-8 mt-8">
            <BookOpen className="absolute -top-10 -right-10 w-64 h-64 text-zinc-800/10 -rotate-12 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col gap-2 relative z-10 border-b border-brutalist pb-6">
              <div className="flex items-center gap-3 text-neon font-mono text-sm uppercase font-bold tracking-widest mb-2">
                <Quote className="w-5 h-5" /> Sastra Arab & Balaghah
              </div>
              <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter text-white leading-none">
                IQTIBAS <br />
                <span className="text-3xl md:text-5xl text-zinc-500">
                  Seni Meminjam Redaksi Wahyu
                </span>
              </h2>
            </div>

            {/* Content 1 */}
            <div className="flex flex-col gap-4 font-mono text-zinc-300 text-sm md:text-base leading-relaxed relative z-10">
              <p className="text-white font-bold uppercase tracking-widest border-l-2 border-neon pl-4 text-xs">
                Apa itu Iqtibas?
              </p>
              <p>
                Ini adalah teknik dalam sastra Arab (balaghah) yang secara
                bahasa berarti "mengambil api" atau "menyulut cahaya". Dalam
                konteks literasi dan bahasa, iqtibas adalah gaya bahasa di mana
                seseorang menyisipkan potongan ayat Al-Qur'an atau Hadis ke
                dalam suatu kalimat, syi'ir (puisi), atau prosa tanpa
                menyebutkan bahwa itu adalah kutipan.
              </p>
              <p>
                Sederhananya, ini adalah seni <b>"meminjam" redaksi wahyu</b>{" "}
                untuk memperindah atau memperkuat pesan dalam percakapan atau
                tulisan manusia.
              </p>
              <p>
                Berbeda dengan kutipan biasa atau referensi ilmiah, iqtibas
                memiliki aturan main tersendiri. Pengguna gaya ini tidak perlu
                mengatakan <i>"Sebagaimana firman Allah..."</i> atau{" "}
                <i>"Nabi bersabda..."</i>. Kutipan tersebut langsung melebur ke
                dalam kalimat.
              </p>

              <div className="bg-white text-black p-6 font-display text-lg md:text-xl uppercase tracking-wider mt-4 shadow-[5px_5px_0_0_#39FF14]">
                "Tenang saja, badai pasti berlalu, karena 'inna ma'al 'usri
                yusran.' Sing tenang bro, 'inna Allah ma'as_shobirin' pokoke.
                Oke?"
              </div>
            </div>

            {/* Content 2: Jenis */}
            <div className="flex flex-col gap-4 mt-4 relative z-10">
              <p className="text-white font-mono font-bold uppercase tracking-widest border-l-2 border-neon pl-4 text-xs mb-2">
                Secara umum, iqtibas dibagi menjadi tiga:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black border border-brutalist p-6 flex flex-col gap-2 transition-colors hover:border-neon">
                  <span className="text-neon font-display tracking-widest uppercase text-xl">
                    1. Al-Maqbul
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">
                    (Diterima)
                  </span>
                  <p className="text-zinc-300 font-mono text-sm mt-2">
                    Digunakan untuk khutbah, nasihat, atau memuji
                    seseorang/sesuatu yang baik.
                  </p>
                </div>
                <div className="bg-black border border-brutalist p-6 flex flex-col gap-2 transition-colors hover:border-yellow-500">
                  <span className="text-yellow-500 font-display tracking-widest uppercase text-xl">
                    2. Al-Mubah
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">
                    (Diperbolehkan)
                  </span>
                  <p className="text-zinc-300 font-mono text-sm mt-2">
                    Digunakan dalam tulisan sastra, surat-menyurat, atau candaan
                    yang sopan dan tidak menghina agama.
                  </p>
                </div>
                <div className="bg-black border border-brutalist p-6 flex flex-col gap-2 transition-colors border-red-900/50 hover:border-red-500">
                  <span className="text-red-500 font-display tracking-widest uppercase text-xl">
                    3. Al-Mardud
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">
                    (Ditolak/Dilarang)
                  </span>
                  <p className="text-red-400 font-mono text-sm mt-2">
                    Menggunakan ayat suci untuk hal-hal yang buruk, maksiat,
                    atau bahan olokan yang merendahkan kesucian ayat tersebut.
                  </p>
                </div>
              </div>
              <p className="font-mono text-zinc-400 text-sm mt-4 leading-relaxed p-4 bg-zinc-800/50">
                Iqtibas bukan sekadar pamer hafalan, melainkan cara agar ucapan
                kita memiliki bobot emosional dan estetika yang tinggi. Dalam
                tradisi masyarakat, menggunakan iqtibas menunjukkan bahwa
                pembicaranya memiliki kedalaman literasi agama sekaligus
                kemahiran dalam mengolah kata.
              </p>
            </div>

            {/* Content 3: Story */}
            <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-brutalist relative z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 px-4 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                /// TRADISI SPIRITUAL ///
              </div>
              <p className="font-mono text-zinc-300 text-sm leading-relaxed">
                Dalam tradisi spiritual (tasawuf), iqtibas dibawa ke titik makna
                spiritual yang lebih dalam. Seperti dalam kisah terkenal ketika
                sufi agung <b>Dzun Nun</b> berbicara dengan seorang nenek yang
                selalu menjawab hanya dengan kalimat dari Al-Quran. Kisah ini
                adalah salah satu anekdot tasawuf yang sangat populer,
                menggambarkan tingkatan wara (kehati-hatian) dan kecintaan par
                excellence seseorang kepada Al-Qur'an.
              </p>
              <p className="font-mono text-zinc-300 text-sm leading-relaxed mb-4">
                Syahdan, saat sedang menempuh perjalanan, Dzun Nun melihat
                seorang wanita tua yang sendirian di tengah padang pasir. Karena
                merasa khawatir, beliau mencoba menyapa dan bertanya, namun
                setiap jawaban yang keluar dari mulut nenek tersebut adalah
                potongan ayat Al-Qur'an.
              </p>

              {/* UI Dialogue Box */}
              <div className="bg-black border border-zinc-700 flex flex-col p-4 md:p-8 gap-8">
                {/* D1 */}
                <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6">
                  <div className="flex gap-4 items-start">
                    <span className="bg-white text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Dzun Nun
                    </span>
                    <span className="text-white font-mono text-sm md:text-base leading-relaxed">
                      "Assalamualaikum, nenek sedang apa di sini sendirian?"
                    </span>
                  </div>
                  <div className="flex gap-4 items-start border-l-2 border-neon pl-4 ml-8">
                    <span className="bg-neon text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Nenek
                    </span>
                    <div className="flex flex-col gap-2">
                      <span className="text-neon font-display text-xl md:text-2xl tracking-widest uppercase leading-snug">
                        "Dan orang-orang yang bertakwa kepada Tuhannya diantar
                        ke dalam surga secara berombongan."
                      </span>
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                        (QS. Az-Zumar: 73)
                      </span>
                      <span className="text-zinc-400 font-mono text-xs mt-1 border-t border-neon/20 pt-2 inline-block">
                        <b>Maksudnya:</b> Beliau sedang dalam perjalanan
                        spiritual bersama rombongan yang tak kasat mata.
                      </span>
                    </div>
                  </div>
                </div>

                {/* D2 */}
                <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6">
                  <div className="flex gap-4 items-start">
                    <span className="bg-white text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Dzun Nun
                    </span>
                    <span className="text-white font-mono text-sm md:text-base leading-relaxed">
                      "Lalu di mana rombongan itu sekarang?"
                    </span>
                  </div>
                  <div className="flex gap-4 items-start border-l-2 border-neon pl-4 ml-8">
                    <span className="bg-neon text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Nenek
                    </span>
                    <div className="flex flex-col gap-2">
                      <span className="text-neon font-display text-xl md:text-2xl tracking-widest uppercase leading-snug">
                        "Dan Kami jadikan di hadapan mereka sekat dan di
                        belakang mereka sekat..."
                      </span>
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                        (QS. Yasin: 9)
                      </span>
                      <span className="text-zinc-400 font-mono text-xs mt-1 border-t border-neon/20 pt-2 inline-block">
                        <b>Maksudnya:</b> Rombongannya sudah jauh di depan atau
                        terhalang dari pandangan lahir karena goib.
                      </span>
                    </div>
                  </div>
                </div>

                {/* D3 */}
                <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6">
                  <div className="flex gap-4 items-start">
                    <span className="bg-white text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Dzun Nun
                    </span>
                    <span className="text-white font-mono text-sm md:text-base leading-relaxed">
                      "Nenek ingin ke mana sebenarnya?"
                    </span>
                  </div>
                  <div className="flex gap-4 items-start border-l-2 border-neon pl-4 ml-8">
                    <span className="bg-neon text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Nenek
                    </span>
                    <div className="flex flex-col gap-2">
                      <span className="text-neon font-display text-xl md:text-2xl tracking-widest uppercase leading-snug">
                        "Dan bagi Allah subhanahu wa ta'ala, wajib atas manusia
                        melaksanakan ibadah haji ke Baitullah..."
                      </span>
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                        (QS. Ali Imran: 97)
                      </span>
                      <span className="text-zinc-400 font-mono text-xs mt-1 border-t border-neon/20 pt-2 inline-block">
                        <b>Maksudnya:</b> Beliau hendak menuju Makkah.
                      </span>
                    </div>
                  </div>
                </div>

                {/* D4 */}
                <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6">
                  <div className="flex gap-4 items-start">
                    <span className="bg-white text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Dzun Nun
                    </span>
                    <span className="text-white font-mono text-sm md:text-base leading-relaxed">
                      "Sudah berapa lama nenek di jalan?"
                    </span>
                  </div>
                  <div className="flex gap-4 items-start border-l-2 border-neon pl-4 ml-8">
                    <span className="bg-neon text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Nenek
                    </span>
                    <div className="flex flex-col gap-2">
                      <span className="text-neon font-display text-xl md:text-2xl tracking-widest uppercase leading-snug">
                        "Tiga malam dalam keadaan sehat."
                      </span>
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                        (QS. Maryam: 10)
                      </span>
                    </div>
                  </div>
                </div>

                {/* D5 */}
                <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6">
                  <div className="flex gap-4 items-start">
                    <span className="bg-white text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Dzun Nun
                    </span>
                    <span className="text-white font-mono text-sm md:text-base leading-relaxed">
                      "Nenek lapar? Mau saya beri makanan?"
                    </span>
                  </div>
                  <div className="flex gap-4 items-start border-l-2 border-neon pl-4 ml-8">
                    <span className="bg-neon text-black font-bold text-[10px] uppercase px-2 py-1 tracking-widest mt-1 min-w-[80px] text-center">
                      Nenek
                    </span>
                    <div className="flex flex-col gap-2">
                      <span className="text-neon font-display text-xl md:text-2xl tracking-widest uppercase leading-snug">
                        "Sempurnakanlah puasa itu sampai malam."
                      </span>
                      <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                        (QS. Al-Baqarah: 187)
                      </span>
                      <span className="text-zinc-400 font-mono text-xs mt-1 border-t border-neon/20 pt-2 inline-block">
                        <b>Maksudnya:</b> Beliau sedang berpuasa.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 p-6 border-l-4 border-white flex flex-col gap-4 mt-4">
                <p className="font-mono text-zinc-300 text-sm leading-relaxed">
                  Dzun Nun beberapa waktu kemudian bertanya kepada orang yang
                  mengenal nenek tersebut, terungkaplah bahwa nenek tersebut
                  sudah melakukan hal itu selama 40 tahun. Alasannya sederhana
                  namun dalam:{" "}
                  <b>
                    Beliau takut jika lidahnya mengucapkan kata-kata duniawi, ia
                    akan tergelincir dalam dosa atau kesalahan (lagha)
                  </b>
                  , sehingga ia memilih hanya berbicara dengan firman Allah yang
                  sudah pasti benar.
                </p>
                <p className="font-mono text-white text-sm leading-relaxed p-6 border border-zinc-500 bg-black shadow-[5px_5px_0_0_#fff]">
                  Nenek ini adalah contoh level tertinggi dalam penggunaan
                  teknik iqtibas. Beliau tidak hanya menyisipkan ayat, tapi
                  menjadikan ayat sebagai pengganti bahasa komunikasi harian.
                  <br />
                  <br />
                  <span className="text-neon tracking-wider font-bold block mt-2 pt-2 border-t border-zinc-800">
                    Kisah ini sering dipakai para ulama untuk menjelaskan bahwa
                    saking indahnya bahasa Al-Qur'an, ia bisa digunakan untuk
                    menjelaskan segala situasi hidup, mulai dari urusan lapar
                    sampai arah jalan.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* =========================================
             RENDER STORY FRAME
          ========================================= */}
      {activeTab === "storyframe" && (
        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6 pt-4 pb-12">
          <div className="flex items-center gap-3 bg-cyan-900/30 border border-cyan-500/50 text-cyan-400 p-4 font-mono text-sm uppercase">
            <Film className="w-5 h-5 flex-shrink-0" /> AI Storyboard Director
            Active
          </div>

          <div className="bg-black border border-cyan-500/30 p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Film className="w-32 h-32 text-cyan-500" />
            </div>
            <h3 className="font-display text-xl md:text-2xl text-cyan-500 uppercase tracking-widest relative z-10">
              Dengan StoryFrame AI:
            </h3>
            <ul className="flex flex-col gap-3 font-mono text-xs md:text-sm text-zinc-300 relative z-10">
              <li className="flex items-center gap-3">
                <span className="text-cyan-500 text-lg leading-none">▶</span>{" "}
                Ide lebih cepat diarahkan
              </li>
              <li className="flex items-center gap-3">
                <span className="text-cyan-500 text-lg leading-none">▶</span>{" "}
                Angle lebih mudah terbentuk
              </li>
              <li className="flex items-center gap-3">
                <span className="text-cyan-500 text-lg leading-none">▶</span>{" "}
                Scene lebih gampang disusun
              </li>
              <li className="flex items-center gap-3">
                <span className="text-cyan-500 text-lg leading-none">▶</span>{" "}
                Gambar visual bisa langsung dihasilkan di aplikasi
              </li>
              <li className="flex items-center gap-3">
                <span className="text-cyan-500 text-lg leading-none">▶</span>{" "}
                Voice-over bisa langsung dibuat di aplikasi
              </li>
              <li className="flex items-center gap-3 mt-2 text-white font-bold p-3 border border-cyan-500/50 bg-cyan-900/10">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Proses bikin
                konten video terasa lebih ringan dan lebih cepat
              </li>
            </ul>
          </div>

          {/* NICHE SELECTOR */}
          <div className="flex flex-col gap-4 bg-zinc-900/50 border border-zinc-800 p-6">
            <div className="flex flex-col pb-4 border-b border-zinc-800">
              <h3 className="font-display text-2xl uppercase tracking-widest text-cyan-400 text-center">
                Pilih Niche Studio
              </h3>
              <p className="font-mono text-zinc-400 text-sm text-center">
                Pilih kategori untuk memandu kecerdasan buatan menyusun narasi.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
              {STORYFRAME_NICHES.map((niche) => {
                const isSelected = storyFrameSelectedNiche === niche.title;
                const Icon = niche.icon;
                return (
                  <button
                    key={niche.id}
                    onClick={() => setStoryFrameSelectedNiche(niche.title)}
                    className={`flex flex-col py-6 px-4 items-center justify-center text-center gap-3 transition-colors border ${isSelected ? "bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "bg-black border-brutalist hover:border-cyan-500/50 hover:bg-zinc-900"}`}
                  >
                    <div
                      className={`p-4 rounded-full border ${isSelected ? "border-cyan-500 text-cyan-400 bg-cyan-500/10" : "border-zinc-700 text-zinc-500 bg-zinc-900"}`}
                    >
                      <Icon className="w-6 h-6 stroke-1" />
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <span
                        className={`font-display text-sm md:text-base uppercase tracking-wider ${isSelected ? "text-cyan-400" : "text-zinc-300"}`}
                      >
                        {niche.title}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500 mt-1 line-clamp-2 px-2">
                        {niche.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Input Ide Cerita/Konten You (Contoh: "Horor tentang HP yang gak
              bisa mati")
            </label>
            <div className="bg-zinc-900 border border-brutalist flex flex-col md:flex-row focus-within:border-cyan-500 transition-colors">
              <div className="flex-1 flex items-center px-4">
                <span className="text-cyan-500 font-mono mr-3 text-lg">
                  {">"}
                </span>
                <input
                  type="text"
                  value={storyFrameInput}
                  onChange={(e) => {
                    setStoryFrameInput(e.target.value);
                    if (storyFrameError) setStoryFrameError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && getStoryFrameInfo()}
                  placeholder="Ceritain idenya..."
                  className="tooltip-wrap w-full py-5 bg-transparent outline-none text-white font-mono placeholder-zinc-600"
                  disabled={storyFrameLoading}
                  data-tooltip="Ceritakan ide story frame kamu"
                />
              </div>
              <button
                onClick={getStoryFrameInfo}
                disabled={storyFrameLoading}
                className="tooltip-wrap bg-cyan-500 text-black px-10 py-5 font-display text-xl md:text-2xl uppercase hover:bg-white hover:text-black hover:border-l-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-brutalist cursor-pointer"
                data-tooltip="Direct story frame"
              >
                {storyFrameLoading ? (
                  <>DIRECTING...</>
                ) : (
                  <>
                    DIRECT <Camera className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {storyFrameError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/20 border border-red-500 text-red-500 p-4 font-mono text-sm uppercase"
              >
                [ERROR] {storyFrameError}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {storyFrameLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center border border-brutalist bg-black p-12 my-4"
              >
                <div className="flex items-center gap-4 text-cyan-500 font-display text-2xl uppercase tracking-widest animate-pulse">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" />{" "}
                  MERAIKIT ADEGAN...
                </div>
              </motion.div>
            )}

            {storyFrameIdea && !storyFrameLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col gap-8 my-4"
              >
                <div className="bg-black border border-cyan-500 p-6 md:p-8 flex flex-col gap-4 shadow-[10px_10px_0_0_#06b6d4]">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase text-cyan-500 border border-cyan-900 px-2 py-1 font-mono">
                      PROJECT INFO
                    </span>
                    <button
                      onClick={handleShareStoryFrame}
                      className="tooltip-wrap flex items-center gap-2 bg-cyan-500 text-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors z-20 cursor-pointer"
                      data-tooltip="Salin script story frame"
                    >
                      {copiedStoryFrame ? (
                        <CheckCheck className="w-4 h-4" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                      {copiedStoryFrame ? "COPIED" : "SHARE SCRIPT"}
                    </button>
                  </div>

                  <h2 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none mt-2">
                    {storyFrameIdea.title}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 border-t border-zinc-800 pt-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-3 h-3 text-cyan-500" /> NICHE
                        SELECTOR
                      </span>
                      <span className="font-mono text-white text-sm">
                        {storyFrameIdea.niche}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-cyan-500" /> ANGLE
                        GENERATOR
                      </span>
                      <span className="font-mono text-cyan-400 text-sm font-bold">
                        {storyFrameIdea.angle}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3 text-cyan-500" /> TARGET
                        AUDIENCE
                      </span>
                      <span className="font-mono text-white text-sm">
                        {storyFrameIdea.targetAudience}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FRAMES */}
                <div className="flex flex-col gap-6">
                  <h3 className="text-xl font-display uppercase tracking-widest text-zinc-400 border-b border-brutalist pb-2 flex items-center gap-2">
                    <Film className="w-5 h-5 text-cyan-500" /> SCENE BUILDER
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {storyFrameIdea.frames.map((frame, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-zinc-900 border border-brutalist flex flex-col xl:flex-row overflow-hidden group hover:border-cyan-500 transition-colors"
                      >
                        {/* Frame Number Side */}
                        <div className="bg-black border-b xl:border-b-0 xl:border-r border-brutalist w-full xl:w-24 flex xl:flex-col items-center justify-center p-4 gap-2">
                          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                            FRAME
                          </span>
                          <span className="text-4xl font-display text-cyan-500">
                            {frame.frameNumber}
                          </span>
                        </div>

                        {/* Content Side */}
                        <div className="flex-1 p-6 flex flex-col gap-6">
                          {/* Row 1: Visual & Motion */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* VISUAL PROMPT & GENERATOR */}
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] text-cyan-500 font-bold font-mono uppercase tracking-widest">
                                  <ImageIcon className="w-3 h-3" /> Visual
                                  Prompt Workflow
                                </div>
                                {!frame.generatedImageBase64 && (
                                  <button
                                    onClick={() =>
                                      generateImageForFrame(
                                        idx,
                                        frame.visualPrompt,
                                      )
                                    }
                                    disabled={frame.isGeneratingImage}
                                    className="bg-white text-black text-[10px] px-2 py-1 uppercase font-bold tracking-widest border border-white hover:bg-cyan-500 hover:border-cyan-500 disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
                                  >
                                    {frame.isGeneratingImage ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Sparkles className="w-3 h-3" />
                                    )}
                                    GENERATE IMAGE
                                  </button>
                                )}
                              </div>

                              <p className="font-mono text-white text-sm leading-relaxed border-l-2 border-zinc-700 pl-3">
                                {frame.visualPrompt}
                              </p>

                              {frame.generatedImageBase64 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="mt-2 border border-cyan-500 p-1 relative"
                                >
                                  <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[8px] font-bold px-1 m-1 uppercase">
                                    Generated Visual
                                  </div>
                                  <img
                                    src={`data:image/jpeg;base64,${frame.generatedImageBase64}`}
                                    alt="Frame Visual"
                                    className="w-full h-auto object-cover"
                                  />
                                </motion.div>
                              )}
                            </div>

                            {/* MOTION PROMPT */}
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-[10px] text-purple-400 font-bold font-mono uppercase tracking-widest">
                                <ArrowRight className="w-3 h-3" /> Motion Prompt
                                Workflow
                              </div>
                              <p className="font-mono text-zinc-300 text-sm border-l-2 border-zinc-700 pl-3">
                                {frame.motionPrompt}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold font-mono uppercase tracking-widest mt-4">
                                <Camera className="w-3 h-3 text-white" /> Camera
                                Angle
                              </div>
                              <p className="font-mono text-zinc-300 text-sm border-l-2 border-zinc-700 pl-3">
                                {frame.cameraAngle}
                              </p>
                            </div>
                          </div>

                          {/* Row 2: Audio/Voice */}
                          <div className="flex flex-col gap-2 pt-4 border-t border-zinc-800">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[10px] text-green-400 font-bold font-mono uppercase tracking-widest">
                                <Mic className="w-3 h-3" /> Voice-over /
                                Narration Pipeline
                              </div>
                              {!frame.generatedAudioBase64 && (
                                <button
                                  onClick={() =>
                                    generateAudioForFrame(
                                      idx,
                                      frame.voiceOverText,
                                    )
                                  }
                                  disabled={frame.isGeneratingAudio}
                                  className="bg-zinc-800 text-white text-[10px] px-2 py-1 uppercase font-bold tracking-widest border border-zinc-600 hover:bg-green-500 hover:text-black disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
                                >
                                  {frame.isGeneratingAudio ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Volume2 className="w-3 h-3" />
                                  )}
                                  GENERATE VOICE
                                </button>
                              )}
                            </div>

                            <p className="font-mono text-white text-sm bg-black p-3 border border-brutalist">
                              "{frame.voiceOverText}"
                            </p>

                            {frame.generatedAudioBase64 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 flex flex-col gap-1 w-full max-w-sm"
                              >
                                <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                                  Generated Audio:
                                </div>
                                <audio
                                  controls
                                  className="h-8 w-full invert contrast-150 grayscale"
                                  src={`data:audio/wav;base64,${frame.generatedAudioBase64}`}
                                />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* =========================================
             RENDER INNER PARADOX
          ========================================= */}
      {activeTab === "paradox" && (
        <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4 pb-12">
          <div className="flex items-center gap-3 bg-purple-900/30 border border-purple-500/50 text-purple-400 p-4 font-mono text-sm uppercase">
            <Brain className="w-5 h-5 flex-shrink-0" /> AI Psychological
            Profiling Active
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              Input Deskripsi Singkat / Profesi / Sifat (cth: "Pengacara sukses
              yang selalu menang kasus")
            </label>
            <div className="bg-zinc-900 border border-brutalist flex flex-col md:flex-row focus-within:border-purple-500 transition-colors">
              <div className="flex-1 flex items-center px-4">
                <span className="text-purple-500 font-mono mr-3 text-lg">
                  {">"}
                </span>
                <input
                  type="text"
                  value={paradoxInput}
                  onChange={(e) => {
                    setParadoxInput(e.target.value);
                    if (paradoxError) setParadoxError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && getParadoxInfo()}
                  placeholder="Deskripsikan karakternya..."
                  className="tooltip-wrap w-full py-5 bg-transparent outline-none text-white font-mono placeholder-zinc-600"
                  disabled={paradoxLoading}
                  data-tooltip="Masukkan deskripsi untuk di-diagnosa"
                />
              </div>
              <button
                onClick={getParadoxInfo}
                disabled={paradoxLoading}
                className="tooltip-wrap bg-purple-600 text-white px-10 py-5 font-display text-xl md:text-2xl uppercase hover:bg-white hover:text-black hover:border-l-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-brutalist cursor-pointer"
                data-tooltip="Diagnosis psikologi karakter"
              >
                {paradoxLoading ? (
                  <>DIAGNOSING...</>
                ) : (
                  <>
                    UNRAVEL <InfinityIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {paradoxError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/20 border border-red-500 text-red-500 p-4 font-mono text-sm uppercase"
              >
                [ERROR] {paradoxError}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {paradoxLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center border border-brutalist bg-black p-12 my-4"
              >
                <div className="flex items-center gap-4 text-purple-500 font-display text-2xl uppercase tracking-widest animate-pulse">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" />{" "}
                  MENGGALI JATI DIRI...
                </div>
              </motion.div>
            )}

            {paradoxIdea && !paradoxLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-8 my-4"
              >
                <div className="bg-black border border-purple-500 p-6 md:p-8 flex flex-col gap-6 shadow-[10px_10px_0_0_#9333ea]">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase text-purple-500 border border-purple-900 px-2 py-1 font-mono">
                      PSYCHOLOGICAL PROFILE DIAGNOSIS
                    </span>
                    <button
                      onClick={handleShareParadox}
                      className="tooltip-wrap flex items-center gap-2 bg-purple-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors z-20 cursor-pointer"
                      data-tooltip="Salin diagnosis"
                    >
                      {copiedParadox ? (
                        <CheckCheck className="w-4 h-4" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                      {copiedParadox ? "COPIED" : "SHARE DIAGNOSIS"}
                    </button>
                  </div>

                  {/* The Paradox - HERO SECTION */}
                  <div className="flex flex-col items-center justify-center text-center gap-4 py-8 border-y border-zinc-800">
                    <InfinityIcon className="w-12 h-12 text-purple-500 mb-2" />
                    <h2 className="font-display text-3xl md:text-5xl text-white uppercase tracking-tighter leading-tight max-w-3xl">
                      "{paradoxIdea.theParadox}"
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase mt-2">
                      CORE PARADOX
                    </span>
                  </div>

                  {/* Split Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* Persona */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                        <Target className="w-4 h-4 text-cyan-400" />
                        <span className="font-display text-lg uppercase tracking-widest text-zinc-300">
                          Surface Persona
                        </span>
                      </div>
                      <p className="font-mono text-white text-sm leading-relaxed text-justify">
                        {paradoxIdea.surfacePersona}
                      </p>
                    </div>

                    {/* Core Wound */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                        <Activity className="w-4 h-4 text-red-500" />
                        <span className="font-display text-lg uppercase tracking-widest text-zinc-300">
                          Core Wound
                        </span>
                      </div>
                      <p className="font-mono text-white text-sm leading-relaxed text-justify">
                        {paradoxIdea.coreWound}
                      </p>
                    </div>
                  </div>

                  {/* Behavioral Quirks */}
                  <div className="flex flex-col gap-3 pt-6">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span className="font-display text-lg uppercase tracking-widest text-zinc-300">
                        Behavioral Quirks
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      {paradoxIdea.behavioralQuirks.map((quirk, idx) => (
                        <li
                          key={idx}
                          className="bg-zinc-900 border border-zinc-700 p-4 font-mono text-zinc-300 text-xs leading-relaxed flex items-start gap-3"
                        >
                          <span className="text-purple-500 font-bold">
                            0{idx + 1}
                          </span>{" "}
                          {quirk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Breaking Point */}
                  <div className="flex flex-col gap-3 mt-4 bg-red-900/10 border border-red-900/50 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Skull className="w-24 h-24 text-red-500" />
                    </div>
                    <div className="flex items-center gap-2 pb-2 relative z-10">
                      <Flame className="w-5 h-5 text-red-500" />
                      <span className="font-display text-xl uppercase tracking-widest text-red-500">
                        Breaking Point
                      </span>
                    </div>
                    <p className="font-mono text-red-100/80 text-sm leading-relaxed relative z-10">
                      {paradoxIdea.breakingPoint}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* =========================================
             RENDER ANIMASI AI
          ========================================= */}
      {activeTab === "animasi" && (
        <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col gap-6 pt-4 pb-12">
          <div className="flex flex-col md:flex-row gap-2 border-b border-brutalist pb-4">
            <button
              onClick={() => setAnimasiSector("pipeline")}
              className={`flex-1 py-3 px-4 font-display uppercase tracking-widest text-xs md:text-sm transition-colors border ${animasiSector === "pipeline" ? "bg-pink-500 text-black border-pink-500" : "bg-transparent text-zinc-400 border-zinc-800 hover:border-pink-500 hover:text-pink-500"}`}
            >
              PIPELINE
            </button>
            <button
              onClick={() => setAnimasiSector("infografik")}
              className={`flex-1 py-3 px-4 font-display uppercase tracking-widest text-xs md:text-sm transition-colors border ${animasiSector === "infografik" ? "bg-indigo-500 text-black border-indigo-500" : "bg-transparent text-zinc-400 border-zinc-800 hover:border-indigo-500 hover:text-indigo-500"}`}
            >
              SECTOR INFOGRAFIK
            </button>
            <button
              onClick={() => setAnimasiSector("storyboard")}
              className={`flex-1 py-3 px-4 font-display uppercase tracking-widest text-xs md:text-sm transition-colors border ${animasiSector === "storyboard" ? "bg-orange-500 text-black border-orange-500" : "bg-transparent text-zinc-400 border-zinc-800 hover:border-orange-500 hover:text-orange-500"}`}
            >
              SECTOR STORYBOARD
            </button>
            <button
              onClick={() => setAnimasiSector("fotostudio")}
              className={`flex-1 py-3 px-4 font-display uppercase tracking-widest text-xs md:text-sm transition-colors border ${animasiSector === "fotostudio" ? "bg-teal-500 text-black border-teal-500" : "bg-transparent text-zinc-400 border-zinc-800 hover:border-teal-500 hover:text-teal-500"}`}
            >
              SECTOR FOTOSTUDIO
            </button>
            <button
              onClick={() => setAnimasiSector("voiceover")}
              className={`flex-1 py-3 px-4 font-display uppercase tracking-widest text-xs md:text-sm transition-colors border ${animasiSector === "voiceover" ? "bg-green-500 text-black border-green-500" : "bg-transparent text-zinc-400 border-zinc-800 hover:border-green-500 hover:text-green-500"}`}
            >
              SECTOR VOICEOVER
            </button>
          </div>

          {/* PIPELINE UI */}
          {animasiSector === "pipeline" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 bg-pink-900/30 border border-pink-500/50 text-pink-400 p-4 font-mono text-sm uppercase">
                <Video className="w-5 h-5 flex-shrink-0" /> AI Animation
                Pipeline Active
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Ide Video Animasi (Contoh: "Bocah menemukan robot rongsokan di
                  tumpukan sampah")
                </label>
                <div className="bg-zinc-900 border border-brutalist flex flex-col md:flex-row focus-within:border-pink-500 transition-colors">
                  <div className="flex-1 flex items-center px-4">
                    <span className="text-pink-500 font-mono mr-3 text-lg">
                      {">"}
                    </span>
                    <input
                      type="text"
                      value={animasiInput}
                      onChange={(e) => {
                        setAnimasiInput(e.target.value);
                        if (animasiError) setAnimasiError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && getAnimasiInfo()}
                      placeholder="Ceritain ide animasinya..."
                      className="tooltip-wrap w-full py-5 bg-transparent outline-none text-white font-mono placeholder-zinc-600"
                      disabled={animasiLoading}
                      data-tooltip="Ide video animasi"
                    />
                  </div>
                  <button
                    onClick={getAnimasiInfo}
                    disabled={animasiLoading}
                    className="tooltip-wrap bg-pink-500 text-black px-10 py-5 font-display text-xl md:text-2xl uppercase hover:bg-white hover:text-black hover:border-l-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-brutalist cursor-pointer"
                    data-tooltip="Generate animasi"
                  >
                    {animasiLoading ? (
                      <>GENERATING...</>
                    ) : (
                      <>
                        BUILD AI PIPELINE <Wand2 className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {animasiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-900/20 border border-red-500 text-red-500 p-4 font-mono text-sm uppercase"
                  >
                    [ERROR] {animasiError}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {animasiLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center border border-brutalist bg-black p-12 my-4"
                  >
                    <div className="flex items-center gap-4 text-pink-500 font-display text-2xl uppercase tracking-widest animate-pulse">
                      <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" />{" "}
                      MENGANALISIS PIPELINE...
                    </div>
                  </motion.div>
                )}

                {animasiIdea && !animasiLoading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-8 my-4"
                  >
                    <div className="bg-black border border-pink-500 p-6 md:p-8 flex flex-col gap-6 shadow-[10px_10px_0_0_#ec4899]">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase text-pink-500 border border-pink-900 px-2 py-1 font-mono">
                          Animation Prospectus
                        </span>
                        <button
                          onClick={handleShareAnimasi}
                          className="tooltip-wrap flex items-center gap-2 bg-pink-500 text-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors z-20 cursor-pointer"
                          data-tooltip="Salin pipeline"
                        >
                          {copiedAnimasi ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                          {copiedAnimasi ? "COPIED" : "SHARE PROSPECTUS"}
                        </button>
                      </div>

                      <h2 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tighter leading-none mt-2">
                        {animasiIdea.title}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 border-t border-zinc-800 pt-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Palette className="w-3 h-3 text-pink-500" /> ART
                            STYLE
                          </span>
                          <span className="font-mono text-white text-sm">
                            {animasiIdea.artStyle}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="w-3 h-3 text-pink-500" />{" "}
                            COLOR PALETTE
                          </span>
                          <span className="font-mono text-pink-400 text-sm font-bold">
                            {animasiIdea.colorPalette}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Characters */}
                    <div className="flex flex-col gap-4">
                      <h3 className="text-xl font-display uppercase tracking-widest text-zinc-400 border-b border-brutalist pb-2 flex items-center gap-2">
                        <Users className="w-5 h-5 text-pink-500" /> CHARACTER
                        CONCEPT SHEETS
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {animasiIdea.characters.map((char, idx) => (
                          <div
                            key={idx}
                            className="bg-zinc-900 border border-zinc-800 p-4 flex flex-col gap-2"
                          >
                            <span className="font-display text-pink-500 uppercase tracking-widest text-xl">
                              {char.name}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                              Visual Prompt
                            </span>
                            <p className="font-mono text-sm text-zinc-300 leading-relaxed bg-black p-3 border border-zinc-800">
                              {char.visualPrompt}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SCENES */}
                    <div className="flex flex-col gap-4 mt-4">
                      <h3 className="text-xl font-display uppercase tracking-widest text-zinc-400 border-b border-brutalist pb-2 flex items-center gap-2">
                        <Film className="w-5 h-5 text-pink-500" /> SCENE BY
                        SCENE PIPELINE
                      </h3>
                      <div className="flex flex-col gap-8">
                        {animasiIdea.scenes.map((scene, idx) => (
                          <div
                            key={idx}
                            className="bg-black border border-brutalist overflow-hidden relative"
                          >
                            <div className="absolute top-0 right-0 bg-pink-500 text-black font-display px-4 py-2 text-xl">
                              {scene.sceneNumber}
                            </div>
                            <div className="p-6 pt-10 flex flex-col gap-6">
                              {/* Setting & Action */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-zinc-800">
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold font-mono uppercase tracking-widest">
                                    <Globe className="w-3 h-3 text-pink-500" />{" "}
                                    SETTING
                                  </div>
                                  <p className="font-mono text-zinc-300 text-sm">
                                    {scene.setting}
                                  </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold font-mono uppercase tracking-widest">
                                    <Activity className="w-3 h-3 text-pink-500" />{" "}
                                    ACTION
                                  </div>
                                  <p className="font-mono text-zinc-300 text-sm">
                                    {scene.action}
                                  </p>
                                </div>
                              </div>

                              {/* Prompts */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Image generation (Midjourney style) */}
                                <div className="flex flex-col gap-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold font-mono uppercase tracking-widest">
                                      <ImageIcon className="w-3 h-3" /> STILL
                                      FRAME PROMPT (MIDJOURNEY)
                                    </div>
                                    {!scene.generatedImageBase64 && (
                                      <button
                                        onClick={() =>
                                          generateAnimasiImage(
                                            idx,
                                            scene.imagePrompt,
                                            animasiIdea.artStyle,
                                          )
                                        }
                                        disabled={scene.isGeneratingImage}
                                        className="bg-zinc-800 text-white text-[9px] px-2 py-1 uppercase font-bold tracking-widest border border-zinc-600 hover:bg-cyan-500 hover:text-black disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
                                      >
                                        {scene.isGeneratingImage ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Sparkles className="w-3 h-3" />
                                        )}
                                        GENERATE CONCEPT
                                      </button>
                                    )}
                                  </div>
                                  <p className="font-mono text-xs text-zinc-400 bg-zinc-900 border-l-2 border-cyan-500 p-3">
                                    {scene.imagePrompt}
                                  </p>
                                  {scene.generatedImageBase64 && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="mt-2 border border-cyan-500 p-1 relative"
                                    >
                                      <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[8px] font-bold px-1 m-1 uppercase shadow-sm">
                                        Generated Concept
                                      </div>
                                      <img
                                        src={`data:image/jpeg;base64,${scene.generatedImageBase64}`}
                                        alt="Scene Concept"
                                        className="w-full h-auto object-cover"
                                      />
                                    </motion.div>
                                  )}
                                </div>

                                {/* Video Generation Pipeline */}
                                <div className="flex flex-col gap-3">
                                  <div className="flex items-center gap-2 text-[10px] text-pink-500 font-bold font-mono uppercase tracking-widest">
                                    <Video className="w-3 h-3" /> VIDEO PROMPT
                                    (LUMA / RUNWAY)
                                  </div>
                                  <p className="font-mono text-xs text-pink-400 bg-pink-900/10 border-l-2 border-pink-500 p-3">
                                    {scene.videoPrompt}
                                  </p>

                                  <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2 text-[10px] text-green-400 font-bold font-mono uppercase tracking-widest">
                                      <Mic className="w-3 h-3" /> VOICE OVER /
                                      AUDIO
                                    </div>
                                    {!scene.generatedAudioBase64 && (
                                      <button
                                        onClick={() =>
                                          generateAnimasiAudio(
                                            idx,
                                            scene.voiceOver,
                                          )
                                        }
                                        disabled={scene.isGeneratingAudio}
                                        className="bg-zinc-800 text-white text-[9px] px-2 py-1 uppercase font-bold tracking-widest border border-zinc-600 hover:bg-green-500 hover:text-black disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
                                      >
                                        {scene.isGeneratingAudio ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Play className="w-3 h-3" />
                                        )}
                                        GENERATE VOICE
                                      </button>
                                    )}
                                  </div>
                                  <p className="font-mono text-sm text-zinc-300 italic p-3 border border-zinc-800">
                                    "{scene.voiceOver}"
                                  </p>
                                  {scene.generatedAudioBase64 && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="mt-1 flex flex-col gap-1 w-full max-w-sm"
                                    >
                                      <audio
                                        controls
                                        className="h-8 w-full invert contrast-150 grayscale"
                                        src={`data:audio/wav;base64,${scene.generatedAudioBase64}`}
                                      />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* INFOGRAFIK UI */}
          {animasiSector === "infografik" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Topik Infografis (Contoh: "Sejarah AI", "Cara Kerja Mesin
                  Mobil")
                </label>
                <div className="bg-zinc-900 border border-brutalist flex flex-col md:flex-row focus-within:border-indigo-500 transition-colors">
                  <div className="flex-1 flex items-center px-4">
                    <span className="text-indigo-500 font-mono mr-3 text-lg">
                      {">"}
                    </span>
                    <input
                      type="text"
                      value={infoInput}
                      onChange={(e) => {
                        setInfoInput(e.target.value);
                        if (infoError) setInfoError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && getInfografik()}
                      placeholder="Masukkan topik..."
                      className="tooltip-wrap w-full py-5 bg-transparent outline-none text-white font-mono placeholder-zinc-600"
                      disabled={infoLoading}
                      data-tooltip="Masukkan topik infografis"
                    />
                  </div>
                  <button
                    onClick={getInfografik}
                    disabled={infoLoading}
                    className="bg-indigo-500 text-black px-10 py-5 font-display text-xl uppercase hover:bg-white hover:text-black hover:border-l-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-brutalist cursor-pointer"
                  >
                    {infoLoading ? "GENERATING..." : "GENERATE POSTER"}
                  </button>
                </div>
              </div>

              {infoError && (
                <div className="text-red-500 mb-4">{infoError}</div>
              )}
              {infoLoading && (
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
              )}

              {infoIdea && !infoLoading && (
                <div className="bg-black border border-indigo-500 p-6 flex flex-col gap-4">
                  <h2 className="text-3xl font-display text-white uppercase">
                    {infoIdea.title}
                  </h2>
                  <div className="flex gap-4 mb-4">
                    <span className="bg-indigo-900/30 text-indigo-400 border border-indigo-500 px-3 py-1 text-xs">
                      Color: {infoIdea.colorTheme}
                    </span>
                    <span className="bg-indigo-900/30 text-indigo-400 border border-indigo-500 px-3 py-1 text-xs">
                      Font: {infoIdea.typography}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {infoIdea.sections?.map((sec: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-zinc-900 border border-zinc-800 p-4"
                      >
                        <h3 className="text-indigo-500 font-bold mb-2 uppercase">
                          {sec.heading}
                        </h3>
                        <ul className="list-disc list-inside text-sm text-zinc-300 mb-2">
                          {sec.points?.map((pt: string, pidx: number) => (
                            <li key={pidx}>{pt}</li>
                          ))}
                        </ul>
                        <span className="text-xs text-indigo-300 italic">
                          Visual: {sec.visualIdea}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STORYBOARD UI */}
          {animasiSector === "storyboard" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Ide Cerita Pendek (Contoh: "Maling dikejar anjing di pasar")
                </label>
                <div className="bg-zinc-900 border border-brutalist flex flex-col md:flex-row focus-within:border-orange-500 transition-colors">
                  <div className="flex-1 flex items-center px-4">
                    <span className="text-orange-500 font-mono mr-3 text-lg">
                      {">"}
                    </span>
                    <input
                      type="text"
                      value={sbInput}
                      onChange={(e) => {
                        setSbInput(e.target.value);
                        if (sbError) setSbError("");
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && getStoryboardSector()
                      }
                      placeholder="Masukkan ide cerita..."
                      className="tooltip-wrap w-full py-5 bg-transparent outline-none text-white font-mono placeholder-zinc-600"
                      disabled={sbLoading}
                      data-tooltip="Ide storyboard cerita"
                    />
                  </div>
                  <button
                    onClick={getStoryboardSector}
                    disabled={sbLoading}
                    className="bg-orange-500 text-black px-10 py-5 font-display text-xl uppercase hover:bg-white hover:text-black hover:border-l-white disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors flex items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-brutalist cursor-pointer"
                  >
                    {sbLoading ? "GENERATING..." : "BUAT STORYBOARD"}
                  </button>
                </div>
              </div>

              {sbError && <div className="text-red-500 mb-4">{sbError}</div>}
              {sbLoading && (
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
              )}

              {sbIdea && !sbLoading && (
                <div className="bg-black border border-orange-500 p-6 flex flex-col gap-6">
                  <h2 className="text-3xl font-display text-white uppercase">
                    {sbIdea.projectTitle}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sbIdea.panels?.map((panel: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-zinc-900 border border-orange-900 p-4 flex flex-col gap-2 relative"
                      >
                        <span className="absolute top-2 right-2 text-orange-500 font-display text-2xl">
                          {panel.panelNumber}
                        </span>
                        <div className="text-xs uppercase text-orange-400 font-bold mb-2">
                          SHOT: {panel.shotType} | TIME: {panel.timing}
                        </div>
                        <div className="text-sm text-zinc-300">
                          <strong>Aksi:</strong> {panel.action}
                        </div>
                        <div className="text-sm text-zinc-300">
                          <strong>Dialog:</strong> {panel.dialogue}
                        </div>
                        <div className="text-sm text-zinc-300">
                          <strong>Kamera:</strong> {panel.cameraMotion}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FOTOSTUDIO UI */}
          {animasiSector === "fotostudio" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Upload Foto Subject
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoUpload}
                    className="text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-black hover:file:bg-teal-400"
                  />
                  <button
                    onClick={generateFotoStudio}
                    disabled={fotoLoading || !fotoImg}
                    className="bg-teal-500 text-black px-6 py-2 font-bold uppercase transition disabled:opacity-50"
                  >
                    {fotoLoading ? "GENERATING..." : "UPGRADE TO STUDIO"}
                  </button>
                </div>
              </div>

              {fotoError && (
                <div className="text-red-500 mb-4">{fotoError}</div>
              )}
              {fotoLoading && (
                <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto" />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fotoImg && (
                  <div className="flex flex-col">
                    <span className="text-xs text-teal-500 uppercase mb-2">
                      Original
                    </span>
                    <img
                      src={fotoImg}
                      alt="Original"
                      className="w-full h-auto border border-zinc-700"
                    />
                  </div>
                )}
                {fotoOutput && !fotoLoading && (
                  <div className="flex flex-col">
                    <span className="text-xs text-teal-500 uppercase mb-2">
                      Studio Output
                    </span>
                    <img
                      src={`data:image/jpeg;base64,${fotoOutput}`}
                      alt="Studio Output"
                      className="w-full h-auto border border-teal-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VOICEOVER UI */}
          {animasiSector === "voiceover" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Teks Voiceover
                </label>
                <textarea
                  value={voInput}
                  onChange={(e) => setVoInput(e.target.value)}
                  className="w-full h-32 bg-zinc-900 border border-brutalist p-4 text-white focus:border-green-500 outline-none"
                  placeholder="Ketik teks yang mau diucapkan..."
                />
              </div>
              <div className="flex gap-4 items-center">
                <select
                  value={voVoice}
                  onChange={(e) => setVoVoice(e.target.value)}
                  className="bg-zinc-800 text-white p-2 border border-zinc-700 outline-none"
                >
                  <option value="Puck">Voice 1 (Puck)</option>
                  <option value="Kore">Voice 2 (Kore)</option>
                  <option value="Aoede">Voice 3 (Aoede)</option>
                  <option value="Charon">Voice 4 (Charon)</option>
                  <option value="Fenrir">Voice 5 (Fenrir)</option>
                </select>
                <button
                  onClick={getVoiceover}
                  disabled={voLoading}
                  className="bg-green-500 text-black px-6 py-2 font-bold uppercase transition disabled:opacity-50"
                >
                  {voLoading ? "GENERATING..." : "GENERATE AUDIO"}
                </button>
              </div>

              {voError && <div className="text-red-500 mb-4">{voError}</div>}
              {voLoading && (
                <Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto" />
              )}

              {voOutput && !voLoading && (
                <div className="bg-zinc-900 border border-green-500 p-4">
                  <span className="text-xs text-green-500 mb-2 block uppercase">
                    Generated Audio
                  </span>
                  <audio
                    controls
                    className="w-full"
                    src={`data:audio/wav;base64,${voOutput}`}
                  />
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* =========================================
             RENDER COMMERCIAL
          ========================================= */}
      {activeTab === "commercial" && (
        <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col gap-6 pt-12 pb-24 items-center">
          <div className="w-full text-center space-y-2 mb-8">
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-white">
              SINEMATOGRAFIS ID
            </h2>
            <p className="font-mono text-zinc-400 text-sm max-w-xl mx-auto">
              TEMPLATE REVOLUSIONER UNTUK MEMBUAT VIDEO ANIMASI CINEMATIC CUKUP
              DENGAN MEMAKAI HANDPHONE SAJA!
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Sebut produk/jasa lu (cth: Sepatu kulit hitam elegan, Kopi susu gula aren)"
              value={commercialInput}
              onChange={(e) => {
                setCommercialInput(e.target.value);
                if (commercialError) setCommercialError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && getCommercialInfo()}
              className="tooltip-wrap flex-1 bg-black border-2 border-zinc-800 p-4 text-white font-mono placeholder:text-zinc-600 focus:border-rose-500 transition-colors outline-none h-[60px]"
              disabled={commercialLoading}
              data-tooltip="Masukkan produk/jasa untuk commercial"
            />
            <button
              onClick={getCommercialInfo}
              disabled={commercialLoading}
              className="tooltip-wrap h-[60px] bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 text-white px-8 font-display tracking-widest uppercase transition-all duration-300 shadow-[4px_4px_0_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none whitespace-nowrap"
              data-tooltip="Generate commercial"
            >
              {commercialLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-xl leading-none">⚙</span>
                  MENSUTRADARAI...
                </span>
              ) : (
                "ACTION 🎬"
              )}
            </button>
          </div>

          {commercialError && (
            <div className="w-full border-2 border-red-500 bg-red-950/30 p-4">
              <p className="font-mono text-red-500 text-sm">
                [ERROR] {commercialError}
              </p>
            </div>
          )}

          {commercialLoading && (
            <div className="w-full py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-rose-500 text-sm animate-pulse">
                Menghubungi Sutradara Iklan...
              </p>
            </div>
          )}

          {commercialIdea && !commercialLoading && (
            <div className="w-full border-t border-zinc-800 pt-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-full bg-zinc-900 border border-brutalist p-6 md:p-8 relative">
                <button
                  onClick={handleShareCommercial}
                  className="absolute top-4 right-4 text-xs font-mono tracking-widest uppercase flex items-center gap-2 px-3 py-2 border border-zinc-700 hover:border-white transition-colors group"
                >
                  {copiedCommercial ? (
                    <CheckCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <Share2 className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  )}
                  <span
                    className={
                      copiedCommercial
                        ? "text-green-500"
                        : "text-zinc-400 group-hover:text-white"
                    }
                  >
                    {copiedCommercial ? "COPIED" : "SHARE"}
                  </span>
                </button>

                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="font-display text-4xl uppercase text-white mb-2 pr-20 leading-tight">
                      {commercialIdea.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-zinc-800 p-4 bg-black flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest">
                        🔥 HOOK (0-3s)
                      </span>
                      <p className="text-zinc-300 text-sm">
                        {commercialIdea.hook}
                      </p>
                    </div>
                    <div className="border border-zinc-800 p-4 bg-black flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest">
                        🎯 PAIN POINT
                      </span>
                      <p className="text-zinc-300 text-sm">
                        {commercialIdea.painPoint}
                      </p>
                    </div>
                    <div className="border border-zinc-800 p-4 bg-black flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest">
                        ✨ SOLUTION
                      </span>
                      <p className="text-zinc-300 text-sm">
                        {commercialIdea.solution}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-4 border-b border-zinc-800 pb-2">
                      🎬 SHOT LIST & SCENE DIRECTION
                    </span>
                    <div className="flex flex-col gap-3">
                      {commercialIdea.scenes.map((scene, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col md:flex-row gap-4 border-l-2 border-rose-500 pl-4 py-2 hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="md:w-1/4">
                            <span className="text-xs font-bold text-rose-400 block uppercase tracking-widest">
                              SCENE {idx + 1}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500 uppercase">
                              {scene.shot}
                            </span>
                          </div>
                          <div className="md:w-3/4 flex flex-col gap-1">
                            <p className="text-sm text-zinc-300">
                              <span className="text-xs font-mono text-zinc-500 mr-2 uppercase">
                                Vis:
                              </span>
                              {scene.visual}
                            </p>
                            <p className="text-sm text-zinc-400 italic">
                              <span className="text-xs font-mono text-zinc-600 mr-2 uppercase not-italic">
                                Aud:
                              </span>
                              {scene.audio}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-dashed border-zinc-800 pt-6 mt-2 text-center">
                    <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest mb-2 block">
                      🚀 CALL TO ACTION (OUTRO)
                    </span>
                    <p className="font-display text-2xl uppercase text-white px-4 py-3 bg-rose-600 inline-block shadow-[4px_4px_0_0_#fff]">
                      {commercialIdea.cta}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* =========================================
             RENDER ELEMENTOR.KU
          ========================================= */}
      {activeTab === "elementor" && (
        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6 pt-12 pb-24 items-center">
          <div className="w-full text-center space-y-2 mb-8">
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-white">
              ELEMENTORKU 2.0 <span className="text-blue-500">WHITELABEL</span>
            </h2>
            <p className="font-mono text-zinc-400 text-sm max-w-2xl mx-auto">
              Senjata Rahasia Pebisnis Online & Web Agency. Generate Blueprint
              Landing Page mematikan dalam hitungan detik!
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Ide produk biang kerok banjir orderan lu (cth: Ebook diet keto, Kelas optimasi SEO)"
              value={elementorInput}
              onChange={(e) => {
                setElementorInput(e.target.value);
                if (elementorError) setElementorError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && getElementorInfo()}
              className="tooltip-wrap flex-1 bg-black border-2 border-zinc-800 p-4 text-white font-mono placeholder:text-zinc-600 focus:border-blue-500 transition-colors outline-none h-[60px]"
              disabled={elementorLoading}
              data-tooltip="Ide produk untuk landing page"
            />
            <button
              onClick={getElementorInfo}
              disabled={elementorLoading}
              className="tooltip-wrap h-[60px] bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white px-8 font-display tracking-widest uppercase transition-all duration-300 shadow-[4px_4px_0_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none whitespace-nowrap"
              data-tooltip="Generate elementor blueprint"
            >
              {elementorLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-xl leading-none">⚙</span>
                  GENERATING...
                </span>
              ) : (
                "GENERATE LP 🚀"
              )}
            </button>
          </div>

          {elementorError && (
            <div className="w-full border-2 border-red-500 bg-red-950/30 p-4">
              <p className="font-mono text-red-500 text-sm">
                [ERROR] {elementorError}
              </p>
            </div>
          )}

          {elementorLoading && (
            <div className="w-full py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-blue-500 text-sm animate-pulse">
                Menyusun Blueprint Landing Page...
              </p>
            </div>
          )}

          {elementorIdea && !elementorLoading && (
            <div className="w-full border-t border-zinc-800 pt-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-full bg-zinc-900 border border-t-4 border-blue-500 p-6 md:p-10 relative">
                <button
                  onClick={handleShareElementor}
                  className="absolute top-4 right-4 text-xs font-mono tracking-widest uppercase flex items-center gap-2 px-3 py-2 border border-zinc-700 hover:border-white transition-colors group"
                >
                  {copiedElementor ? (
                    <CheckCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <Share2 className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  )}
                  <span
                    className={
                      copiedElementor
                        ? "text-green-500"
                        : "text-zinc-400 group-hover:text-white"
                    }
                  >
                    {copiedElementor ? "COPIED" : "SHARE"}
                  </span>
                </button>

                <div className="flex flex-col gap-10">
                  {/* Hero Section Blueprint */}
                  <div className="text-center px-4 md:px-12 pb-10 border-b border-zinc-800">
                    <span className="inline-block bg-blue-900/50 text-blue-400 border border-blue-500/30 px-3 py-1 font-mono text-xs uppercase tracking-widest mb-6">
                      🎯 Niche: {elementorIdea.niche}
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tighter text-white mb-6 leading-tight">
                      {elementorIdea.heroHeadline}
                    </h1>
                    <p className="font-sans text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto">
                      {elementorIdea.heroSubheadline}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Benefits Section */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-display text-2xl uppercase tracking-widest text-blue-400 flex items-center gap-2">
                        <Flame className="w-6 h-6" /> THE BENEFITS
                      </h3>
                      <div className="flex flex-col gap-3">
                        {elementorIdea.benefitPoints.map((point, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 bg-black p-4 border left-4 border-zinc-800"
                          >
                            <CheckCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="font-sans text-white">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features Section */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-display text-2xl uppercase tracking-widest text-blue-400 flex items-center gap-2">
                        <Box className="w-6 h-6" /> KILLER FEATURES
                      </h3>
                      <div className="flex flex-col gap-4">
                        {elementorIdea.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col gap-1 border-l-2 border-blue-500 pl-4 py-1"
                          >
                            <h4 className="font-bold text-white uppercase tracking-wider">
                              {feature.title}
                            </h4>
                            <p className="font-sans text-sm text-zinc-400">
                              {feature.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Target Audience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-black border border-zinc-800">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-3 h-3 text-blue-500" /> TARGET
                        AUDIENCE
                      </span>
                      <p className="font-sans text-zinc-300 font-medium">
                        {elementorIdea.targetAudience}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign className="w-3 h-3 text-blue-500" /> PRICING
                        STRATEGY
                      </span>
                      <p className="font-sans text-zinc-300 font-medium">
                        {elementorIdea.pricingStrategy}
                      </p>
                    </div>
                  </div>

                  {/* Final CTA */}
                  <div className="text-center pt-8 border-t border-dashed border-zinc-800">
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-4">
                      🚀 MAIN CALL TO ACTION
                    </span>
                    <button className="font-display text-2xl md:text-4xl uppercase px-8 py-4 bg-blue-600 text-white shadow-[6px_6px_0_0_#fff] cursor-default hover:bg-blue-500 transition-colors">
                      {elementorIdea.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* =========================================
             RENDER CANVA.PRO
          ========================================= */}
      {activeTab === "canva" && (
        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6 pt-12 pb-24 items-center">
          <div className="w-full text-center space-y-2 mb-8">
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-white">
              PREMIUM TEMPLATE CANVA{" "}
              <span className="text-emerald-500">BUNDLE PACKAGE</span>
            </h2>
            <p className="font-mono text-zinc-400 text-sm max-w-2xl mx-auto">
              (WHITELABEL) Paket bundling template canva komplit siap jual!
              Jadikan aset digital pertamamu dan raup keuntungannya.
            </p>
          </div>

          <div className="w-full flex justify-center gap-2 mb-2 flex-wrap">
            <button
              onClick={() => setCanvaInput("DILANKU 2.0 - WHITELABEL")}
              className="px-3 py-1 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase hover:bg-emerald-800/50 transition-colors"
            >
              DILANKU 2.0
            </button>
            <button
              onClick={() => setCanvaInput("DILANKU 1.0 WHITELABEL")}
              className="px-3 py-1 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase hover:bg-emerald-800/50 transition-colors"
            >
              DILANKU 1.0
            </button>
            <button
              onClick={() => setCanvaInput("KONTENKREATIF ID 2.0 WHITELABEL")}
              className="px-3 py-1 bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase hover:bg-emerald-800/50 transition-colors"
            >
              KONTENKREATIF ID 2.0
            </button>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Topik template atau bisnis lu (cth: Real Estate, Hijab Fashion, Food & Beverage)"
              value={canvaInput}
              onChange={(e) => {
                setCanvaInput(e.target.value);
                if (canvaError) setCanvaError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && getCanvaInfo()}
              className="tooltip-wrap flex-1 bg-black border-2 border-zinc-800 p-4 text-white font-mono placeholder:text-zinc-600 focus:border-emerald-500 transition-colors outline-none h-[60px]"
              disabled={canvaLoading}
              data-tooltip="Masukkan topik template Canva"
            />
            <button
              onClick={getCanvaInfo}
              disabled={canvaLoading}
              className="tooltip-wrap h-[60px] bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white px-8 font-display tracking-widest uppercase transition-all duration-300 shadow-[4px_4px_0_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none whitespace-nowrap"
              data-tooltip="Generate canva prospect"
            >
              {canvaLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-xl leading-none">⚙</span>
                  MERAMU BUNDLE...
                </span>
              ) : (
                "CREATE BUNDLE 🎨"
              )}
            </button>
          </div>

          {canvaError && (
            <div className="w-full border-2 border-red-500 bg-red-950/30 p-4">
              <p className="font-mono text-red-500 text-sm">
                [ERROR] {canvaError}
              </p>
            </div>
          )}

          {canvaLoading && (
            <div className="w-full py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-emerald-500 text-sm animate-pulse">
                Mennyiapkan Canva Bundle VIP...
              </p>
            </div>
          )}

          {canvaIdea && !canvaLoading && (
            <div className="w-full border-t border-zinc-800 pt-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-full bg-zinc-900 border border-t-4 border-emerald-500 p-6 md:p-10 relative">
                <button
                  onClick={handleShareCanva}
                  className="absolute top-4 right-4 text-xs font-mono tracking-widest uppercase flex items-center gap-2 px-3 py-2 border border-zinc-700 hover:border-white transition-colors group"
                >
                  {copiedCanva ? (
                    <CheckCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <Share2 className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  )}
                  <span
                    className={
                      copiedCanva
                        ? "text-green-500"
                        : "text-zinc-400 group-hover:text-white"
                    }
                  >
                    {copiedCanva ? "COPIED" : "SHARE"}
                  </span>
                </button>

                <div className="flex flex-col gap-10">
                  {/* Hero Section Blueprint */}
                  <div className="text-center px-4 md:px-12 pb-10 border-b border-zinc-800">
                    <span className="inline-block bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-mono text-xs uppercase tracking-widest mb-6">
                      🎯 Niche: {canvaIdea.niche}
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tighter text-white mb-6 leading-tight">
                      {canvaIdea.bundleName}
                    </h1>
                    <p className="font-sans text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto">
                      {canvaIdea.description}
                    </p>
                  </div>

                  {/* Categories Section */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-display text-2xl uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                      WHAT'S INSIDE THIS BUNDLE?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {canvaIdea.categories.map((cat, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col gap-2 bg-black p-5 border border-zinc-800 hover:border-emerald-500/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">
                              {cat.count}+ ITEMS
                            </span>
                          </div>
                          <h4 className="font-display tracking-wide text-white text-lg uppercase">
                            {cat.name}
                          </h4>
                          <p className="font-sans text-sm text-zinc-400">
                            {cat.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Target Audience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-black border border-zinc-800">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-3 h-3 text-emerald-500" /> DIRECT
                        TARGET AUDIENCE
                      </span>
                      <p className="font-sans text-white font-medium">
                        {canvaIdea.targetAudience}
                      </p>

                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2 mt-4 border-t border-zinc-800 pt-3">
                        <Flame className="w-3 h-3 text-emerald-500" /> MARKETING
                        ANGLE
                      </span>
                      <p className="font-sans text-zinc-300 text-sm whitespace-pre-wrap">
                        {canvaIdea.marketingAngle}
                      </p>
                    </div>
                    <div className="flex justify-center items-center p-4 border border-zinc-800 bg-zinc-900/50">
                      <div className="text-center">
                        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest block mb-2">
                          CRAZY PRICING VALUE
                        </span>
                        <p className="font-display text-3xl text-white">
                          {canvaIdea.pricingIdea}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Final CTA */}
                  <div className="text-center pt-8 border-t border-dashed border-zinc-800">
                    <button className="font-display text-2xl md:text-4xl uppercase px-8 py-4 bg-emerald-600 text-white shadow-[6px_6px_0_0_#fff] cursor-default hover:bg-emerald-500 transition-colors">
                      {canvaIdea.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
      {activeTab === "jualagi" && (
        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6 pt-12 pb-24 items-center">
          <div className="w-full text-center space-y-2 mb-8">
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-white">
              JUALAGI 6.0 <span className="text-orange-500">DIGITAL ASSET</span>
            </h2>
            <p className="font-mono text-zinc-400 text-sm max-w-2xl mx-auto">
              (MRR/PLR) Blueprint bundle aset digital mematikan yang siap dijual
              berkali-kali tanpa batas. Generate copywriting & struktur isinya.
            </p>
          </div>

          <div className="w-full flex justify-center gap-2 mb-2 flex-wrap">
            <button
              onClick={() => setJualagiInput("BUNDLE 1000+ PROMPT CHATGPT")}
              className="px-3 py-1 bg-orange-900/40 border border-orange-500/30 text-orange-400 font-mono text-xs uppercase hover:bg-orange-800/50 transition-colors"
            >
              PROMPT CHATGPT
            </button>
            <button
              onClick={() =>
                setJualagiInput("BUNDLE KURSUS BISNIS ONLINE & AFFILIATE")
              }
              className="px-3 py-1 bg-orange-900/40 border border-orange-500/30 text-orange-400 font-mono text-xs uppercase hover:bg-orange-800/50 transition-colors"
            >
              KURSUS BISNIS
            </button>
            <button
              onClick={() =>
                setJualagiInput("BUNDLE KONTEN SOSMED & REELS SIAP POST")
              }
              className="px-3 py-1 bg-orange-900/40 border border-orange-500/30 text-orange-400 font-mono text-xs uppercase hover:bg-orange-800/50 transition-colors"
            >
              KONTEN VIRAL
            </button>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Ide paketan produk MRR lu (cth: Ebook Kesehatan, Mentahan Video, Source Code Aplikasi)"
              value={jualagiInput}
              onChange={(e) => {
                setJualagiInput(e.target.value);
                if (jualagiError) setJualagiError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && getJualagiInfo()}
              className="tooltip-wrap flex-1 bg-black border-2 border-zinc-800 p-4 text-white font-mono placeholder:text-zinc-600 focus:border-orange-500 transition-colors outline-none h-[60px]"
              disabled={jualagiLoading}
              data-tooltip="Ide produk digital MRR"
            />
            <button
              onClick={getJualagiInfo}
              disabled={jualagiLoading}
              className="tooltip-wrap h-[60px] bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 text-white px-8 font-display tracking-widest uppercase transition-all duration-300 shadow-[4px_4px_0_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none whitespace-nowrap"
              data-tooltip="Generate jualagi MRR"
            >
              {jualagiLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-xl leading-none">⚙</span>
                  MENYUSUN...
                </span>
              ) : (
                "GENERATE 📦"
              )}
            </button>
          </div>

          {jualagiError && (
            <div className="w-full border-2 border-red-500 bg-red-950/30 p-4">
              <p className="font-mono text-red-500 text-sm">
                [ERROR] {jualagiError}
              </p>
            </div>
          )}

          {jualagiLoading && (
            <div className="w-full py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-orange-500 text-sm animate-pulse">
                Meracik Sales Copy Jualagi 6.0...
              </p>
            </div>
          )}

          {jualagiIdea && !jualagiLoading && (
            <div className="w-full border-t border-zinc-800 pt-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-full bg-zinc-900 border border-t-4 border-orange-500 p-6 md:p-10 relative">
                <button
                  onClick={handleShareJualagi}
                  className="absolute top-4 right-4 text-xs font-mono tracking-widest uppercase flex items-center gap-2 px-3 py-2 border border-zinc-700 hover:border-white transition-colors group"
                >
                  {copiedJualagi ? (
                    <CheckCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <Share2 className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  )}
                  <span
                    className={
                      copiedJualagi
                        ? "text-green-500"
                        : "text-zinc-400 group-hover:text-white"
                    }
                  >
                    {copiedJualagi ? "COPIED" : "SHARE"}
                  </span>
                </button>

                <div className="flex flex-col gap-10">
                  {/* Hero Section Blueprint */}
                  <div className="text-center px-4 md:px-12 pb-10 border-b border-zinc-800">
                    <span className="inline-block bg-orange-900/50 text-orange-400 border border-orange-500/30 px-3 py-1 font-mono text-xs uppercase tracking-widest mb-6">
                      🎯 JUALAGI 6.0 BLUEPRINT
                    </span>
                    <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tighter text-white mb-6 leading-tight">
                      {jualagiIdea.productName}
                    </h1>
                    <p className="font-sans text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto italic">
                      "{jualagiIdea.tagline}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Benefits Section */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-display text-2xl uppercase tracking-widest text-orange-400 flex items-center gap-2">
                        <Flame className="w-6 h-6" /> KENAPA RESELLER WAJIB BELI
                      </h3>
                      <div className="flex flex-col gap-3">
                        {jualagiIdea.benefitList.map((benefit, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 bg-black p-4 border-l-4 border-orange-500 border-t border-r border-b border-zinc-800/50"
                          >
                            <CheckCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                            <p className="font-sans text-white text-sm">
                              {benefit}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features Section */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-display text-2xl uppercase tracking-widest text-orange-400 flex items-center gap-2">
                        <Box className="w-6 h-6" /> ISI BUNDLE
                      </h3>
                      <div className="flex flex-col gap-3">
                        {jualagiIdea.featuresList.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-black p-4 border border-zinc-800"
                          >
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs shrink-0">
                              {idx + 1}
                            </span>
                            <p className="font-sans text-white text-sm">
                              {feature}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Target Audience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-black border border-zinc-800">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3 text-orange-500" /> TARGET
                        MARKET (SIAPA YANG BELI)
                      </span>
                      <p className="font-sans text-white font-medium">
                        {jualagiIdea.targetMarket}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 border-t md:border-l md:border-t-0 border-zinc-800 pt-4 md:pt-0 md:pl-6">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <DollarSign className="w-3 h-3 text-orange-500" /> MRR
                        PRICING STRATEGY
                      </span>
                      <p className="font-sans text-white text-sm whitespace-pre-wrap">
                        {jualagiIdea.pricingResell}
                      </p>
                    </div>
                  </div>

                  {/* Final CTA */}
                  <div className="text-center pt-8 border-t border-dashed border-zinc-800">
                    <button className="font-display text-2xl md:text-3xl uppercase px-8 py-4 bg-orange-600 text-white shadow-[6px_6px_0_0_#fff] cursor-default hover:bg-orange-500 transition-colors w-full md:w-auto">
                      {jualagiIdea.ctaSales}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
      {activeTab === "magnet" && (
        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6 pt-12 pb-24 items-center">
          <div className="w-full text-center space-y-2 mb-8">
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-white">
              MAGNET UANG <span className="text-yellow-400">BLUEPRINT</span>
            </h2>
            <p className="font-mono text-zinc-400 text-sm max-w-2xl mx-auto">
              Metode pencarian ide bisnis online yang belum tergarap, Blueprint
              penjualan berulang, & Strategi skalasi omzet ekstrem.
            </p>
          </div>

          <div className="w-full flex justify-center gap-2 mb-2 flex-wrap">
            <button
              onClick={() => setMagnetInput("Konsultan Diet & Fitness Online")}
              className="px-3 py-1 bg-yellow-900/40 border border-yellow-400/30 text-yellow-400 font-mono text-xs uppercase hover:bg-yellow-800/50 transition-colors"
            >
              DIET & FITNESS
            </button>
            <button
              onClick={() => setMagnetInput("Jasa Template Notion Productivity")}
              className="px-3 py-1 bg-yellow-900/40 border border-yellow-400/30 text-yellow-400 font-mono text-xs uppercase hover:bg-yellow-800/50 transition-colors"
            >
              TEMPLATE NOTION
            </button>
            <button
              onClick={() => setMagnetInput("Kelas Copywriting Pemula")}
              className="px-3 py-1 bg-yellow-900/40 border border-yellow-400/30 text-yellow-400 font-mono text-xs uppercase hover:bg-yellow-800/50 transition-colors"
            >
              COPYWRITING
            </button>
            <button
              onClick={() => setMagnetInput("Kelas Pastry & Bakery")}
              className="px-3 py-1 bg-yellow-900/40 border border-yellow-400/30 text-yellow-400 font-mono text-xs uppercase hover:bg-yellow-800/50 transition-colors"
            >
              PASTRY & BAKERY
            </button>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Skill, Hobi, atau Ide Bisnis Kasar lu... (cth: Jago bikin desain grafis, Suka masak kue)"
              value={magnetInput}
              onChange={(e) => {
                setMagnetInput(e.target.value);
                if (magnetError) setMagnetError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && getMagnetInfo()}
              className="tooltip-wrap flex-1 bg-black border-2 border-zinc-800 p-4 text-white font-mono placeholder:text-zinc-600 focus:border-yellow-400 transition-colors outline-none h-[60px]"
              disabled={magnetLoading}
              data-tooltip="Masukkan ide bisnis atau hobi"
            />
            <button
              onClick={getMagnetInfo}
              disabled={magnetLoading}
              className="tooltip-wrap h-[60px] bg-yellow-600 hover:bg-yellow-500 disabled:bg-zinc-800 text-white px-8 font-display tracking-widest uppercase transition-all duration-300 shadow-[4px_4px_0_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-none whitespace-nowrap"
              data-tooltip="Generate business idea"
            >
              {magnetLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-xl leading-none text-black">⚙</span>
                  <span className="text-black">MENARIK UANG...</span>
                </span>
              ) : (
                <span className="text-black font-bold">GENERATE 💸</span>
              )}
            </button>
          </div>

          {magnetError && (
            <div className="w-full border-2 border-red-500 bg-red-950/30 p-4">
              <p className="font-mono text-red-500 text-sm">
                [ERROR] {magnetError}
              </p>
            </div>
          )}

          {magnetLoading && (
            <div className="w-full py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-yellow-500 text-sm animate-pulse">
                Menyusun Framework Magnet Uang & Skalasi...
              </p>
            </div>
          )}

          {magnetIdea && !magnetLoading && (
            <div className="w-full border-t border-zinc-800 pt-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-full bg-zinc-900 border border-t-4 border-yellow-400 p-6 md:p-10 relative">
                <button
                  onClick={handleShareMagnet}
                  className="absolute top-4 right-4 text-xs font-mono tracking-widest uppercase flex items-center gap-2 px-3 py-2 border border-zinc-700 hover:border-white transition-colors group"
                >
                  {copiedMagnet ? (
                    <CheckCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <Share2 className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  )}
                  <span
                    className={
                      copiedMagnet
                        ? "text-green-500"
                        : "text-zinc-400 group-hover:text-white"
                    }
                  >
                    {copiedMagnet ? "COPIED" : "SHARE"}
                  </span>
                </button>

                <div className="flex flex-col gap-10">
                  {/* Hero Section Blueprint */}
                  <div className="text-center px-4 md:px-12 pb-10 border-b border-zinc-800">
                    <span className="inline-block bg-yellow-900/50 text-yellow-400 border border-yellow-500/30 px-3 py-1 font-mono text-xs uppercase tracking-widest mb-6">
                      💸 IDE BISNIS ONLINE
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl uppercase tracking-tighter text-white mb-6 leading-tight">
                      {magnetIdea.ideBisnis}
                    </h1>
                  </div>

                  {/* Metode & Target Market */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-zinc-800">
                    <div className="flex flex-col gap-4">
                      <h3 className="font-display text-xl uppercase tracking-widest text-yellow-400 flex items-center gap-2">
                        <Target className="w-5 h-5" /> METODE PENCARIAN
                      </h3>
                      <p className="font-sans text-zinc-300 text-sm leading-relaxed bg-black p-4 border border-zinc-800">
                        {magnetIdea.metodePencarian}
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <h3 className="font-display text-xl uppercase tracking-widest text-yellow-400 flex items-center gap-2">
                        <Users className="w-5 h-5" /> IDEAL TARGET MARKET
                      </h3>
                      <p className="font-sans text-zinc-300 text-sm leading-relaxed bg-black p-4 border border-zinc-800">
                        {magnetIdea.targetMarket}
                      </p>
                    </div>
                  </div>

                  {/* Blueprint & Skalasi */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Blueprint Penjualan Berulang */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-display text-xl uppercase tracking-widest text-yellow-400 flex items-center gap-2">
                        <CheckCheck className="w-5 h-5" /> BLUEPRINT OTOMATIS
                      </h3>
                      <div className="flex flex-col gap-3">
                        {magnetIdea.blueprintPenjualan.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-black p-4 border-l-2 border-yellow-400 border-t border-r border-b border-zinc-800">
                            <span className="flex items-center justify-center w-5 h-5 rounded bg-yellow-400/20 text-yellow-400 font-bold text-xs shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="font-sans text-white text-sm">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strategi Skalasi Cepat */}
                    <div className="flex flex-col gap-4">
                      <h3 className="font-display text-xl uppercase tracking-widest text-yellow-400 flex items-center gap-2">
                        <Flame className="w-5 h-5" /> METODE SKALASI CEPAT
                      </h3>
                      <div className="flex flex-col gap-3">
                        {magnetIdea.strategiSkalasi.map((strat, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-black p-4 border-l-2 border-orange-500 border-t border-r border-b border-zinc-800">
                            <Box className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <p className="font-sans text-white text-sm">{strat}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Potensi Income */}
                  <div className="mt-4 bg-yellow-400/10 border border-yellow-400/30 p-6 text-center">
                    <span className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4" /> ESTIMASI POTENSI INCOME
                    </span>
                    <p className="font-display text-2xl md:text-3xl text-yellow-400">
                      {magnetIdea.potensiIncome}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          )}
        </main>
      )}

    </div>
  );
}

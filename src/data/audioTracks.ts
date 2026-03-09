import shloksCover from "@/assets/albums/shlokas-cover.jpg";
import bhagavadGitaCover from "@/assets/albums/bhagavad-gita-cover.jpg";
import hanumanCover from "@/assets/albums/hanuman-cover.jpg";
import frequenciesCover from "@/assets/albums/frequencies-cover.jpg";
import phonkCover from "@/assets/albums/phonk-cover.jpg";
import ambientCover from "@/assets/albums/ambient-cover.jpg";
import meditationCover from "@/assets/albums/meditation-cover.jpg";
import natureCover from "@/assets/albums/nature-cover.jpg";

export interface Track {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: string;
  mood: string;
  color: string;
  videoId: string;
  description?: string;
}

export interface Album {
  id: string;
  title: string;
  category: string;
  description: string;
  coverArt: string;
  color: string;
}

export const ALBUMS: Album[] = [
  { id: "album-shlokas", title: "Sacred Shlokas", category: "Shlokas", description: "Ancient Sanskrit mantras for spiritual healing and inner peace", coverArt: shloksCover, color: "from-amber-600 to-yellow-500" },
  { id: "album-gita", title: "Bhagavad Gita", category: "Bhagavad Gita", description: "All 18 chapters of the divine scripture in Sanskrit", coverArt: bhagavadGitaCover, color: "from-orange-600 to-amber-500" },
  { id: "album-hanuman", title: "Hanuman Bhajans", category: "Hanuman Bhajans", description: "Devotional hymns dedicated to Lord Hanuman", coverArt: hanumanCover, color: "from-orange-600 to-red-500" },
  { id: "album-frequencies", title: "Calming Frequencies", category: "Calming Frequencies", description: "Solfeggio healing tones from 174 Hz to 963 Hz", coverArt: frequenciesCover, color: "from-violet-500 to-cyan-500" },
  { id: "album-phonk", title: "Uplifting Phonk", category: "Uplifting Phonk", description: "High-energy motivational beats to fuel your drive", coverArt: phonkCover, color: "from-purple-500 to-pink-500" },
  { id: "album-ambient", title: "Ambient", category: "Ambient", description: "Ethereal soundscapes for deep relaxation", coverArt: ambientCover, color: "from-teal-500 to-emerald-500" },
  { id: "album-meditation", title: "Meditation", category: "Meditation", description: "Immersive sounds for mindful meditation practice", coverArt: meditationCover, color: "from-indigo-500 to-violet-500" },
  { id: "album-nature", title: "Nature Sounds", category: "Nature", description: "Soothing sounds from forests, oceans, and storms", coverArt: natureCover, color: "from-green-500 to-emerald-500" },
];

export const TRACKS: Track[] = [
  // ── Uplifting Phonk / Motivational ──
  { id: "p1", title: "Rise From The Ashes", artist: "Phonk Music", category: "Uplifting Phonk", duration: "3:24", mood: "Energizing", color: "from-orange-500 to-red-500", videoId: "QJJYpsA5tv8" },
  { id: "p2", title: "Unbreakable Spirit", artist: "Phonk Music", category: "Uplifting Phonk", duration: "2:58", mood: "Empowering", color: "from-purple-500 to-pink-500", videoId: "65FnbMzoiJc" },
  { id: "p3", title: "Dawn of Resilience", artist: "Phonk Music", category: "Uplifting Phonk", duration: "3:12", mood: "Hopeful", color: "from-cyan-500 to-blue-500", videoId: "lDK9QqIzhwk" },
  { id: "p4", title: "Phoenix Rising", artist: "Phonk Music", category: "Uplifting Phonk", duration: "3:45", mood: "Motivating", color: "from-amber-500 to-orange-500", videoId: "tz82xbLvK_k" },
  { id: "p5", title: "Inner Strength", artist: "Phonk Music", category: "Uplifting Phonk", duration: "2:42", mood: "Powerful", color: "from-rose-500 to-fuchsia-500", videoId: "1-xGerv5FOk" },

  // ── Ambient / Relaxation ──
  { id: "a1", title: "Peaceful Waves", artist: "Relaxation Music", category: "Ambient", duration: "3:01:04", mood: "Calming", color: "from-teal-500 to-emerald-500", videoId: "bn9F19Hi1Lk" },
  { id: "a2", title: "Calm Piano & Strings", artist: "Soothing Relaxation", category: "Ambient", duration: "3:09:08", mood: "Serene", color: "from-sky-500 to-cyan-500", videoId: "77ZozI0rw7w" },
  { id: "a3", title: "Weightless", artist: "Marconi Union", category: "Ambient", duration: "10:00", mood: "Weightless", color: "from-slate-500 to-gray-500", videoId: "UfcAVejslrU" },

  // ── Meditation ──
  { id: "md1", title: "Deep Meditation Music", artist: "Meditation Relax Music", category: "Meditation", duration: "1:00:00", mood: "Relaxing", color: "from-indigo-500 to-violet-500", videoId: "FjHGZj2IjBk" },
  { id: "md2", title: "Tibetan Singing Bowls", artist: "Meditative Mind", category: "Meditation", duration: "1:03:51", mood: "Centering", color: "from-amber-500 to-yellow-500", videoId: "hKv1gEvFpRs" },
  { id: "md3", title: "432Hz Healing Frequency", artist: "Healing Vibrations", category: "Meditation", duration: "3:04:38", mood: "Healing", color: "from-violet-500 to-purple-500", videoId: "NPVX75VIpqg" },

  // ── Nature Sounds ──
  { id: "n1", title: "Forest Rain Sounds", artist: "Nature Sounds", category: "Nature", duration: "3:00:00", mood: "Soothing", color: "from-green-500 to-lime-500", videoId: "q76bMs-NwRk" },
  { id: "n2", title: "Ocean Waves at Night", artist: "Nature Sounds", category: "Nature", duration: "10:00:00", mood: "Peaceful", color: "from-blue-600 to-cyan-500", videoId: "bn9F19Hi1Lk" },
  { id: "n3", title: "Thunderstorm & Rain", artist: "Nature Sounds", category: "Nature", duration: "8:00:00", mood: "Grounding", color: "from-gray-600 to-slate-500", videoId: "nDq6TstdEi8" },

  // ── Shlokas / Mantras ──
  { id: "s1", title: "Gayatri Mantra", artist: "Sacred Chants", category: "Shlokas", duration: "29:00", mood: "Divine", color: "from-amber-600 to-yellow-500", videoId: "P5eWHjYhrG8" },
  { id: "s2", title: "Om Namah Shivaya", artist: "Sacred Chants", category: "Shlokas", duration: "1:07:47", mood: "Devotional", color: "from-orange-600 to-amber-500", videoId: "GqP41gUPRtQ" },
  { id: "s3", title: "Mahamrityunjaya Mantra", artist: "Sacred Chants", category: "Shlokas", duration: "26:26", mood: "Healing", color: "from-red-600 to-orange-500", videoId: "V8zXSQnHqzA" },
  { id: "s4", title: "Vishnu Sahasranama", artist: "M.S. Subbulakshmi", category: "Shlokas", duration: "29:36", mood: "Peaceful", color: "from-sky-600 to-blue-500", videoId: "ATflgO0S0A4" },
  { id: "s5", title: "Shanti Mantra", artist: "Sacred Chants", category: "Shlokas", duration: "5:34", mood: "Tranquil", color: "from-emerald-600 to-teal-500", videoId: "R0Jq9jK9hK0" },
  { id: "s6", title: "Durga Suktam", artist: "Sacred Chants", category: "Shlokas", duration: "8:49", mood: "Empowering", color: "from-fuchsia-600 to-pink-500", videoId: "6mT3rU8yQe0" },
  { id: "s7", title: "Sri Rudram", artist: "Vedic Chanting", category: "Shlokas", duration: "35:21", mood: "Sacred", color: "from-indigo-600 to-blue-500", videoId: "5S1dXyF3y6Q" },
  { id: "s8", title: "Lalitha Sahasranama", artist: "Sacred Chants", category: "Shlokas", duration: "41:37", mood: "Blissful", color: "from-pink-600 to-rose-500", videoId: "YwqvG9kJgq4" },
  { id: "s9", title: "Rudram Chamakam", artist: "Vedic Chanting", category: "Shlokas", duration: "30:00", mood: "Purifying", color: "from-blue-600 to-indigo-500", videoId: "HkR6xF5s7uQ" },
  { id: "s10", title: "Om Gan Ganpataye Namah", artist: "Sacred Chants", category: "Shlokas", duration: "11:00", mood: "Auspicious", color: "from-yellow-600 to-amber-500", videoId: "KZV8y4vA5Q0" },

  // ── Bhagavad Gita – All 18 Chapters ──
  { id: "bg1", title: "Ch 1 – Arjuna Vishada Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "15:55", mood: "Contemplative", color: "from-amber-600 to-yellow-500", videoId: "z4IQ4Laivtk" },
  { id: "bg2", title: "Ch 2 – Sankhya Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "30:00", mood: "Wisdom", color: "from-orange-600 to-amber-500", videoId: "gHxslLYlyxo" },
  { id: "bg3", title: "Ch 3 – Karma Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "18:00", mood: "Dutiful", color: "from-red-600 to-orange-500", videoId: "JVb9Fgo5-J4" },
  { id: "bg4", title: "Ch 4 – Jnana Karma Sanyasa Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "17:00", mood: "Enlightening", color: "from-rose-600 to-red-500", videoId: "tZxnilHN8EE" },
  { id: "bg5", title: "Ch 5 – Karma Sanyasa Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "12:00", mood: "Renouncing", color: "from-pink-600 to-rose-500", videoId: "Dw4aTqsWyu8" },
  { id: "bg6", title: "Ch 6 – Dhyana Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "18:00", mood: "Meditative", color: "from-fuchsia-600 to-pink-500", videoId: "YhxKObIFNQk" },
  { id: "bg7", title: "Ch 7 – Jnana Vijnana Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "12:00", mood: "Knowledge", color: "from-purple-600 to-fuchsia-500", videoId: "mBDmZJr0cwg" },
  { id: "bg8", title: "Ch 8 – Akshara Brahma Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "11:00", mood: "Eternal", color: "from-violet-600 to-purple-500", videoId: "E53GuZ8NFQw" },
  { id: "bg9", title: "Ch 9 – Raja Vidya Raja Guhya Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "14:00", mood: "Royal", color: "from-indigo-600 to-violet-500", videoId: "jxbZUqst6Ig" },
  { id: "bg10", title: "Ch 10 – Vibhuti Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "16:00", mood: "Glorious", color: "from-blue-600 to-indigo-500", videoId: "RBqn1wFD_pg" },
  { id: "bg11", title: "Ch 11 – Vishwaroop Darshan Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "22:00", mood: "Awe", color: "from-sky-600 to-blue-500", videoId: "hbXijZroSG0" },
  { id: "bg12", title: "Ch 12 – Bhakti Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "8:00", mood: "Devotional", color: "from-cyan-600 to-sky-500", videoId: "2dV49i79lNg" },
  { id: "bg13", title: "Ch 13 – Kshetra Kshetrajna Vibhaga Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "14:00", mood: "Discerning", color: "from-teal-600 to-cyan-500", videoId: "WITUOwi3EYk" },
  { id: "bg14", title: "Ch 14 – Gunatraya Vibhaga Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "10:00", mood: "Transcending", color: "from-emerald-600 to-teal-500", videoId: "C5UHgA9C3kw" },
  { id: "bg15", title: "Ch 15 – Purushottama Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "8:00", mood: "Supreme", color: "from-green-600 to-emerald-500", videoId: "z5NmcoNiUcw" },
  { id: "bg16", title: "Ch 16 – Daivasura Sampad Vibhaga Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "10:00", mood: "Righteous", color: "from-lime-600 to-green-500", videoId: "28sptQICKCk" },
  { id: "bg17", title: "Ch 17 – Shraddhatraya Vibhaga Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "11:00", mood: "Faithful", color: "from-yellow-600 to-lime-500", videoId: "gRSLrNUQuKU" },
  { id: "bg18", title: "Ch 18 – Moksha Sanyasa Yoga", artist: "Sanskrit Chanting", category: "Bhagavad Gita", duration: "30:00", mood: "Liberating", color: "from-amber-600 to-yellow-500", videoId: "FgcSLco9CwU" },

  // ── Hanuman Chalisa ──
  { id: "h1", title: "Hanuman Chalisa", artist: "Hariharan", category: "Hanuman Bhajans", duration: "8:42", mood: "Courageous", color: "from-orange-600 to-red-500", videoId: "BLlTFapgvOo" },

  // ── Calming Frequencies (Solfeggio) ──
  { id: "cf1", title: "174 Hz – Pain Relief", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "1:00:00", mood: "Relieving", color: "from-rose-400 to-pink-500", videoId: "ckh3EQFntLE", description: "The lowest solfeggio frequency acts as a natural anaesthetic, reducing physical and emotional pain. It helps relieve tension in the body, promotes a sense of safety, and grounds your energy for deep relaxation." },
  { id: "cf2", title: "285 Hz – Tissue Healing", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "1:00:00", mood: "Restorative", color: "from-fuchsia-400 to-purple-500", videoId: "uP2wPwgN-9I", description: "This frequency is linked to cellular regeneration and tissue repair. It signals the body to restructure damaged organs and tissues, boosts the immune system, and promotes rapid physical healing." },
  { id: "cf3", title: "396 Hz – Release Fear", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "3:00:00", mood: "Liberating", color: "from-violet-400 to-indigo-500", videoId: "It63d2trrNA", description: "Targets the root chakra to dissolve deep-seated guilt, fear, and grief. It liberates blocked emotional energy, helps overcome subconscious barriers, and transforms sorrow into joy and inner strength." },
  { id: "cf4", title: "417 Hz – Remove Negativity", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "1:00:00", mood: "Cleansing", color: "from-indigo-400 to-blue-500", videoId: "_IB22mi3OHQ", description: "Facilitates change by cleansing traumatic experiences and negative influences from the past. It breaks destructive patterns, re-energises your cells, and helps you embrace new beginnings with clarity." },
  { id: "cf5", title: "432 Hz – Natural Healing", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "11:54:55", mood: "Harmonizing", color: "from-blue-400 to-sky-500", videoId: "yrb1h0umtJo", description: "Known as the frequency of the universe, 432 Hz aligns with nature's vibrations. It reduces anxiety, lowers heart rate and blood pressure, promotes emotional balance, and creates a deep sense of harmony with the cosmos." },
  { id: "cf6", title: "528 Hz – Love Frequency", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "1:00:00", mood: "Transforming", color: "from-sky-400 to-cyan-500", videoId: "XqWFAZ3MCcU", description: "Called the 'Miracle Tone,' this frequency is believed to repair DNA and bring transformation. It resonates at the heart of everything, promoting love, restoring equilibrium, and increasing life energy and clarity of mind." },
  { id: "cf7", title: "639 Hz – Heart Healing", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "1:00:00", mood: "Connecting", color: "from-cyan-400 to-teal-500", videoId: "iL_A_E6iECo", description: "Balances the heart chakra, enhancing communication, understanding, and tolerance in relationships. It promotes harmony, heals interpersonal conflicts, and strengthens emotional connections with loved ones." },
  { id: "cf8", title: "741 Hz – Detox & Clarity", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "1:00:00", mood: "Purifying", color: "from-teal-400 to-emerald-500", videoId: "P4Pn9rtpLjo", description: "A powerful cleanser that removes toxins and electromagnetic radiation from cells. It awakens intuition, promotes self-expression, and leads to a purer, more stable spiritual life with enhanced problem-solving abilities." },
  { id: "cf9", title: "852 Hz – Awakening Intuition", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "1:00:00", mood: "Awakening", color: "from-emerald-400 to-green-500", videoId: "ja5SzgVd078", description: "Opens the third eye chakra, raising awareness and restoring spiritual order. It sharpens intuition, helps see through illusions, and reconnects you with your higher self and inner truth for deeper spiritual experiences." },
  { id: "cf10", title: "963 Hz – Crown Chakra", artist: "Healing Frequencies", category: "Calming Frequencies", duration: "1:00:00", mood: "Divine", color: "from-amber-400 to-yellow-500", videoId: "_TzTpbT4XiQ", description: "The highest solfeggio frequency activates the crown chakra and pineal gland, connecting you to universal consciousness. It awakens your divine nature, enables spiritual enlightenment, and restores oneness with the cosmos." },
];

export const CATEGORIES = [
  "All",
  "Calming Frequencies",
  "Shlokas",
  "Bhagavad Gita",
  "Hanuman Bhajans",
  "Uplifting Phonk",
  "Ambient",
  "Meditation",
  "Nature",
];

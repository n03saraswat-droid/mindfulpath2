export interface Track {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: string;
  mood: string;
  color: string;
  videoId: string;
}

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
  { id: "s1", title: "Gayatri Mantra", artist: "Sacred Chants", category: "Shlokas", duration: "29:00", mood: "Divine", color: "from-amber-600 to-yellow-500", videoId: "HVCzGaoMGec" },
  { id: "s2", title: "Om Namah Shivaya", artist: "Sacred Chants", category: "Shlokas", duration: "1:07:47", mood: "Devotional", color: "from-orange-600 to-amber-500", videoId: "jYdaQJzcAcw" },
  { id: "s3", title: "Mahamrityunjaya Mantra", artist: "Sacred Chants", category: "Shlokas", duration: "26:26", mood: "Healing", color: "from-red-600 to-orange-500", videoId: "CANrEJiPsRw" },
  { id: "s4", title: "Vishnu Sahasranama", artist: "M.S. Subbulakshmi", category: "Shlokas", duration: "29:36", mood: "Peaceful", color: "from-sky-600 to-blue-500", videoId: "eTINGFxbDfs" },
  { id: "s5", title: "Shanti Mantra", artist: "Sacred Chants", category: "Shlokas", duration: "5:34", mood: "Tranquil", color: "from-emerald-600 to-teal-500", videoId: "JdhfE_SzwB4" },
  { id: "s6", title: "Durga Suktam", artist: "Sacred Chants", category: "Shlokas", duration: "8:49", mood: "Empowering", color: "from-fuchsia-600 to-pink-500", videoId: "JhLnDBflGtk" },
  { id: "s7", title: "Sri Rudram", artist: "Vedic Chanting", category: "Shlokas", duration: "35:21", mood: "Sacred", color: "from-indigo-600 to-blue-500", videoId: "oHuXPmLZRdI" },
  { id: "s8", title: "Lalitha Sahasranama", artist: "Sacred Chants", category: "Shlokas", duration: "41:37", mood: "Blissful", color: "from-pink-600 to-rose-500", videoId: "EXtpj2hZpE0" },
  { id: "s9", title: "Rudram Chamakam", artist: "Vedic Chanting", category: "Shlokas", duration: "30:00", mood: "Purifying", color: "from-blue-600 to-indigo-500", videoId: "Iq78oO-QNNQ" },
  { id: "s10", title: "Om Gan Ganpataye Namah", artist: "Sacred Chants", category: "Shlokas", duration: "11:00", mood: "Auspicious", color: "from-yellow-600 to-amber-500", videoId: "CmxqHqTnUgs" },

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

  // ── Ramayana – All 7 Kandas ──
  { id: "r1", title: "Bala Kanda", artist: "Ramayana Audiobook", category: "Ramayana", duration: "3:27:00", mood: "Beginnings", color: "from-amber-600 to-yellow-500", videoId: "OhwhbdNt5RI" },
  { id: "r2", title: "Ayodhya Kanda", artist: "Ramayana Audiobook", category: "Ramayana", duration: "4:15:00", mood: "Devotional", color: "from-orange-600 to-amber-500", videoId: "QWvygspy4EA" },
  { id: "r3", title: "Aranya Kanda", artist: "Ramayana Audiobook", category: "Ramayana", duration: "2:48:00", mood: "Adventurous", color: "from-red-600 to-orange-500", videoId: "LHyWMr3nRQE" },
  { id: "r4", title: "Kishkindha Kanda", artist: "Ramayana Audiobook", category: "Ramayana", duration: "3:10:00", mood: "Alliance", color: "from-rose-600 to-red-500", videoId: "yLNGxuFTPYc" },
  { id: "r5", title: "Sundara Kanda", artist: "Ramayana Audiobook", category: "Ramayana", duration: "3:30:00", mood: "Courageous", color: "from-pink-600 to-rose-500", videoId: "iR8aFv-nLvg" },
  { id: "r6", title: "Yuddha Kanda", artist: "Ramayana Audiobook", category: "Ramayana", duration: "5:20:00", mood: "Heroic", color: "from-fuchsia-600 to-pink-500", videoId: "j5iMrGfv5MA" },
  { id: "r7", title: "Uttara Kanda", artist: "Ramayana Audiobook", category: "Ramayana", duration: "3:00:00", mood: "Concluding", color: "from-purple-600 to-fuchsia-500", videoId: "pKf-51ZSVB8" },

  // ── Hanuman Bhajans ──
  { id: "h1", title: "Hanuman Chalisa", artist: "Hariharan", category: "Hanuman Bhajans", duration: "8:42", mood: "Courageous", color: "from-orange-600 to-red-500", videoId: "AETFvQonfhc" },
  { id: "h2", title: "Bajrang Baan", artist: "Hariharan", category: "Hanuman Bhajans", duration: "7:46", mood: "Powerful", color: "from-red-600 to-rose-500", videoId: "h1lT6cxwsPw" },
  { id: "h3", title: "Hanuman Ashtak", artist: "Arvinder Singh", category: "Hanuman Bhajans", duration: "8:00", mood: "Devotional", color: "from-amber-600 to-orange-500", videoId: "ZxpRLfstDfA" },
  { id: "h4", title: "Sankat Mochan Hanumanashtak", artist: "Narendra Chanchal", category: "Hanuman Bhajans", duration: "9:30", mood: "Protective", color: "from-rose-600 to-red-500", videoId: "aWSJn2xB1FU" },
  { id: "h5", title: "Hanuman Aarti", artist: "Hariharan", category: "Hanuman Bhajans", duration: "4:30", mood: "Sacred", color: "from-yellow-600 to-amber-500", videoId: "sS7UcKNEaqg" },
  { id: "h6", title: "Jai Hanuman Gyan Gun Sagar", artist: "Devotional", category: "Hanuman Bhajans", duration: "8:00", mood: "Celebratory", color: "from-orange-500 to-yellow-500", videoId: "HxZUtzV4CT0" },
  { id: "h7", title: "Ram Lakhan Janaki Jai Bolo Hanuman Ki", artist: "Lakhbir Singh Lakkha", category: "Hanuman Bhajans", duration: "6:30", mood: "Joyful", color: "from-pink-600 to-orange-500", videoId: "irIBDF4PIyY" },
  { id: "h8", title: "Mangal Murti Maruti Nandan", artist: "Devotional", category: "Hanuman Bhajans", duration: "5:45", mood: "Blessed", color: "from-amber-500 to-red-500", videoId: "tuq8_8PBqxg" },
  { id: "h9", title: "Hanuman Bhujang Stotram", artist: "Sacred Chants", category: "Hanuman Bhajans", duration: "7:00", mood: "Majestic", color: "from-red-500 to-amber-500", videoId: "9vv8OHq_yrY" },
  { id: "h10", title: "Veer Hanumana Ati Balwana", artist: "Devotional", category: "Hanuman Bhajans", duration: "5:00", mood: "Fearless", color: "from-orange-600 to-rose-500", videoId: "iuCzp8De6GY" },
  { id: "h11", title: "Pawanputra Hanuman", artist: "Devotional", category: "Hanuman Bhajans", duration: "6:15", mood: "Inspiring", color: "from-rose-500 to-orange-500", videoId: "pX6paHO1Orw" },
  { id: "h12", title: "Shri Hanuman Vandana", artist: "Devotional", category: "Hanuman Bhajans", duration: "5:30", mood: "Reverent", color: "from-yellow-500 to-orange-500", videoId: "nLalwUEhdxg" },
];

export const CATEGORIES = [
  "All",
  "Shlokas",
  "Bhagavad Gita",
  "Ramayana",
  "Hanuman Bhajans",
  "Uplifting Phonk",
  "Ambient",
  "Meditation",
  "Nature",
];

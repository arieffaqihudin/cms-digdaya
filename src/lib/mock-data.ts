export interface Video {
  id: string;
  thumbnail: string;
  title: string;
  channel: string;
  publishDate: string;
  aiSuggestion: string;
  status: "need_review" | "published" | "rejected" | "draft";
  category?: string;
  tags?: string[];
  description?: string;
  youtubeUrl?: string;
  displayTitle?: string;
  shortDescription?: string;
  organizationLevel?: string;
  relatedFigure?: string;
  featured?: boolean;
  showOnHomepage?: boolean;
  editorNotes?: string;
  rejectReason?: string;
}

export interface Guide {
  id: string;
  title: string;
  relatedProduct: string;
  category: string;
  status: "draft" | "published" | "archived";
  lastUpdated: string;
  content?: string;
  summary?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer?: string;
  relatedProduct: string;
  category: string;
  status: "draft" | "published" | "archived";
  order: number;
}

export interface BlogPost {
  id: string;
  coverImage: string;
  title: string;
  author: string;
  publishDate: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

export type ContentType = "video" | "guide" | "faq" | "blog";

export const channels = ["NU Online", "TVNU", "NU Channel", "Lazisnu TV", "PCINU"];

export const categories = [
  "Dakwah", "Pendidikan", "Sosial", "Budaya", "Organisasi",
  "Kesehatan", "Ekonomi", "Keagamaan", "Berita", "Talkshow"
];

export const tags = [
  "Ramadhan", "Muktamar", "PBNU", "Kiai", "Pesantren",
  "Zakat", "Harlah", "Istighotsah", "Sholawat", "Kajian"
];

export const products = [
  "Digdaya Persuratan",
  "Digdaya Kepengurusan",
  "Digdaya Pesantren",
  "Portal Pesantren NU",
  "Digdaya Kader",
  "Digdaya Health",
  "Digdaya Masjid",
  "Digdaya Dakwah",
];

export const mockVideos: Video[] = [
  {
    id: "v1",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Khutbah Jumat: Keutamaan Bulan Ramadhan - KH. Said Aqil Siroj",
    channel: "NU Online",
    publishDate: "2026-03-19",
    aiSuggestion: "Dakwah",
    status: "need_review",
    description: "Khutbah Jumat yang membahas tentang keutamaan bulan Ramadhan.",
    youtubeUrl: "https://youtube.com/watch?v=example1",
    category: "Dakwah",
    tags: ["Ramadhan", "Kajian"],
  },
  {
    id: "v2",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Diskusi Panel: Moderasi Beragama dalam Perspektif NU",
    channel: "TVNU",
    publishDate: "2026-03-18",
    aiSuggestion: "Pendidikan",
    status: "need_review",
    description: "Panel diskusi moderasi beragama dari sudut pandang Nahdlatul Ulama.",
    youtubeUrl: "https://youtube.com/watch?v=example2",
  },
  {
    id: "v3",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Harlah NU ke-103: Rangkaian Acara dan Perayaan",
    channel: "NU Online",
    publishDate: "2026-03-17",
    aiSuggestion: "Organisasi",
    status: "published",
    displayTitle: "Perayaan Harlah NU ke-103",
    category: "Organisasi",
    tags: ["Harlah", "PBNU"],
  },
  {
    id: "v4",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Talkshow: Peran Pesantren dalam Pendidikan Modern",
    channel: "NU Channel",
    publishDate: "2026-03-17",
    aiSuggestion: "Pendidikan",
    status: "published",
    displayTitle: "Pesantren & Pendidikan Modern",
    category: "Pendidikan",
    tags: ["Pesantren", "Kajian"],
  },
  {
    id: "v5",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Istighotsah Kubro PBNU - Live Streaming",
    channel: "TVNU",
    publishDate: "2026-03-16",
    aiSuggestion: "Keagamaan",
    status: "need_review",
    youtubeUrl: "https://youtube.com/watch?v=example5",
  },
  {
    id: "v6",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Kajian Kitab Kuning: Riyadhus Shalihin",
    channel: "NU Online",
    publishDate: "2026-03-16",
    aiSuggestion: "Dakwah",
    status: "draft",
    youtubeUrl: "https://youtube.com/watch?v=example6",
  },
  {
    id: "v7",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Berita: Hasil Munas Alim Ulama NU 2026",
    channel: "NU Online",
    publishDate: "2026-03-15",
    aiSuggestion: "Berita",
    status: "rejected",
    rejectReason: "Duplicate content",
  },
  {
    id: "v8",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Sholawat Nabi - Habib Syech bin Abdul Qadir Assegaf",
    channel: "Lazisnu TV",
    publishDate: "2026-03-15",
    aiSuggestion: "Keagamaan",
    status: "published",
    displayTitle: "Sholawat Nabi - Habib Syech",
    category: "Keagamaan",
    tags: ["Sholawat"],
  },
];

export const mockGuides: Guide[] = [
  { id: "g1", title: "Cara Mendaftar Akun Digdaya", relatedProduct: "Digdaya App", category: "Pendidikan", status: "published", lastUpdated: "2026-03-20", summary: "Panduan lengkap cara mendaftar akun di aplikasi Digdaya." },
  { id: "g2", title: "Panduan Zakat Fitrah Online", relatedProduct: "Lazisnu Platform", category: "Sosial", status: "published", lastUpdated: "2026-03-19" },
  { id: "g3", title: "Cara Menonton Live Streaming TVNU", relatedProduct: "TVNU Streaming", category: "Pendidikan", status: "draft", lastUpdated: "2026-03-18" },
  { id: "g4", title: "Panduan Donasi melalui NU Care", relatedProduct: "NU Care", category: "Sosial", status: "published", lastUpdated: "2026-03-17" },
  { id: "g5", title: "Menggunakan Fitur Pencarian di NU Online", relatedProduct: "NU Online Web", category: "Pendidikan", status: "archived", lastUpdated: "2026-03-15" },
  { id: "g6", title: "Panduan Pesantren Digital", relatedProduct: "Digdaya App", category: "Pendidikan", status: "draft", lastUpdated: "2026-03-14" },
];

export const mockFAQs: FAQItem[] = [
  { id: "f1", question: "Bagaimana cara mendaftar di Digdaya?", relatedProduct: "Digdaya App", category: "Pendidikan", status: "published", order: 1, answer: "Unduh aplikasi Digdaya, lalu klik tombol Daftar." },
  { id: "f2", question: "Apakah zakat bisa dibayar online?", relatedProduct: "Lazisnu Platform", category: "Sosial", status: "published", order: 2 },
  { id: "f3", question: "Bagaimana cara menonton live streaming?", relatedProduct: "TVNU Streaming", category: "Pendidikan", status: "published", order: 3 },
  { id: "f4", question: "Apa saja fitur utama NU Online?", relatedProduct: "NU Online Web", category: "Berita", status: "draft", order: 4 },
  { id: "f5", question: "Bagaimana cara donasi melalui NU Care?", relatedProduct: "NU Care", category: "Sosial", status: "published", order: 5 },
  { id: "f6", question: "Apakah Digdaya tersedia di iOS?", relatedProduct: "Digdaya App", category: "Pendidikan", status: "archived", order: 6 },
];

export const mockBlogs: BlogPost[] = [
  { id: "b1", coverImage: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg", title: "Refleksi Ramadhan: Memaknai Bulan Suci", author: "Ahmad Fauzi", publishDate: "2026-03-20", status: "published", featured: true, category: "Dakwah", tags: ["Ramadhan"], excerpt: "Bulan Ramadhan merupakan momen yang sangat istimewa bagi umat Islam." },
  { id: "b2", coverImage: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg", title: "Peran NU dalam Moderasi Beragama", author: "Siti Aminah", publishDate: "2026-03-19", status: "published", featured: false, category: "Organisasi" },
  { id: "b3", coverImage: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg", title: "Digitalisasi Pesantren: Tantangan dan Peluang", author: "M. Rizki", publishDate: "2026-03-18", status: "draft", featured: false, category: "Pendidikan", tags: ["Pesantren"] },
  { id: "b4", coverImage: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg", title: "Zakat dan Kesejahteraan Umat", author: "Nur Hidayah", publishDate: "2026-03-17", status: "published", featured: true, category: "Sosial", tags: ["Zakat"] },
  { id: "b5", coverImage: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg", title: "Tradisi Sholawatan di Nusantara", author: "KH. Abdul Majid", publishDate: "2026-03-16", status: "draft", featured: false, category: "Budaya", tags: ["Sholawat"] },
];

export const dashboardStats = {
  videosNeedReview: 42,
  totalGuides: 128,
  totalFAQs: 86,
  blogDrafts: 15,
};

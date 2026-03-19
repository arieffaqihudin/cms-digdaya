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

export const channels = ["NU Online", "TVNU", "NU Channel", "Lazisnu TV", "PCINU"];

export const categories = [
  "Dakwah", "Pendidikan", "Sosial", "Budaya", "Organisasi",
  "Kesehatan", "Ekonomi", "Keagamaan", "Berita", "Talkshow"
];

export const tags = [
  "Ramadhan", "Muktamar", "PBNU", "Kiai", "Pesantren",
  "Zakat", "Harlah", "Istighotsah", "Sholawat", "Kajian"
];

export const mockVideos: Video[] = [
  {
    id: "1",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Khutbah Jumat: Keutamaan Bulan Ramadhan - KH. Said Aqil Siroj",
    channel: "NU Online",
    publishDate: "2026-03-19",
    aiSuggestion: "Dakwah",
    status: "need_review",
    description: "Khutbah Jumat yang membahas tentang keutamaan bulan Ramadhan dan amalan-amalan yang dianjurkan selama bulan suci.",
    youtubeUrl: "https://youtube.com/watch?v=example1",
    category: "Dakwah",
    tags: ["Ramadhan", "Kajian"],
  },
  {
    id: "2",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Diskusi Panel: Moderasi Beragama dalam Perspektif NU",
    channel: "TVNU",
    publishDate: "2026-03-18",
    aiSuggestion: "Pendidikan",
    status: "need_review",
    description: "Panel diskusi yang membahas konsep moderasi beragama dari sudut pandang Nahdlatul Ulama.",
    youtubeUrl: "https://youtube.com/watch?v=example2",
  },
  {
    id: "3",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Harlah NU ke-103: Rangkaian Acara dan Perayaan di Seluruh Indonesia",
    channel: "NU Online",
    publishDate: "2026-03-17",
    aiSuggestion: "Organisasi",
    status: "published",
    displayTitle: "Perayaan Harlah NU ke-103",
    category: "Organisasi",
    tags: ["Harlah", "PBNU"],
  },
  {
    id: "4",
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
    id: "5",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Istighotsah Kubro PBNU - Live Streaming",
    channel: "TVNU",
    publishDate: "2026-03-16",
    aiSuggestion: "Keagamaan",
    status: "need_review",
    description: "Siaran langsung acara Istighotsah Kubro yang diselenggarakan oleh PBNU.",
    youtubeUrl: "https://youtube.com/watch?v=example5",
  },
  {
    id: "6",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Kajian Kitab Kuning: Riyadhus Shalihin - Bab Taubat",
    channel: "NU Online",
    publishDate: "2026-03-16",
    aiSuggestion: "Dakwah",
    status: "draft",
    description: "Pengajian kitab kuning Riyadhus Shalihin membahas bab tentang taubat.",
    youtubeUrl: "https://youtube.com/watch?v=example6",
  },
  {
    id: "7",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Berita: Hasil Munas Alim Ulama NU 2026",
    channel: "NU Online",
    publishDate: "2026-03-15",
    aiSuggestion: "Berita",
    status: "rejected",
    rejectReason: "Duplicate content",
  },
  {
    id: "8",
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
  {
    id: "9",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Zakat Fitrah: Panduan Lengkap dari Lazisnu",
    channel: "Lazisnu TV",
    publishDate: "2026-03-14",
    aiSuggestion: "Sosial",
    status: "need_review",
  },
  {
    id: "10",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "PCINU Jepang: Kegiatan Ramadhan Warga NU di Tokyo",
    channel: "PCINU",
    publishDate: "2026-03-14",
    aiSuggestion: "Organisasi",
    status: "need_review",
  },
];

export const dashboardStats = {
  crawledToday: 12,
  needReview: 42,
  published: 156,
  rejected: 8,
};

/* Static mock data — the blueprint's worked example (₹2L/month Silver dealer on the Gold track). */

export interface Product {
  id: string;
  code: string;
  name: string;
  img: string;
  dealer: number;
  mrp: number;
  carton: number;
  moq: number;
  tag?: string;
  cat: 'arm' | 'chair' | 'stool';
}

export const PRODUCTS: Product[] = [
  { id: 'maharaja', code: 'SGF-8855', name: 'Maharaja Tufted Armchair', img: 'dsc09058', dealer: 812, mrp: 1399, carton: 4, moq: 8, tag: 'Hero', cat: 'arm' },
  { id: 'royal', code: 'SGF-8820', name: 'Royal Executive Armchair', img: 'dsc09078', dealer: 745, mrp: 1249, carton: 4, moq: 8, cat: 'arm' },
  { id: 'rattan', code: 'SGF-8812', name: 'Rattan Weave Armchair', img: 'dsc09079', dealer: 698, mrp: 1149, carton: 4, moq: 8, cat: 'arm' },
  { id: 'palm', code: 'SGF-8806', name: 'Palm High-Back Armchair', img: 'dsc09060', dealer: 645, mrp: 1049, carton: 6, moq: 12, cat: 'arm' },
  { id: 'sonet', code: 'SGF-4410', name: 'Sonet Armless Chair', img: 'dsc09044', dealer: 338, mrp: 579, carton: 8, moq: 16, cat: 'chair' },
  { id: 'heritage', code: 'SGF-9901', name: 'Heritage Storage Stool', img: 'dsc09048', dealer: 960, mrp: 1599, carton: 4, moq: 4, tag: '2× SP', cat: 'stool' },
];

export const productImg = (p: { img: string }) => `assets/products/${p.img}.jpg`;

export const CAT_DEFS: Array<[string, string]> = [
  ['all', 'All models'],
  ['arm', 'Armchairs'],
  ['chair', 'Chairs'],
  ['stool', 'Stools'],
];

export interface RewardItem {
  icon: string;
  name: string;
  sub: string;
  cost: number;
  group: number;
}

export const REWARDS: RewardItem[] = [
  { icon: 'receipt-indian-rupee', name: '₹500 credit note', sub: 'Auto-applies to next invoice', cost: 2000, group: 0 },
  { icon: 'receipt-indian-rupee', name: '₹1,000 credit note', sub: 'Auto-applies to next invoice', cost: 4000, group: 0 },
  { icon: 'receipt-indian-rupee', name: '₹5,000 credit note', sub: 'Auto-applies to next invoice', cost: 20000, group: 0 },
  { icon: 'calendar-plus', name: 'Extra 7 credit days', sub: 'One invoice of your choice', cost: 1500, group: 1 },
  { icon: 'truck', name: 'Priority dispatch token', sub: 'Jump the queue once', cost: 2500, group: 1 },
  { icon: 'sticker', name: 'Branding pack — 50 stickers', sub: 'Shop + product stickers', cost: 1800, group: 1 },
  { icon: 'lamp', name: 'Glow sign board', sub: '3×2 ft, installed', cost: 9500, group: 2 },
  { icon: 'coins', name: 'Silver coin — 5g', sub: '999 purity, gift boxed', cost: 14500, group: 2 },
  { icon: 'watch', name: 'Smartwatch', sub: 'Fulfilled in 14 days', cost: 9200, group: 2 },
];

export const REWARD_GROUPS = [
  { label: 'Credit notes', note: 'most popular' },
  { label: 'Business boosters', note: 'run the shop better' },
  { label: 'Shop assets & lifestyle', note: 'fulfilled in 14 days' },
];

export interface HistoryEntry {
  icon: string;
  text: string;
  date: string;
}

export const BASE_HISTORY: HistoryEntry[] = [
  { icon: 'receipt-indian-rupee', text: '₹1,000 credit note — applied to INV-2231', date: '02 Jun' },
  { icon: 'sticker', text: 'Branding pack — delivered', date: '14 May' },
];

export const INVOICES = [
  { no: 'INV-2262', date: '28 Jun', sub: 'Due 10 Jul · pay early for +540 SP', amount: '₹86,400', status: 'Unpaid', chipBg: 'var(--amber-50)', chipColor: 'var(--amber-600)' },
  { no: 'INV-2231', date: '14 Jun', sub: 'Paid on time · +706 SP credited', amount: '₹64,200', status: 'Paid', chipBg: 'var(--green-50)', chipColor: 'var(--green-600)' },
  { no: 'INV-2204', date: '02 Jun', sub: 'Paid on time · +575 SP credited', amount: '₹52,300', status: 'Paid', chipBg: 'var(--green-50)', chipColor: 'var(--green-600)' },
  { no: 'INV-2188', date: '19 May', sub: 'Paid early · +1,196 SP incl. bonus', amount: '₹1,08,750', status: 'Paid', chipBg: 'var(--green-50)', chipColor: 'var(--green-600)' },
];

export interface LbRow {
  rank: number;
  name: string;
  city: string;
  sp: number;
  you?: boolean;
}

export const LB_DISTRICT: LbRow[] = [
  { rank: 1, name: 'Bansal Furniture', city: 'Khanna', sp: 4820 },
  { rank: 2, name: 'New Punjab Traders', city: 'Ludhiana', sp: 4410 },
  { rank: 3, name: 'Sethi & Sons', city: 'Jagraon', sp: 3820 },
  { rank: 4, name: 'Gupta Furniture House', city: 'Ludhiana · you', sp: 3450, you: true },
  { rank: 5, name: 'Mittal Agencies', city: 'Samrala', sp: 3120 },
  { rank: 6, name: 'Kalsi Home Store', city: 'Raikot', sp: 2870 },
];

export const LB_STATE: LbRow[] = [
  { rank: 1, name: 'Amritsar Furniture Mart', city: 'Amritsar', sp: 6240 },
  { rank: 2, name: 'Doaba Traders', city: 'Jalandhar', sp: 5910 },
  { rank: 3, name: 'Bansal Furniture', city: 'Khanna', sp: 4820 },
  { rank: 4, name: 'Patiala Home Needs', city: 'Patiala', sp: 4650 },
  { rank: 5, name: 'New Punjab Traders', city: 'Ludhiana', sp: 4410 },
  { rank: 23, name: 'Gupta Furniture House', city: 'Ludhiana · you', sp: 3450, you: true },
];

export const BADGES = [
  { icon: 'package-check', name: 'First Order', sub: 'May 2025', earned: true },
  { icon: 'qr-code', name: 'Pehla Scan', sub: 'Jun 2025', earned: true },
  { icon: 'flame', name: 'Streak Veteran', sub: '6-month streak', earned: true },
  { icon: 'sparkles', name: 'Festival Hero', sub: 'Diwali 2025', earned: true },
  { icon: 'truck', name: 'Truck Master', sub: 'First full truck', earned: false },
  { icon: 'crown', name: '8855 Champion', sub: '100+ Maharaja units', earned: false },
  { icon: 'users', name: 'Referral Star', sub: '3 referrals', earned: false },
  { icon: 'gem', name: 'Jackpot Winner', sub: '2,000 SP scratch', earned: false },
  { icon: 'trophy', name: 'District Champion', sub: 'Win a month', earned: false },
];

export const ORDER_STEPS = [
  { icon: 'check', title: 'Confirmed', sub: '02 Jul · by Suresh (sales)', state: 'done' as const },
  { icon: 'check', title: 'Packed', sub: '03 Jul · 78 cartons, QR serialised', state: 'done' as const },
  { icon: 'truck', title: 'Dispatched', sub: 'PB-10-AT-4483 · LR 88231 · ETA Tue', state: 'current' as const },
  { icon: 'package', title: 'Delivered', sub: 'Scan cartons on arrival → +SP', state: 'todo' as const },
];

export const PAST_ORDERS = [
  { no: 'ORD-1131', date: '14 Jun', sub: '280 pcs · ₹1,86,300 · delivered', sp: '+706 SP' },
  { no: 'ORD-1118', date: '02 Jun', sub: '224 pcs · ₹1,52,600 · delivered', sp: '+575 SP' },
  { no: 'ORD-1102', date: '19 May', sub: '390 pcs · ₹2,64,200 · full truck', sp: '+1,196 SP' },
];

export const MEDIA_ITEMS = [
  { name: 'Maharaja poster', sub: 'A3 print + story size', img: 'dsc09058' },
  { name: 'Strength demo reel', sub: '150 kg load test · 22 sec', img: 'dsc09043' },
  { name: 'Monsoon offer post', sub: 'WhatsApp status size', img: 'dsc09053' },
  { name: 'Trade price list', sub: 'PDF · July 2026', img: 'dsc09078' },
];

export const NOTIFS = [
  { icon: 'coins', title: '+706 SP credited', sub: 'INV-2231 reconciled as paid. Scratch card unlocked.', time: '2h', tileBg: 'var(--orange-50)', iconColor: '#E0790C' },
  { icon: 'truck', title: 'ORD-1147 dispatched', sub: 'Truck PB-10-AT-4483 · LR 88231 · ETA Tuesday.', time: '5h', tileBg: 'var(--blue-50)', iconColor: '#0A52B4' },
  { icon: 'timer', title: 'Mission ends in 25 days', sub: 'Heritage Stool 2× SP — 64 of 200 units done.', time: '1d', tileBg: 'var(--blue-50)', iconColor: '#0A52B4' },
  { icon: 'alarm-clock', title: '1,150 SP expire 31 Aug', sub: 'Redeem before expiry — a ₹500 credit note is 2,000 SP.', time: '2d', tileBg: 'var(--amber-50)', iconColor: '#C9821A' },
  { icon: 'trophy', title: 'You moved to #4 in Ludhiana', sub: '370 SP behind Sethi & Sons. One order changes it.', time: '3d', tileBg: 'var(--green-50)', iconColor: '#168049' },
];

export const TIER_ROWS = [
  { label: 'SP multiplier', silver: '1.1×', gold: '1.2×' },
  { label: 'Dispatch', silver: 'Standard', gold: 'Priority queue' },
  { label: 'Credit days', silver: '+7 days', gold: '+15 days' },
  { label: 'Designs', silver: '—', gold: 'Early access' },
  { label: 'Annual reward', silver: 'Diwali gift+', gold: 'Factory visit + founder dinner' },
];

export const POLL_COLORS: Array<[string, string, string]> = [
  ['maroon', '#7A1F2B', 'Maroon'],
  ['leaf', '#3E9B4F', 'Leaf'],
  ['teal', '#128A86', 'Teal'],
  ['marigold', '#F4A81D', 'Marigold'],
];

/* Admin panel mock data — supports the three demo scenarios from the design
   (steady / pilot / cap-breach, switchable via ?scenario= query param). */

export type Scenario = 'steady' | 'pilot' | 'cap-breach';

export const NAV_DEFS: Array<[string, string, string, number]> = [
  ['dashboard', 'layout-dashboard', 'Dashboard', 0],
  ['dealers', 'users', 'Dealers & KYC', 3],
  ['missions', 'target', 'Missions', 0],
  ['rewardsq', 'gift', 'Reward fulfilment', 5],
  ['recon', 'receipt-indian-rupee', 'Reconciliation', 4],
  ['broadcast', 'megaphone', 'Broadcast', 0],
];

export const VIEW_TITLES: Record<string, string> = {
  dashboard: 'Programme dashboard',
  dealers: 'Dealers & KYC',
  missions: 'Mission builder',
  rewardsq: 'Reward fulfilment',
  recon: 'Points reconciliation',
  broadcast: 'Broadcast composer',
};

export interface Stat {
  icon: string;
  label: string;
  value: string;
  delta: string;
  deltaColor: string;
}

export const STATS_BY: Record<Scenario, Stat[]> = {
  steady: [
    { icon: 'users', label: 'App-active dealers', value: '312 / 368', delta: '85% adoption · target met', deltaColor: 'var(--status-success)' },
    { icon: 'repeat', label: '45-day repeat rate', value: '68%', delta: '+11 pts vs pre-app', deltaColor: 'var(--status-success)' },
    { icon: 'timer', label: 'On-time payment', value: '74%', delta: '+18 pts — the sleeper win', deltaColor: 'var(--status-success)' },
    { icon: 'qr-code', label: 'Carton scans / week', value: '8,420', delta: '61% of dispatched cartons', deltaColor: 'var(--text-muted)' },
  ],
  pilot: [
    { icon: 'users', label: 'Pilot dealers onboard', value: '15 / 15', delta: 'founding members · manual bridge', deltaColor: 'var(--status-success)' },
    { icon: 'repeat', label: '45-day repeat rate', value: '54%', delta: '+4 pts vs baseline', deltaColor: 'var(--status-success)' },
    { icon: 'timer', label: 'On-time payment', value: '61%', delta: '+7 pts in 6 weeks', deltaColor: 'var(--status-success)' },
    { icon: 'qr-code', label: 'Carton scans / week', value: '1,240', delta: 'QR pilot on 2 SKUs', deltaColor: 'var(--text-muted)' },
  ],
  'cap-breach': [
    { icon: 'users', label: 'App-active dealers', value: '341 / 368', delta: '93% adoption', deltaColor: 'var(--status-success)' },
    { icon: 'repeat', label: '45-day repeat rate', value: '71%', delta: '+14 pts vs pre-app', deltaColor: 'var(--status-success)' },
    { icon: 'flame', label: 'Programme cost', value: '1.31%', delta: 'OVER CAP — trim festival multiplier', deltaColor: 'var(--status-danger)' },
    { icon: 'coins', label: 'SP burn this month', value: '4.9L SP', delta: '+38% MoM · scratch odds under review', deltaColor: 'var(--amber-600)' },
  ],
};

export const COST_SERIES: Record<Scenario, number[]> = {
  steady: [0.82, 1.14, 0.96, 1.02, 1.21, 1.08],
  pilot: [0.31, 0.44, 0.52, 0.61, 0.68, 0.72],
  'cap-breach': [0.96, 1.02, 1.14, 1.21, 1.28, 1.31],
};

export const COST_MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export interface Activity {
  icon: string;
  text: string;
  time: string;
  bg: string;
  color: string;
}

export const ACTIVITY: Activity[] = [
  { icon: 'coins', text: 'Gupta Furniture House collected a 250 SP scratch card', time: 'now', bg: 'var(--orange-50)', color: '#E0790C' },
  { icon: 'arrow-up-right', text: 'Sethi & Sons redeemed ₹5,000 credit note (20,000 SP)', time: '12m', bg: 'var(--blue-50)', color: '#0A52B4' },
  { icon: 'user-plus', text: 'Referral: Kalsi Home Store → new dealer in Raikot', time: '1h', bg: 'var(--green-50)', color: '#168049' },
  { icon: 'qr-code', text: '78 cartons scanned against INV-2231, Ludhiana', time: '2h', bg: 'var(--blue-50)', color: '#0A52B4' },
  { icon: 'trending-up', text: 'Bansal Furniture crossed ₹15L — Gold review queued', time: '4h', bg: 'var(--orange-50)', color: '#E0790C' },
];

export const BREACH_ALERT: Activity = {
  icon: 'alert-triangle',
  text: 'ALERT: programme cost crossed the 1.25% cap — burn review required before the next mission',
  time: 'now',
  bg: 'var(--red-50)',
  color: '#C5363B',
};

export const PENDING_DEFS = [
  { id: 'p1', initials: 'HS', name: 'Harjit Singh Furniture', sub: 'Moga · referred by Mittal Agencies · GSTIN 03AAECH…', ref: true },
  { id: 'p2', initials: 'OM', name: 'Om Traders', sub: 'Bathinda · walk-in via sales team · GSTIN 03AAACO…', ref: false },
  { id: 'p3', initials: 'DK', name: 'Deep Karya Home', sub: 'Patiala · referred by Patiala Home Needs · GSTIN 03AAFCD…', ref: true },
];

export const TIER_STYLE: Record<string, { bg: string; color: string }> = {
  Maha: { bg: 'var(--blue-900)', color: '#FFD68C' },
  Gold: { bg: 'var(--orange-50)', color: 'var(--brand-accent-strong)' },
  Silver: { bg: 'var(--blue-50)', color: 'var(--brand-primary)' },
  Sathi: { bg: 'var(--slate-100)', color: 'var(--slate-600)' },
};

export const DEALERS = [
  { name: 'Amritsar Furniture Mart', district: 'Amritsar', tier: 'Maha', billing: '₹41.2L', sp: '38,410', last: '2 days ago' },
  { name: 'Bansal Furniture', district: 'Ludhiana', tier: 'Gold', billing: '₹14.9L', sp: '31,205', last: 'today' },
  { name: 'Sethi & Sons', district: 'Ludhiana', tier: 'Gold', billing: '₹16.3L', sp: '12,830', last: 'today' },
  { name: 'Gupta Furniture House', district: 'Ludhiana', tier: 'Silver', billing: '₹13.7L', sp: '24,380', last: 'today' },
  { name: 'Mittal Agencies', district: 'Ludhiana', tier: 'Silver', billing: '₹9.4L', sp: '18,960', last: '5 days ago' },
  { name: 'Kalsi Home Store', district: 'Ludhiana', tier: 'Sathi', billing: '₹4.1L', sp: '6,240', last: '12 days ago' },
];

export const LIVE_MISSIONS = [
  { icon: 'rocket', title: 'Heritage Stool launch — 2× SP', sub: 'SGF-9901 · all tiers', reward: '2× SP', pct: '32%', uptake: '6,400 units · 214 dealers active', ends: 'ends 31 Jul' },
  { icon: 'wallet', title: 'Early payment fortnight', sub: 'Pay before the 10th', reward: '+25% SP', pct: '58%', uptake: '171 invoices cleared early', ends: 'ends 10 Aug' },
  { icon: 'camera', title: 'Display photo of the month', sub: 'One approved photo', reward: '+100 SP', pct: '44%', uptake: '162 photos approved', ends: 'ends 31 Jul' },
];

export const MISSION_TYPES: Array<[string, string]> = [
  ['sku', 'SKU push'],
  ['payment', 'Payment'],
  ['display', 'Display'],
  ['truck', 'Full truck'],
];

export const BUILDER_COPY: Record<string, { goal: string; reward: string }> = {
  sku: { goal: 'Order 200 units of Sonet (SGF-4410) this month', reward: '2× SP on model' },
  payment: { goal: 'Clear all invoices before due date in August', reward: '+30% bonus SP' },
  display: { goal: 'Best decorated SGF corner — photo entry', reward: '5,000 SP prize' },
  truck: { goal: 'Place one full-truck order (380+ pcs)', reward: '+500 SP flat' },
};

export const QUEUE_DEFS = [
  { id: 'q1', reward: '₹5,000 credit note', dealer: 'Sethi & Sons · Jagraon', sp: '20,000', date: 'today' },
  { id: 'q2', reward: 'Silver coin — 5g', dealer: 'Bansal Furniture · Khanna', sp: '14,500', date: 'yesterday' },
  { id: 'q3', reward: 'Glow sign board', dealer: 'Mittal Agencies · Samrala', sp: '9,500', date: '02 Jul' },
  { id: 'q4', reward: 'Priority dispatch token', dealer: 'New Punjab Traders', sp: '2,500', date: '01 Jul' },
  { id: 'q5', reward: 'Branding pack — 50 stickers', dealer: 'Kalsi Home Store · Raikot', sp: '1,800', date: '28 Jun' },
];

export const RECON_DEFS = [
  { id: 'r1', no: 'INV-2231', dealer: 'Gupta Furniture House', value: '₹64,200', paid: '04 Jul', sp: '+706 SP' },
  { id: 'r2', no: 'INV-2258', dealer: 'Bansal Furniture', value: '₹1,12,400', paid: '04 Jul', sp: '+1,461 SP' },
  { id: 'r3', no: 'INV-2260', dealer: 'Doaba Traders', value: '₹86,900', paid: '03 Jul', sp: '+1,043 SP' },
  { id: 'r4', no: 'INV-2249', dealer: 'Patiala Home Needs', value: '₹58,300', paid: '03 Jul', sp: '+641 SP' },
];

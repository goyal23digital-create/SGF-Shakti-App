import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { LANG_ORDER, T, type Lang, type Strings } from './i18n';
import { BASE_HISTORY, PRODUCTS, type HistoryEntry, type RewardItem } from './data';

export type Screen =
  | 'login'
  | 'home'
  | 'shop'
  | 'rewards'
  | 'ledger'
  | 'leaderboard'
  | 'scan'
  | 'orders'
  | 'media'
  | 'support'
  | 'notifs'
  | 'more';

export interface Toast {
  title: string;
  sub: string;
}

export interface ConfettiPiece {
  left: number;
  delay: number;
  dur: number;
  size: number;
  color: string;
  round: boolean;
}

export interface Store {
  lang: Lang;
  t: Strings;
  setLang: (l: Lang) => void;
  cycleLang: () => void;

  screen: Screen;
  nav: (s: Screen) => void;
  setTab: (s: Screen) => void;
  goBack: () => void;
  logout: () => void;
  scrollRef: (el: HTMLDivElement | null) => void;

  otpStage: boolean;
  getOtp: () => void;
  verifyOtp: () => void;

  sp: number;
  spShown: number;
  progressOn: boolean;
  festival: boolean;

  cart: Record<string, number>;
  cartCount: number;
  cartTotal: number;
  cartSp: number;
  inc: (id: string) => void;
  dec: (id: string) => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  orderPlaced: boolean;
  placeOrder: () => void;
  trackOrder: () => void;

  cat: string;
  setCat: (c: string) => void;

  scratchOpen: boolean;
  scratchDone: boolean;
  scratchUsed: boolean;
  openScratch: () => void;
  closeScratch: () => void;
  collectScratch: () => void;
  markScratchDone: () => void;
  confetti: ConfettiPiece[] | null;

  toast: Toast | null;
  showToast: (title: string, sub: string) => void;

  lbTab: 'district' | 'state';
  setLbTab: (t: 'district' | 'state') => void;

  scans: number;
  simulateScan: () => void;

  votedColor: string | null;
  pickColor: (id: string, label: string) => void;

  redeemItem: RewardItem | null;
  openRedeem: (r: RewardItem) => void;
  cancelRedeem: () => void;
  confirmRedeem: () => void;
  historyExtra: HistoryEntry[];
}

const Ctx = createContext<Store | null>(null);

export function useApp(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useApp outside provider');
  return s;
}

const CONFETTI_COLORS = ['#F7941D', '#FFBA1F', '#0E63D6', '#5EA1FB', '#1E9E5A', '#FFD68C'];

export function AppProvider({
  children,
  startAtLogin = false,
  festival = false,
}: {
  children: ReactNode;
  startAtLogin?: boolean;
  festival?: boolean;
}) {
  const [lang, setLang] = useState<Lang>('en');
  const [screen, setScreen] = useState<Screen>(startAtLogin ? 'login' : 'home');
  const [stack, setStack] = useState<Screen[]>([]);
  const [otpStage, setOtpStage] = useState(false);
  const [sp, setSp] = useState(24380);
  const [spShown, setSpShown] = useState(0);
  const [progressOn, setProgressOn] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [cat, setCat] = useState('all');
  const [scratchOpen, setScratchOpen] = useState(false);
  const [scratchDone, setScratchDone] = useState(false);
  const [scratchUsed, setScratchUsed] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[] | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [lbTab, setLbTab] = useState<'district' | 'state'>('district');
  const [scans, setScans] = useState(42);
  const [votedColor, setVotedColor] = useState<string | null>(null);
  const [redeemItem, setRedeemItem] = useState<RewardItem | null>(null);
  const [historyExtra, setHistoryExtra] = useState<HistoryEntry[]>([]);

  const rafRef = useRef<number | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spShownRef = useRef(0);
  spShownRef.current = spShown;
  const scrollEl = useRef<HTMLDivElement | null>(null);

  const countTo = useCallback((target: number, dur: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = spShownRef.current;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setSpShown(Math.round(from + (target - from) * e));
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const addSP = useCallback(
    (n: number) => {
      setSp((prev) => {
        const next = prev + n;
        countTo(next, 900);
        return next;
      });
    },
    [countTo],
  );

  const showToast = useCallback((title: string, sub: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ title, sub });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  // On-load moment: SP count-up + tier bar sweep (when starting at home)
  useEffect(() => {
    if (!startAtLogin) {
      countTo(24380, 1400);
      const t = setTimeout(() => setProgressOn(true), 500);
      return () => clearTimeout(t);
    }
  }, [startAtLogin, countTo]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
    },
    [],
  );

  const scrollTop = () => {
    if (scrollEl.current) scrollEl.current.scrollTop = 0;
  };

  const nav = useCallback((s: Screen) => {
    setScreen((cur) => {
      setStack((st) => [...st, cur]);
      return s;
    });
    requestAnimationFrame(scrollTop);
  }, []);

  const setTab = useCallback((s: Screen) => {
    setScreen(s);
    setStack([]);
    requestAnimationFrame(scrollTop);
  }, []);

  const goBack = useCallback(() => {
    setStack((st) => {
      const next = [...st];
      const prev = next.pop() || 'home';
      setScreen(prev);
      return next;
    });
    requestAnimationFrame(scrollTop);
  }, []);

  const cartIds = Object.keys(cart);
  const cartTotal = cartIds.reduce((a, id) => a + cart[id] * (PRODUCTS.find((p) => p.id === id)?.dealer ?? 0), 0);
  const cartCount = cartIds.reduce((a, id) => a + cart[id], 0);
  const cartSp = Math.floor((cartTotal / 100) * 1.1);

  const store: Store = useMemo(
    () => ({
      lang,
      t: T[lang],
      setLang,
      cycleLang: () => setLang((l) => LANG_ORDER[(LANG_ORDER.indexOf(l) + 1) % LANG_ORDER.length]),

      screen,
      nav,
      setTab,
      goBack,
      logout: () => {
        setScreen('login');
        setStack([]);
        setOtpStage(false);
      },
      scrollRef: (el) => {
        scrollEl.current = el;
      },

      otpStage,
      getOtp: () => setOtpStage(true),
      verifyOtp: () => {
        setScreen('home');
        setStack([]);
        setOtpStage(false);
        setSpShown(0);
        spShownRef.current = 0;
        setProgressOn(false);
        setTimeout(() => {
          countTo(24380, 1400);
          setProgressOn(true);
        }, 350);
        showToast('Welcome back, Rajesh ji', 'Shakti Silver · 1.1× SP on every paid invoice');
      },

      sp,
      spShown,
      progressOn,
      festival,

      cart,
      cartCount,
      cartTotal,
      cartSp,
      inc: (id) => {
        const p = PRODUCTS.find((x) => x.id === id);
        if (!p) return;
        setCart((c) => ({ ...c, [id]: (c[id] || 0) + p.carton }));
      },
      dec: (id) => {
        const p = PRODUCTS.find((x) => x.id === id);
        if (!p) return;
        setCart((c) => {
          const q = Math.max(0, (c[id] || 0) - p.carton);
          const next = { ...c };
          if (q === 0) delete next[id];
          else next[id] = q;
          return next;
        });
      },
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => {
        setCartOpen(false);
        setOrderPlaced(false);
      },
      orderPlaced,
      placeOrder: () => setOrderPlaced(true),
      trackOrder: () => {
        setCartOpen(false);
        setOrderPlaced(false);
        setCart({});
        nav('orders');
      },

      cat,
      setCat,

      scratchOpen,
      scratchDone,
      scratchUsed,
      openScratch: () => {
        setScratchOpen(true);
        setScratchDone(false);
      },
      closeScratch: () => setScratchOpen(false),
      collectScratch: () => {
        addSP(250);
        setScratchOpen(false);
        setScratchUsed(true);
        showToast('+250 SP collected', 'Scratch card · INV-2231 · balance updated');
      },
      markScratchDone: () => {
        setScratchDone(true);
        setConfetti(
          Array.from({ length: 28 }, (_, i) => ({
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
            dur: 1.4 + Math.random() * 1.1,
            size: 6 + Math.random() * 7,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            round: Math.random() > 0.5,
          })),
        );
        if (confettiTimer.current) clearTimeout(confettiTimer.current);
        confettiTimer.current = setTimeout(() => setConfetti(null), 2600);
      },
      confetti,

      toast,
      showToast,

      lbTab,
      setLbTab,

      scans,
      simulateScan: () => {
        if (scans >= 130) {
          showToast('All cartons verified', 'INV-2231 fully scanned');
          return;
        }
        setScans((n) => n + 1);
        addSP(5);
        showToast('+5 SP · Carton verified', 'QR matched to INV-2231 · geo-tagged Ludhiana');
      },

      votedColor,
      pickColor: (id, label) => {
        setVotedColor(id);
        showToast('Vote counted', label + ' — results in the monthly Bulletin');
      },

      redeemItem,
      openRedeem: (r) => setRedeemItem(r),
      cancelRedeem: () => setRedeemItem(null),
      confirmRedeem: () => {
        if (!redeemItem) return;
        const item = redeemItem;
        setSp((prev) => {
          const next = prev - item.cost;
          countTo(next, 900);
          return next;
        });
        setRedeemItem(null);
        setHistoryExtra((h) => [{ icon: item.icon, text: item.name + ' — processing', date: 'Today' }, ...h]);
        showToast('Redeemed: ' + item.name, 'Fulfilled within 14 days · see history');
      },
      historyExtra,
    }),
    [
      lang, screen, otpStage, sp, spShown, progressOn, festival, cart, cartOpen, orderPlaced,
      cat, scratchOpen, scratchDone, scratchUsed, confetti, toast, lbTab, scans, votedColor,
      redeemItem, historyExtra, cartCount, cartTotal, cartSp,
      nav, setTab, goBack, countTo, addSP, showToast,
    ],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export const HISTORY_BASE = BASE_HISTORY;

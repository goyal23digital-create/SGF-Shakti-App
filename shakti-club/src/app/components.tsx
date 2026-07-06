import { useRef, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../lib/icons';
import { fmt } from '../lib/format';
import { PRODUCTS, productImg } from './data';
import { useApp } from './store';

/* ---------- small style helpers ---------- */

export const display: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800 };
export const eyebrow: CSSProperties = {
  fontFamily: 'var(--font-condensed)',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
};

/** The orange S-monogram coin */
export function SCoin({ size, fontSize, animate = false, shadow }: { size: number; fontSize: number; animate?: boolean; shadow?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--grad-orange)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...display,
        fontSize,
        color: '#fff',
        flex: 'none',
        ...(shadow ? { boxShadow: shadow } : {}),
        ...(animate ? { animation: 'sc-coin 3.2s ease-in-out infinite' } : {}),
      }}
    >
      S
    </div>
  );
}

/** White circular back button + screen title header */
export function BackHeader({ title, children, sub }: { title: string; children?: ReactNode; sub?: string }) {
  const app = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#fff', borderBottom: '1px solid var(--slate-100)' }}>
      <div
        onClick={app.goBack}
        className="hov-bg"
        style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <Icon name="arrow-left" size={19} color="#0E1B2E" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...display, fontSize: 18 }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

/* ---------- toast ---------- */

export function ToastView() {
  const app = useApp();
  if (!app.toast) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 14,
        left: 16,
        right: 16,
        zIndex: 60,
        background: 'var(--blue-900)',
        color: '#fff',
        borderRadius: 16,
        padding: '12px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        boxShadow: 'var(--shadow-lg)',
        animation: 'sc-toast-in 0.3s cubic-bezier(0.2,0.6,0.2,1)',
      }}
    >
      <SCoin size={34} fontSize={16} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 13.5 }}>{app.toast.title}</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)' }}>{app.toast.sub}</div>
      </div>
    </div>
  );
}

/* ---------- scratch card overlay ---------- */

export function ScratchOverlay() {
  const app = useApp();
  const elRef = useRef<HTMLCanvasElement | null>(null);
  const scratched = useRef(0);
  const down = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  if (!app.scratchOpen) return null;

  const initCanvas = (el: HTMLCanvasElement | null) => {
    if (!el || el === elRef.current) return;
    elRef.current = el;
    scratched.current = 0;
    last.current = null;
    const ctx = el.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 264, 150);
    g.addColorStop(0, '#D9DFE8');
    g.addColorStop(0.5, '#B8C2CF');
    g.addColorStop(1, '#9AA8B8');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 264, 150);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    for (let i = -150; i < 264; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, 150);
      ctx.lineTo(i + 150, 0);
      ctx.stroke();
    }
    ctx.fillStyle = '#4C5969';
    ctx.font = "700 15px 'Saira Condensed', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('S C R A T C H   H E R E', 132, 72);
    ctx.font = "600 10px 'Hanken Grotesk', sans-serif";
    ctx.fillStyle = '#6B7A8C';
    ctx.fillText('खरोंचो और जीतो', 132, 92);
  };

  const scratchAt = (e: React.PointerEvent) => {
    const el = elRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 264;
    const y = ((e.clientY - rect.top) / rect.height) * 150;
    const ctx = el.getContext('2d')!;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
    if (last.current) {
      const dx = x - last.current.x;
      const dy = y - last.current.y;
      scratched.current += Math.sqrt(dx * dx + dy * dy);
    } else {
      scratched.current += 20;
    }
    last.current = { x, y };
    if (scratched.current > 900 && !app.scratchDone) {
      app.markScratchDone();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: 'rgba(11,27,46,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'sc-fade-in 0.25s ease',
      }}
    >
      {app.confetti && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
          {app.confetti.map((c, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                top: '18%',
                left: c.left + '%',
                width: c.size,
                height: c.size * (c.round ? 1 : 0.55),
                borderRadius: c.round ? '50%' : 2,
                background: c.color,
                animation: `sc-confetti ${c.dur}s ease-in ${c.delay}s forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: '22px 20px 20px',
          width: 308,
          textAlign: 'center',
          position: 'relative',
          animation: 'sc-pop 0.35s cubic-bezier(0.2,0.6,0.2,1)',
        }}
      >
        <div
          onClick={app.closeScratch}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'var(--slate-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon name="x" size={16} color="#4C5969" />
        </div>
        <div style={{ ...eyebrow, fontSize: 11, color: 'var(--brand-accent-strong)' }}>Invoice INV-2231 paid</div>
        <div style={{ ...display, fontSize: 20, marginTop: 4 }}>{app.t.scratchTitle}</div>
        <div
          style={{
            position: 'relative',
            width: 264,
            height: 150,
            margin: '16px auto 0',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--orange-50)',
            border: '1px solid var(--orange-100)',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--grad-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...display,
                fontSize: 22,
                color: '#fff',
                animation: 'sc-coin 2.6s ease-in-out infinite',
              }}
            >
              S
            </div>
            <div style={{ ...display, fontSize: 30, color: 'var(--brand-accent-strong)' }}>+250 SP</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>≈ ₹62 · lucky draw entry added</div>
          </div>
          <canvas
            ref={initCanvas}
            width={264}
            height={150}
            onPointerDown={(e) => {
              down.current = true;
              last.current = null;
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              scratchAt(e);
            }}
            onPointerMove={(e) => {
              if (down.current) scratchAt(e);
            }}
            onPointerUp={() => {
              down.current = false;
              last.current = null;
            }}
            style={{
              position: 'absolute',
              inset: 0,
              touchAction: 'none',
              cursor: 'grab',
              opacity: app.scratchDone ? 0 : 1,
              transition: 'opacity 0.6s ease',
            }}
          />
        </div>
        {app.scratchDone ? (
          <div
            onClick={app.collectScratch}
            className="hov-bright"
            style={{
              marginTop: 16,
              background: 'var(--grad-orange)',
              color: '#fff',
              borderRadius: 999,
              padding: 13,
              fontWeight: 800,
              fontSize: 14.5,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-accent)',
              animation: 'sc-pop 0.4s ease',
            }}
          >
            Collect 250 SP
          </div>
        ) : (
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>Rub the card with your finger</div>
        )}
      </div>
    </div>
  );
}

/* ---------- cart FAB ---------- */

export function CartFab() {
  const app = useApp();
  const show = app.cartCount > 0 && !app.cartOpen && (app.screen === 'shop' || app.screen === 'home');
  if (!show) return null;
  return (
    <div
      onClick={app.openCart}
      className="hov-scale"
      style={{
        position: 'absolute',
        right: 16,
        bottom: 76,
        background: 'var(--grad-orange)',
        color: '#fff',
        borderRadius: 999,
        padding: '13px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        cursor: 'pointer',
        boxShadow: '0 10px 28px rgba(247,148,29,0.5)',
        transition: 'transform 0.15s ease',
        zIndex: 20,
        animation: 'sc-pop 0.3s ease',
      }}
    >
      <Icon name="shopping-cart" size={18} color="#ffffff" />
      <span style={{ fontWeight: 800, fontSize: 13.5 }}>
        {app.cartCount} pcs · ₹{fmt(app.cartTotal)}
      </span>
    </div>
  );
}

/* ---------- cart sheet ---------- */

export function CartSheet() {
  const app = useApp();
  if (!app.cartOpen) return null;
  const cartIds = Object.keys(app.cart);
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={app.closeCart} style={{ position: 'absolute', inset: 0, background: 'rgba(11,27,46,0.55)', animation: 'sc-fade-in 0.25s ease' }} />
      <div
        className="no-scrollbar"
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '24px 24px 0 0',
          padding: '10px 18px 20px',
          maxHeight: '78%',
          overflowY: 'auto',
          animation: 'sc-sheet-up 0.35s cubic-bezier(0.2,0.6,0.2,1)',
        }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--slate-200)', margin: '0 auto 14px' }} />
        {!app.orderPlaced ? (
          <>
            <div style={{ ...display, fontSize: 19, marginBottom: 12 }}>Order request</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {cartIds.map((id) => {
                const p = PRODUCTS.find((x) => x.id === id)!;
                const qty = app.cart[id];
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 11, border: '1px solid var(--slate-200)', borderRadius: 14, padding: '9px 11px' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 10, background: '#EEF0F3', overflow: 'hidden', flex: 'none' }}>
                      <img src={productImg(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                        {qty} pcs × ₹{fmt(p.dealer)}
                      </div>
                    </div>
                    <div style={{ ...display, fontSize: 14 }}>₹{fmt(qty * p.dealer)}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total (ex-GST)</span>
              <span style={{ ...display, fontSize: 22 }}>₹{fmt(app.cartTotal)}</span>
            </div>
            <div
              style={{
                marginTop: 10,
                borderRadius: 14,
                background: 'var(--orange-50)',
                border: '1px solid var(--orange-100)',
                padding: '11px 13px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <SCoin size={30} fontSize={14} />
              <div style={{ fontSize: 12.5, color: 'var(--orange-900)' }}>
                Earns <b>~{fmt(app.cartSp)} SP</b> when the invoice is paid <span style={{ color: 'var(--orange-800)' }}>(+540 more if paid early)</span>
              </div>
            </div>
            <div
              onClick={app.placeOrder}
              className="hov-bright"
              style={{
                marginTop: 14,
                background: 'var(--grad-orange)',
                color: '#fff',
                borderRadius: 999,
                padding: 15,
                textAlign: 'center',
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-accent)',
              }}
            >
              {app.t.sendOrder}
            </div>
            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 9 }}>
              Our team confirms price &amp; dispatch on WhatsApp within 2 hours
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '14px 6px 6px', animation: 'sc-pop 0.4s ease' }}>
            <div style={{ position: 'relative', width: 74, height: 74, margin: '0 auto' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--green-500)', opacity: 0.25, animation: 'sc-ring 1.4s ease-out infinite' }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--green-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={36} color="#ffffff" strokeWidth={2.6} />
              </div>
            </div>
            <div style={{ ...display, fontSize: 21, marginTop: 14 }}>Order request sent</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
              ORD-1152 · ₹{fmt(app.cartTotal)} · Sales will confirm on WhatsApp.
              <br />~{fmt(app.cartSp)} SP credited on payment.
            </div>
            <div
              onClick={app.trackOrder}
              className="hov-bright"
              style={{
                marginTop: 16,
                background: 'var(--blue-600)',
                color: '#fff',
                borderRadius: 999,
                padding: 13,
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-brand)',
              }}
            >
              Track in Orders
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- redeem dialog ---------- */

export function RedeemDialog() {
  const app = useApp();
  const r = app.redeemItem;
  if (!r) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 55,
        background: 'rgba(11,27,46,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'sc-fade-in 0.2s ease',
      }}
    >
      <div style={{ background: '#fff', borderRadius: 22, padding: '22px 20px', width: 290, textAlign: 'center', animation: 'sc-pop 0.3s ease' }}>
        <div style={{ width: 50, height: 50, borderRadius: 15, background: 'var(--orange-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <Icon name={r.icon} size={24} color="#E0790C" />
        </div>
        <div style={{ ...display, fontSize: 18, marginTop: 12 }}>{r.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
          Redeem for <b style={{ color: 'var(--brand-accent-strong)' }}>{fmt(r.cost)} SP</b>? Balance after: {fmt(app.sp - r.cost)} SP.
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
          <div
            onClick={app.cancelRedeem}
            className="hov-bg"
            style={{ flex: 1, border: '1px solid var(--slate-300)', borderRadius: 999, padding: 11, fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}
          >
            Cancel
          </div>
          <div
            onClick={app.confirmRedeem}
            className="hov-bright"
            style={{
              flex: 1,
              background: 'var(--grad-orange)',
              color: '#fff',
              borderRadius: 999,
              padding: 11,
              fontWeight: 800,
              fontSize: 13.5,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-accent)',
            }}
          >
            {app.t.redeem}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- bottom nav ---------- */

const SUB_TO_TAB: Partial<Record<string, string>> = {
  leaderboard: 'home',
  scan: 'home',
  orders: 'home',
  media: 'more',
  support: 'more',
  notifs: 'home',
};

export function BottomNav() {
  const app = useApp();
  const t = app.t;
  const navDefs: Array<[string, string, string]> = [
    ['home', 'home', t.home],
    ['shop', 'armchair', t.shop],
    ['rewards', 'gift', t.rewards],
    ['ledger', 'wallet', t.ledger],
    ['more', 'menu', t.more],
  ];
  const activeTab = SUB_TO_TAB[app.screen] || app.screen;
  return (
    <div style={{ display: 'flex', background: '#fff', borderTop: '1px solid var(--slate-200)', paddingBottom: 2, zIndex: 15 }}>
      {navDefs.map(([id, icon, label]) => {
        const on = activeTab === id;
        return (
          <div
            key={id}
            onClick={() => app.setTab(id as never)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 0 6px', cursor: 'pointer', position: 'relative' }}
          >
            <div style={{ position: 'absolute', top: 0, width: 34, height: 3, borderRadius: '0 0 4px 4px', background: on ? 'var(--orange-500)' : 'transparent' }} />
            <Icon name={icon} size={21} color={on ? 'var(--blue-700)' : '#9AA8B8'} strokeWidth={on ? 2.4 : 2} />
            <span style={{ fontSize: 10, fontWeight: on ? 800 : 500, color: on ? 'var(--blue-700)' : '#9AA8B8' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

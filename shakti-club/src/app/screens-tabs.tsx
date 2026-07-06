import { Icon } from '../lib/icons';
import { fmt } from '../lib/format';
import {
  BASE_HISTORY,
  CAT_DEFS,
  INVOICES,
  POLL_COLORS,
  PRODUCTS,
  REWARD_GROUPS,
  REWARDS,
  TIER_ROWS,
  productImg,
} from './data';
import { useApp, type Screen } from './store';
import { display, eyebrow } from './components';
import { LangPills } from './screens-home';

/* ---------- catalogue (shop) ---------- */

export function ShopScreen() {
  const app = useApp();
  const t = app.t;
  const products = PRODUCTS.filter((p) => app.cat === 'all' || p.cat === app.cat);
  return (
    <div>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: '#fff', padding: '12px 16px 10px', borderBottom: '1px solid var(--slate-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, background: 'var(--slate-100)', borderRadius: 999, padding: '10px 14px' }}>
            <Icon name="search" size={16} color="#6B7A8C" />
            <span style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>Search model or code…</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', background: 'var(--green-50)', borderRadius: 999, padding: '5px 10px', flex: 'none' }}>
            Trade pricing
          </span>
        </div>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto' }}>
          {CAT_DEFS.map(([id, label]) => {
            const on = app.cat === id;
            return (
              <div
                key={id}
                onClick={() => app.setCat(id)}
                style={{
                  flex: 'none',
                  whiteSpace: 'nowrap',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: on ? 700 : 600,
                  cursor: 'pointer',
                  border: `1px solid ${on ? 'var(--blue-600)' : 'var(--slate-200)'}`,
                  background: on ? 'var(--blue-600)' : '#fff',
                  color: on ? '#fff' : 'var(--slate-600)',
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>

      {/* new launch strip */}
      <div
        style={{
          margin: '12px 16px 0',
          borderRadius: 16,
          background: 'var(--cream-50)',
          border: '1px solid var(--sand-200)',
          padding: '11px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
        }}
      >
        <Icon name="rocket" size={19} color="#E0790C" />
        <div style={{ flex: 1, fontSize: 12.5, color: 'var(--text-body)' }}>
          <b>New launch:</b> Heritage Storage Stool earns <b style={{ color: 'var(--brand-accent-strong)' }}>2× SP</b> till 31 Jul
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 16px 18px' }}>
        {products.map((p) => {
          const qty = app.cart[p.id] || 0;
          const spPer = Math.round((p.dealer / 100) * 1.1 * (p.id === 'heritage' ? 2 : 1) * 10) / 10;
          return (
            <div key={p.id} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 11, display: 'flex', gap: 12, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: 92, height: 98, borderRadius: 12, background: '#EEF0F3', overflow: 'hidden', flex: 'none', position: 'relative' }}>
                <img src={productImg(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {p.tag && (
                  <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 9.5, fontWeight: 800, background: 'var(--grad-orange)', color: '#fff', borderRadius: 999, padding: '3px 8px' }}>
                    {p.tag}
                  </span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25 }}>{p.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                  {p.code} · {p.carton} pcs/carton · MOQ {p.moq}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                  <span style={{ ...display, fontSize: 17 }}>₹{fmt(p.dealer)}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-faint)', textDecoration: 'line-through' }}>₹{fmt(p.mrp)}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--status-success)', background: 'var(--green-50)', borderRadius: 999, padding: '2px 7px' }}>
                    ₹{fmt(p.mrp - p.dealer)} margin
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--brand-accent-strong)', fontWeight: 700 }}>
                    {p.id === 'heritage' ? `Earns ${spPer} SP/pc · 2× live` : `Earns ~${spPer} SP/pc`}
                  </span>
                  {qty > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--blue-50)', borderRadius: 999, padding: '4px 6px' }}>
                      <div
                        onClick={() => app.dec(p.id)}
                        style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-xs)' }}
                      >
                        <Icon name="minus" size={14} color="#0A52B4" />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--brand-primary)', minWidth: 44, textAlign: 'center' }}>{qty} pcs</span>
                      <div
                        onClick={() => app.inc(p.id)}
                        style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Icon name="plus" size={14} color="#ffffff" />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => app.inc(p.id)}
                      className="hov-bright"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        flex: 'none',
                        whiteSpace: 'nowrap',
                        background: 'var(--grad-orange)',
                        color: '#fff',
                        borderRadius: 999,
                        padding: '7px 14px',
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-accent)',
                      }}
                    >
                      <Icon name="plus" size={14} color="#ffffff" />
                      {t.addPO}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* co-creation poll */}
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 14, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="vote" size={19} color="#0A52B4" />
            <div style={{ fontWeight: 700, fontSize: 14 }}>Vote: next colour for Maharaja?</div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {POLL_COLORS.map(([id, hex, label]) => (
              <div key={id} onClick={() => app.pickColor(id, label)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: hex,
                    boxShadow: app.votedColor === id ? '0 0 0 3px #fff, 0 0 0 5px var(--blue-600)' : '0 0 0 1px var(--slate-300)',
                  }}
                />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
              </div>
            ))}
            <div style={{ flex: 1 }} />
            {app.votedColor && (
              <span style={{ alignSelf: 'center', fontSize: 11.5, fontWeight: 700, color: 'var(--status-success)', background: 'var(--green-50)', borderRadius: 999, padding: '5px 11px' }}>
                Vote counted ✓
              </span>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 10 }}>1,240 dealers voted this week. Winning colour goes to the mould.</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- rewards store ---------- */

export function RewardsScreen() {
  const app = useApp();
  const history = [...app.historyExtra, ...BASE_HISTORY];
  return (
    <div>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: '#fff', padding: '14px 16px 12px', borderBottom: '1px solid var(--slate-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--grad-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...display, fontSize: 19, color: '#fff' }}>
            S
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
              <span style={{ ...display, fontSize: 22, fontVariantNumeric: 'tabular-nums' }}>{fmt(app.spShown)}</span>
              <span style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', color: 'var(--brand-accent-strong)' }}>SP</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: -2 }}>1 SP = ₹0.25 · min. redemption 2,000 SP</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-600)', background: 'var(--amber-50)', border: '1px solid #F3E3B2', borderRadius: 999, padding: '5px 10px' }}>
            1,150 SP expire 31 Aug
          </span>
        </div>
      </div>

      <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {REWARD_GROUPS.map((g, gi) => (
          <div key={g.label}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 9 }}>
              <span style={{ ...display, fontSize: 15.5 }}>{g.label}</span>
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{g.note}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {REWARDS.filter((r) => r.group === gi).map((r) => {
                const afford = app.sp >= r.cost;
                return (
                  <div key={r.name} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'var(--shadow-xs)' }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 11,
                        background: gi === 0 ? 'var(--orange-50)' : gi === 1 ? 'var(--blue-50)' : 'var(--cream-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 'none',
                      }}
                    >
                      <Icon name={r.icon} size={19} color={gi === 0 ? '#E0790C' : gi === 1 ? '#0A52B4' : '#8E4A0C'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{r.sub}</div>
                    </div>
                    <div style={{ textAlign: 'right', flex: 'none' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--brand-accent-strong)' }}>{fmt(r.cost)} SP</div>
                      <div
                        onClick={() => afford && app.openRedeem(r)}
                        className={afford ? 'hov-bright' : undefined}
                        style={{
                          marginTop: 5,
                          whiteSpace: 'nowrap',
                          fontSize: 11.5,
                          fontWeight: 700,
                          borderRadius: 999,
                          padding: '5px 13px',
                          cursor: afford ? 'pointer' : 'default',
                          background: afford ? 'var(--grad-orange)' : 'var(--slate-100)',
                          color: afford ? '#fff' : 'var(--slate-400)',
                          boxShadow: afford ? 'var(--shadow-accent)' : 'none',
                        }}
                      >
                        {afford ? app.t.redeem : 'Locked'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* experiences */}
        <div style={{ borderRadius: 16, background: 'var(--grad-navy)', color: '#fff', padding: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -24, top: -24, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ ...eyebrow, letterSpacing: '0.18em', fontSize: 11, color: '#FFD68C' }}>By invitation · Gold &amp; above</div>
          <div style={{ ...display, fontSize: 18, marginTop: 5 }}>Factory VIP visit + dinner with the founder</div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
            Reach Shakti Gold to unlock. ₹1,30,000 billing to go — you are closer than you think.
          </div>
        </div>

        {/* history */}
        <div>
          <div style={{ ...display, fontSize: 15.5, marginBottom: 9 }}>Redemption history</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((h, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 12, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name={h.icon} size={16} color="#6B7A8C" />
                <div style={{ flex: 1, fontSize: 12.5, color: 'var(--text-body)' }}>{h.text}</div>
                <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ledger ---------- */

export function LedgerScreen() {
  const app = useApp();
  return (
    <div>
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ ...display, fontSize: 20, marginBottom: 12 }}>{app.t.ledger}</div>
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 18, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Outstanding</div>
              <div style={{ ...display, fontSize: 22, marginTop: 2 }}>₹86,400</div>
            </div>
            <div style={{ width: 1, background: 'var(--slate-100)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Credit days</div>
              <div style={{ ...display, fontSize: 22, marginTop: 2 }}>
                37{' '}
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', background: 'var(--green-50)', borderRadius: 999, padding: '2px 7px', verticalAlign: 'middle' }}>
                  +7 Silver
                </span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 5 }}>
              <span>Credit used</span>
              <span>₹86,400 of ₹3,00,000</span>
            </div>
            <div style={{ height: 7, borderRadius: 999, background: 'var(--slate-100)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '29%', borderRadius: 999, background: 'var(--grad-blue)' }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, borderRadius: 16, background: 'var(--orange-50)', border: '1px solid var(--orange-100)', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'var(--grad-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'sc-pulse 2.4s ease-in-out infinite',
              flex: 'none',
            }}
          >
            <Icon name="zap" size={18} color="#ffffff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--orange-900)' }}>{app.t.payNudge}</div>
            <div style={{ fontSize: 12, color: 'var(--orange-800)', marginTop: 1 }}>
              INV-2262 · earns you <b>+540 bonus SP</b>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 16px' }}>
        <div style={{ ...display, fontSize: 15.5, marginBottom: 9 }}>Invoices</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {INVOICES.map((inv) => (
            <div key={inv.no} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>
                  {inv.no} <span style={{ fontWeight: 500, color: 'var(--text-faint)', fontSize: 11.5 }}>· {inv.date}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{inv.sub}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...display, fontSize: 15 }}>{inv.amount}</div>
                <span style={{ fontSize: 10.5, fontWeight: 700, borderRadius: 999, padding: '3px 9px', background: inv.chipBg, color: inv.chipColor }}>{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.5 }}>
          SP are credited only when an invoice is fully paid and reconciled. Returns claw back points automatically.
        </div>
      </div>
    </div>
  );
}

/* ---------- more ---------- */

const MORE_MENU: Array<{ icon: string; label: string; screen: Screen }> = [
  { icon: 'trophy', label: 'Leaderboard & badges', screen: 'leaderboard' },
  { icon: 'package', label: 'Orders & tracking', screen: 'orders' },
  { icon: 'qr-code', label: 'Scan cartons', screen: 'scan' },
  { icon: 'megaphone', label: 'Shakti Media Kit', screen: 'media' },
  { icon: 'life-buoy', label: 'Support & warranty', screen: 'support' },
  { icon: 'bell', label: 'Notifications', screen: 'notifs' },
];

export function MoreScreen() {
  const app = useApp();
  return (
    <div>
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 18, padding: 16, display: 'flex', alignItems: 'center', gap: 13, boxShadow: 'var(--shadow-sm)' }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'conic-gradient(var(--orange-500) 0 91%, var(--slate-200) 91% 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: 'var(--blue-700)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...display,
                fontSize: 17,
                border: '2.5px solid #fff',
              }}
            >
              RG
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...display, fontSize: 16.5 }}>Rajesh Gupta</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Gupta Furniture House · SGF-LDH-042</div>
          </div>
          <span style={{ ...eyebrow, letterSpacing: '0.14em', fontSize: 10.5, color: 'var(--brand-primary)', background: 'var(--blue-50)', borderRadius: 999, padding: '5px 11px' }}>Silver</span>
        </div>

        {/* tier compare */}
        <div style={{ marginTop: 12, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1fr',
              background: 'var(--slate-50)',
              borderBottom: '1px solid var(--slate-100)',
              padding: '10px 14px',
              fontFamily: 'var(--font-condensed)',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: 10.5,
              color: 'var(--text-muted)',
            }}
          >
            <span>Benefit</span>
            <span style={{ color: 'var(--brand-primary)' }}>Silver · you</span>
            <span style={{ color: 'var(--brand-accent-strong)' }}>Gold · next</span>
          </div>
          {TIER_ROWS.map((tr) => (
            <div key={tr.label} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', padding: '10px 14px', borderBottom: '1px solid var(--slate-100)', fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)' }}>{tr.label}</span>
              <span style={{ fontWeight: 600 }}>{tr.silver}</span>
              <span style={{ fontWeight: 700, color: 'var(--brand-accent-strong)' }}>{tr.gold}</span>
            </div>
          ))}
          <div style={{ padding: '11px 14px', fontSize: 11.5, color: 'var(--text-muted)' }}>
            Tiers use rolling 12-month paid billing, reviewed quarterly. One grace quarter before any demotion.
          </div>
        </div>

        {/* language */}
        <div style={{ marginTop: 12, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 18, padding: 14, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Language / भाषा / ਭਾਸ਼ਾ</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <LangPills grow />
          </div>
        </div>

        {/* menu */}
        <div style={{ marginTop: 12, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {MORE_MENU.map((mm) => (
            <div
              key={mm.screen}
              onClick={() => app.nav(mm.screen)}
              className="hov-bg-50"
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px', borderBottom: '1px solid var(--slate-100)', cursor: 'pointer' }}
            >
              <Icon name={mm.icon} size={19} color="#0A3F86" strokeWidth={1.8} />
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{mm.label}</span>
              <Icon name="chevron-right" size={17} color="#C3CEDA" />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '18px 30px 20px', fontSize: 10.5, color: 'var(--text-faint)', lineHeight: 1.6 }}>
          Shakti Club is a discretionary trade programme of SGF Shakti Moulded Furniture. Points are non-transferable. T&amp;C apply.
          <br />
          App v1.0 ·{' '}
          <span onClick={app.logout} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>
            Log out
          </span>
        </div>
      </div>
    </div>
  );
}

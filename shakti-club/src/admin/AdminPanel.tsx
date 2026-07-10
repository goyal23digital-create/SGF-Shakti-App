import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon } from '../lib/icons';
import { logoMark, logoMarkWhite } from '../assets';
import {
  ACTIVITY,
  BREACH_ALERT,
  BUILDER_COPY,
  COST_MONTHS,
  COST_SERIES,
  DEALERS,
  LIVE_MISSIONS,
  MISSION_TYPES,
  NAV_DEFS,
  PENDING_DEFS,
  QUEUE_DEFS,
  RECON_DEFS,
  STATS_BY,
  TIER_STYLE,
  VIEW_TITLES,
  type Scenario,
} from './data';

const display: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800 };
const condensed: CSSProperties = {
  fontFamily: 'var(--font-condensed)',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
};

const tableHead: CSSProperties = {
  ...condensed,
  padding: '11px 16px',
  background: 'var(--slate-50)',
  borderBottom: '1px solid var(--slate-100)',
  fontSize: 10.5,
  color: 'var(--text-muted)',
};

export default function AdminPanel() {
  const params = new URLSearchParams(window.location.search);
  const scenarioParam = params.get('scenario');
  const scenario: Scenario = scenarioParam === 'pilot' || scenarioParam === 'cap-breach' ? scenarioParam : 'steady';
  const compact = params.get('density') === 'compact';
  const ink = params.has('ink');

  const breach = scenario === 'cap-breach';
  const pilot = scenario === 'pilot';

  const [view, setView] = useState('dashboard');
  const [toast, setToast] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<Record<string, 'ok' | 'hold'>>({});
  const [queueDone, setQueueDone] = useState<Record<string, boolean>>({});
  const [reconDone, setReconDone] = useState<Record<string, boolean>>({});
  const [missionType, setMissionType] = useState('sku');

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };
  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  /* density knobs */
  const contentPad = compact ? '14px 20px 22px' : '22px 28px 34px';
  const gridGap = compact ? 10 : 14;
  const statPad = compact ? '12px 14px' : '16px';
  const statValueSize = compact ? 21 : 26;
  const rowPad = compact ? '7px 14px' : '12px 16px';

  /* sidebar palette */
  const sb = {
    bg: ink ? 'var(--grad-navy)' : '#fff',
    border: ink ? 'transparent' : 'var(--slate-200)',
    divider: ink ? 'rgba(255,255,255,0.12)' : 'var(--slate-100)',
    eyebrow: ink ? '#FFBA1F' : 'var(--brand-accent-strong)',
    text: ink ? '#fff' : 'var(--text-strong)',
    muted: ink ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)',
    avatarBg: ink ? 'rgba(255,255,255,0.16)' : 'var(--blue-700)',
  };

  const stats = STATS_BY[scenario];
  const costBars = COST_MONTHS.map((month, i) => {
    const v = COST_SERIES[scenario][i];
    return {
      month,
      pct: v.toFixed(2) + '%',
      h: Math.round((v / 1.6) * 100) + '%',
      bg: v > 1.25 ? 'var(--red-500)' : v > 1.15 ? 'var(--amber-500)' : 'var(--grad-blue)',
    };
  });
  const activity = breach ? [BREACH_ALERT, ...ACTIVITY] : ACTIVITY;

  const liab = {
    value: breach ? '₹5.64L' : pilot ? '₹0.38L' : '₹4.21L',
    sub: breach ? '= 22.6L SP outstanding' : pilot ? '= 1.5L SP · 15 dealers' : '= 16.8L SP outstanding',
    expiring: breach ? '1.12L SP' : pilot ? '0.04L SP' : '0.42L SP',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-body)', color: 'var(--text-strong)', background: 'var(--slate-50)' }}>
      {/* ===== sidebar ===== */}
      <div
        style={{
          width: 232,
          flex: 'none',
          background: sb.bg,
          borderRight: `1px solid ${sb.border}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 18px 16px', borderBottom: `1px solid ${sb.divider}` }}>
          <img src={ink ? logoMarkWhite : logoMark} alt="" style={{ width: 34, height: 34, objectFit: 'contain', borderRadius: 9 }} />
          <div>
            <div style={{ ...condensed, letterSpacing: '0.16em', fontSize: 11, color: sb.eyebrow }}>Shakti Club</div>
            <div style={{ fontSize: 11.5, color: sb.muted }}>Admin · Head Office</div>
          </div>
        </div>
        <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {NAV_DEFS.map(([id, icon, label, count]) => {
            const on = view === id;
            return (
              <div
                key={id}
                onClick={() => setView(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '10px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: on ? (ink ? 'rgba(255,255,255,0.14)' : 'var(--blue-50)') : 'transparent',
                }}
              >
                <Icon name={icon} size={18} color={ink ? (on ? '#FFBA1F' : 'rgba(255,255,255,0.65)') : on ? '#0A52B4' : '#6B7A8C'} strokeWidth={1.9} />
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: on ? 800 : 600, color: ink ? (on ? '#fff' : 'rgba(255,255,255,0.78)') : on ? 'var(--brand-primary)' : 'var(--text-body)' }}>
                  {label}
                </span>
                {count > 0 && (
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      background: 'var(--orange-500)',
                      color: '#fff',
                      borderRadius: 999,
                      minWidth: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 5px',
                    }}
                  >
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ padding: '14px 18px', borderTop: `1px solid ${sb.divider}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: sb.avatarBg,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...display,
              fontSize: 12.5,
            }}
          >
            CG
          </div>
          <div style={{ fontSize: 12, color: sb.text }}>
            <b>Chetan Goyal</b>
            <br />
            <span style={{ color: sb.muted }}>Managing Director</span>
          </div>
        </div>
      </div>

      {/* ===== main ===== */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        {/* toast */}
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: 18,
              right: 24,
              zIndex: 60,
              background: 'var(--blue-900)',
              color: '#fff',
              borderRadius: 14,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: 'var(--shadow-lg)',
              animation: 'ap-toast-in 0.3s ease',
            }}
          >
            <Icon name="check-circle-2" size={18} color="#FFBA1F" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{toast}</span>
          </div>
        )}

        {/* topbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 28px',
            background: '#fff',
            borderBottom: '1px solid var(--slate-200)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ ...display, fontSize: 19, flex: 1 }}>{VIEW_TITLES[view]}</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>July 2026 · live data (mock)</span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              color: breach ? 'var(--red-600)' : 'var(--status-success)',
              background: breach ? 'var(--red-50)' : 'var(--green-50)',
              borderRadius: 999,
              padding: '5px 12px',
            }}
          >
            {breach ? 'Program cost 1.31% — OVER 1.25% CAP' : pilot ? 'Program cost 0.72% · pilot cohort' : 'Program cost 1.08% · cap 1.25%'}
          </span>
        </div>

        {/* ======== dashboard ======== */}
        {view === 'dashboard' && (
          <div style={{ padding: contentPad }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: gridGap }}>
              {stats.map((st) => (
                <div key={st.label} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: statPad, boxShadow: 'var(--shadow-xs)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...condensed, letterSpacing: '0.12em', fontSize: 10.5, color: 'var(--text-muted)' }}>
                    <Icon name={st.icon} size={14} color="#6B7A8C" />
                    {st.label}
                  </div>
                  <div style={{ ...display, fontSize: statValueSize, marginTop: 8 }}>{st.value}</div>
                  <div style={{ fontSize: 11.5, marginTop: 3, color: st.deltaColor, fontWeight: 600 }}>{st.delta}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: gridGap, marginTop: gridGap }}>
              {/* cost chart */}
              <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 18, boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5 }}>Program cost vs billing</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>auto-alert above 1.25%</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 150, marginTop: 18, padding: '0 6px', borderBottom: '1px solid var(--slate-200)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, right: 0, bottom: '75%', borderTop: '1.5px dashed var(--red-500)', opacity: 0.55 }} />
                  <span style={{ position: 'absolute', right: 4, bottom: '76%', fontSize: 10, color: 'var(--red-500)', fontWeight: 700 }}>1.25% cap</span>
                  {costBars.map((cb) => (
                    <div key={cb.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-body)' }}>{cb.pct}</span>
                      <div
                        style={{
                          width: '100%',
                          maxWidth: 44,
                          height: cb.h,
                          borderRadius: '8px 8px 0 0',
                          background: cb.bg,
                          transformOrigin: 'bottom',
                          animation: 'ap-grow 0.7s cubic-bezier(0.2,0.6,0.2,1)',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 18, padding: '8px 6px 0' }}>
                  {costBars.map((cb) => (
                    <div key={cb.month} style={{ flex: 1, textAlign: 'center', fontSize: 10.5, color: 'var(--text-muted)' }}>
                      {cb.month}
                    </div>
                  ))}
                </div>
              </div>

              {/* liability */}
              <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 18, boxShadow: 'var(--shadow-xs)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: 800, fontSize: 14.5 }}>Points liability</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 12 }}>
                  <span style={{ ...display, fontSize: 30 }}>{liab.value}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{liab.sub}</span>
                </div>
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9, fontSize: 12.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Earned this month</span>
                    <b>+2.94L SP</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Redeemed this month</span>
                    <b>−1.86L SP</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Expiring in 60 days</span>
                    <b style={{ color: 'var(--amber-600)' }}>{liab.expiring}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Clawed back (returns)</span>
                    <b>−0.06L SP</b>
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: 12, fontSize: 11.5, color: 'var(--text-muted)', borderTop: '1px solid var(--slate-100)' }}>
                  Expiry reminders at 60/30/7 days are on. CA review scheduled 28 Jul.
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: gridGap, marginTop: gridGap }}>
              {/* sell-through */}
              <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 18, boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, fontSize: 14.5 }}>Sell-through from QR scans</div>
                  <span style={{ fontSize: 11.5, color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>Open map</span>
                </div>
                <div
                  style={{
                    marginTop: 12,
                    border: '1.5px dashed var(--slate-300)',
                    borderRadius: 12,
                    height: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    color: 'var(--text-faint)',
                  }}
                >
                  <Icon name="map" size={28} color="#9AA8B8" strokeWidth={1.5} />
                  <span style={{ fontSize: 12 }}>Punjab heat map placeholder — 8,420 scans this week</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {[
                    ['Ludhiana 34%', true],
                    ['Jalandhar 22%', true],
                    ['Amritsar 18%', true],
                    ['Other 26%', false],
                  ].map(([label, hot]) => (
                    <span
                      key={label as string}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        background: hot ? 'var(--blue-50)' : 'var(--slate-100)',
                        color: hot ? 'var(--brand-primary)' : 'var(--slate-500)',
                        borderRadius: 999,
                        padding: '4px 10px',
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              {/* activity */}
              <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 18, boxShadow: 'var(--shadow-xs)' }}>
                <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 11 }}>Live activity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {activity.map((a) => (
                    <div key={a.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 9, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                        <Icon name={a.icon} size={14} color={a.color} />
                      </div>
                      <span style={{ flex: 1, color: 'var(--text-body)' }}>{a.text}</span>
                      <span style={{ fontSize: 10.5, color: 'var(--text-faint)' }}>{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======== dealers & KYC ======== */}
        {view === 'dealers' && (
          <div style={{ padding: contentPad }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 11 }}>Pending KYC approvals</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PENDING_DEFS.map((pd) => {
                const status = pendingStatus[pd.id];
                return (
                  <div
                    key={pd.id}
                    style={{
                      background: '#fff',
                      border: '1px solid var(--slate-200)',
                      borderRadius: 14,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'var(--slate-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...display,
                        fontSize: 14,
                        color: 'var(--slate-600)',
                      }}
                    >
                      {pd.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{pd.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pd.sub}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--status-success)', background: 'var(--green-50)', borderRadius: 999, padding: '4px 10px' }}>GST ✓</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--status-success)', background: 'var(--green-50)', borderRadius: 999, padding: '4px 10px' }}>Shop photo ✓</span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: pd.ref ? 'var(--brand-accent-strong)' : 'var(--slate-500)',
                          background: pd.ref ? 'var(--orange-50)' : 'var(--slate-100)',
                          borderRadius: 999,
                          padding: '4px 10px',
                        }}
                      >
                        {pd.ref ? 'Referral +1,000 SP' : 'Direct'}
                      </span>
                    </div>
                    {!status ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div
                          onClick={() => {
                            setPendingStatus((s) => ({ ...s, [pd.id]: 'ok' }));
                            showToast(pd.name + ' approved — dealer code issued, 1,000 SP welcome bonus queued');
                          }}
                          className="hov-bright"
                          style={{
                            background: 'var(--grad-orange)',
                            color: '#fff',
                            borderRadius: 999,
                            padding: '8px 18px',
                            fontSize: 12.5,
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-accent)',
                          }}
                        >
                          Approve
                        </div>
                        <div
                          onClick={() => {
                            setPendingStatus((s) => ({ ...s, [pd.id]: 'hold' }));
                            showToast(pd.name + ' put on hold');
                          }}
                          className="hov-bg"
                          style={{ border: '1px solid var(--slate-300)', borderRadius: 999, padding: '8px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', color: 'var(--text-body)' }}
                        >
                          Hold
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 700, color: status === 'ok' ? 'var(--status-success)' : 'var(--amber-600)' }}>
                        {status === 'ok' ? 'Approved · welcome kit queued' : 'On hold'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ fontWeight: 800, fontSize: 14.5, margin: '22px 0 11px' }}>Active dealers · 368</div>
            <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr', ...tableHead }}>
                <span>Dealer</span>
                <span>District</span>
                <span>Tier</span>
                <span>12-mo billing</span>
                <span>SP balance</span>
                <span>Last order</span>
              </div>
              {DEALERS.map((d) => (
                <div
                  key={d.name}
                  style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr', padding: rowPad, borderBottom: '1px solid var(--slate-100)', fontSize: 12.5, alignItems: 'center' }}
                >
                  <span style={{ fontWeight: 700 }}>{d.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{d.district}</span>
                  <span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, borderRadius: 999, padding: '3px 10px', background: TIER_STYLE[d.tier].bg, color: TIER_STYLE[d.tier].color }}>{d.tier}</span>
                  </span>
                  <span>{d.billing}</span>
                  <span style={{ fontWeight: 700, color: 'var(--brand-accent-strong)' }}>{d.sp}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{d.last}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======== mission builder ======== */}
        {view === 'missions' && (
          <div style={{ padding: contentPad }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 11 }}>Live missions · 3 of 3 slots</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {LIVE_MISSIONS.map((lm) => (
                    <div key={lm.title} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: '15px 16px', boxShadow: 'var(--shadow-xs)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 11, background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name={lm.icon} size={17} color="#0A52B4" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13.5 }}>{lm.title}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{lm.sub}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-accent-strong)', background: 'var(--orange-50)', borderRadius: 999, padding: '4px 10px' }}>{lm.reward}</span>
                      </div>
                      <div style={{ marginTop: 11, height: 6, borderRadius: 999, background: 'var(--slate-100)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 999, background: 'var(--grad-orange)', width: lm.pct }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>
                        <span>{lm.uptake}</span>
                        <span>{lm.ends}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontWeight: 800, fontSize: 14.5, margin: '20px 0 11px' }}>Queued for August</div>
                <div style={{ background: '#fff', border: '1.5px dashed var(--slate-300)', borderRadius: 14, padding: '14px 16px', fontSize: 12.5, color: 'var(--text-muted)' }}>
                  Diwali display contest — best decorated SGF corner wins 5,000 SP · goes live 15 Sep
                </div>
              </div>

              {/* builder */}
              <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 18, boxShadow: 'var(--shadow-xs)', alignSelf: 'start' }}>
                <div style={{ fontWeight: 800, fontSize: 14.5 }}>New mission</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3 }}>Whatever the business needs this month.</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 14 }}>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5 }}>TYPE</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {MISSION_TYPES.map(([id, label]) => {
                        const on = missionType === id;
                        return (
                          <div
                            key={id}
                            onClick={() => setMissionType(id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 999,
                              fontSize: 11.5,
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: `1px solid ${on ? 'var(--blue-600)' : 'var(--slate-300)'}`,
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
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5 }}>GOAL</div>
                    <div style={{ border: '1px solid var(--slate-300)', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: 'var(--text-body)' }}>{BUILDER_COPY[missionType].goal}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5 }}>REWARD</div>
                      <div style={{ border: '1px solid var(--slate-300)', borderRadius: 10, padding: '10px 12px', fontSize: 13 }}>{BUILDER_COPY[missionType].reward}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5 }}>DEADLINE</div>
                      <div style={{ border: '1px solid var(--slate-300)', borderRadius: 10, padding: '10px 12px', fontSize: 13 }}>31 Aug</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 5 }}>AUDIENCE</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--blue-600)', color: '#fff', borderRadius: 999, padding: '5px 11px' }}>All tiers</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--slate-100)', color: 'var(--slate-500)', borderRadius: 999, padding: '5px 11px' }}>Gold+</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--slate-100)', color: 'var(--slate-500)', borderRadius: 999, padding: '5px 11px' }}>District</span>
                    </div>
                  </div>
                  <div
                    onClick={() => showToast('Mission slot full — 3 of 3 live. Queue it for August?')}
                    className="hov-bright"
                    style={{
                      marginTop: 4,
                      background: 'var(--grad-orange)',
                      color: '#fff',
                      borderRadius: 999,
                      padding: 12,
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: 13.5,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-accent)',
                    }}
                  >
                    Publish to 368 dealers
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Also broadcast on WhatsApp · max 3 live at once</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======== reward fulfilment ======== */}
        {view === 'rewardsq' && (
          <div style={{ padding: contentPad }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
              <div style={{ fontWeight: 800, fontSize: 14.5 }}>Fulfilment queue</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>SLA: 14 days · every fulfilled reward → photo → Bulletin</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.6fr 1fr 1fr 1.1fr', ...tableHead }}>
                <span>Reward</span>
                <span>Dealer</span>
                <span>SP</span>
                <span>Requested</span>
                <span>Status</span>
              </div>
              {QUEUE_DEFS.map((q) => (
                <div
                  key={q.id}
                  style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.6fr 1fr 1fr 1.1fr', padding: rowPad, borderBottom: '1px solid var(--slate-100)', fontSize: 12.5, alignItems: 'center' }}
                >
                  <span style={{ fontWeight: 700 }}>{q.reward}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{q.dealer}</span>
                  <span style={{ fontWeight: 700, color: 'var(--brand-accent-strong)' }}>{q.sp}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{q.date}</span>
                  {!queueDone[q.id] ? (
                    <div
                      onClick={() => {
                        setQueueDone((s) => ({ ...s, [q.id]: true }));
                        showToast(q.reward + ' marked fulfilled — photo request sent for the Bulletin');
                      }}
                      className="hov-bright"
                      style={{ background: 'var(--blue-600)', color: '#fff', borderRadius: 999, padding: '6px 14px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', justifySelf: 'start' }}
                    >
                      Mark fulfilled
                    </div>
                  ) : (
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--status-success)', justifySelf: 'start' }}>Fulfilled ✓</span>
                  )}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 14,
                borderRadius: 14,
                background: 'var(--cream-50)',
                border: '1px solid var(--sand-200)',
                padding: '13px 16px',
                fontSize: 12.5,
                color: 'var(--text-body)',
                display: 'flex',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <Icon name="info" size={16} color="#8E4A0C" />
              Credit notes auto-apply to the dealer ledger — no manual step. Physical rewards route to Xoxoday-class fulfilment API in Phase 2.
            </div>
          </div>
        )}

        {/* ======== reconciliation ======== */}
        {view === 'recon' && (
          <div style={{ padding: contentPad }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, marginBottom: 11 }}>Tally sync — paid invoices awaiting SP release</div>
            <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1fr 1fr 1fr 1.1fr', ...tableHead }}>
                <span>Invoice</span>
                <span>Dealer</span>
                <span>Value</span>
                <span>Paid on</span>
                <span>SP due</span>
                <span>Action</span>
              </div>
              {RECON_DEFS.map((rc) => (
                <div
                  key={rc.id}
                  style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr 1fr 1fr 1fr 1.1fr', padding: rowPad, borderBottom: '1px solid var(--slate-100)', fontSize: 12.5, alignItems: 'center' }}
                >
                  <span style={{ fontWeight: 700 }}>{rc.no}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{rc.dealer}</span>
                  <span>{rc.value}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{rc.paid}</span>
                  <span style={{ fontWeight: 700, color: 'var(--brand-accent-strong)' }}>{rc.sp}</span>
                  {!reconDone[rc.id] ? (
                    <div
                      onClick={() => {
                        setReconDone((s) => ({ ...s, [rc.id]: true }));
                        showToast(rc.sp + ' released to ' + rc.dealer + ' — in-app + WhatsApp notification sent');
                      }}
                      className="hov-bright"
                      style={{
                        background: 'var(--grad-orange)',
                        color: '#fff',
                        borderRadius: 999,
                        padding: '6px 14px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        justifySelf: 'start',
                        boxShadow: 'var(--shadow-accent)',
                      }}
                    >
                      Release SP
                    </div>
                  ) : (
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--status-success)', justifySelf: 'start' }}>Released ✓</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Rule 1 of the programme: SP release triggers only on reconciled payment — never on booking. Early-payment bonus (+25%) is computed automatically from due-date vs paid-date. Returns claw
              back at credit-note issue.
            </div>
          </div>
        )}

        {/* ======== broadcast ======== */}
        {view === 'broadcast' && (
          <div style={{ padding: contentPad, maxWidth: 760 }}>
            <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 20, boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ fontWeight: 800, fontSize: 14.5 }}>Compose broadcast</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3 }}>In-app notification + WhatsApp mirror.</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--blue-600)', color: '#fff', borderRadius: 999, padding: '5px 12px' }}>All dealers · 368</span>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--slate-100)', color: 'var(--slate-500)', borderRadius: 999, padding: '5px 12px' }}>Silver · 118</span>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--slate-100)', color: 'var(--slate-500)', borderRadius: 999, padding: '5px 12px' }}>Gold+ · 62</span>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--slate-100)', color: 'var(--slate-500)', borderRadius: 999, padding: '5px 12px' }}>Inactive 30d · 41</span>
              </div>
              <div style={{ marginTop: 12, border: '1px solid var(--slate-300)', borderRadius: 12, padding: '13px 14px', fontSize: 13.5, color: 'var(--text-body)', lineHeight: 1.55 }}>
                Shakti Club update: Heritage Stool mission crosses 6,400 units statewide. 25 days left on 2× SP — full-truck orders also earn +500 SP. जितना शक्ति बेचोगे, उतनी शक्ति कमाओगे।
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                <div
                  onClick={() => showToast('Broadcast sent to 368 dealers · WhatsApp mirror queued')}
                  className="hov-bright"
                  style={{
                    background: 'var(--grad-orange)',
                    color: '#fff',
                    borderRadius: 999,
                    padding: '11px 22px',
                    fontSize: 13.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-accent)',
                  }}
                >
                  Send to 368 dealers
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Best time: 8–9 pm — 2.1× open rate</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

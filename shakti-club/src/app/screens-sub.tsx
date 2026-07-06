import { Icon } from '../lib/icons';
import { fmt } from '../lib/format';
import { BADGES, LB_DISTRICT, LB_STATE, MEDIA_ITEMS, NOTIFS, ORDER_STEPS, PAST_ORDERS, productImg } from './data';
import { useApp } from './store';
import { BackHeader, display, eyebrow } from './components';

/* ---------- leaderboard & badges ---------- */

export function LeaderboardScreen() {
  const app = useApp();
  const rows = app.lbTab === 'district' ? LB_DISTRICT : LB_STATE;
  const tabStyle = (on: boolean) =>
    ({
      flex: 1,
      textAlign: 'center',
      padding: 7,
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      background: on ? '#fff' : 'transparent',
      color: on ? 'var(--brand-primary)' : 'var(--slate-500)',
      boxShadow: on ? 'var(--shadow-sm)' : 'none',
      transition: 'all 0.2s ease',
    }) as const;
  return (
    <div>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: '#fff', borderBottom: '1px solid var(--slate-100)', padding: '10px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div onClick={app.goBack} className="hov-bg" style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="arrow-left" size={19} color="#0E1B2E" />
          </div>
          <div style={{ ...display, fontSize: 18, flex: 1 }}>Leaderboard</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)', background: 'var(--blue-50)', borderRadius: 999, padding: '4px 10px' }}>Silver league</span>
        </div>
        <div style={{ display: 'flex', background: 'var(--slate-100)', borderRadius: 999, padding: 3, marginTop: 11 }}>
          <div onClick={() => app.setLbTab('district')} style={tabStyle(app.lbTab === 'district')}>
            Ludhiana district
          </div>
          <div onClick={() => app.setLbTab('state')} style={tabStyle(app.lbTab === 'state')}>
            Punjab state
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 4px' }}>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 9 }}>July · ranked by SP earned, not billing · resets monthly</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {rows.map((row) => (
            <div
              key={row.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderRadius: 14,
                padding: '11px 13px',
                background: row.you ? 'var(--blue-600)' : '#fff',
                border: `1px solid ${row.you ? 'var(--blue-600)' : 'var(--slate-200)'}`,
                boxShadow: row.you ? 'var(--shadow-brand)' : 'none',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 12.5,
                  background: row.you ? 'rgba(255,255,255,0.18)' : row.rank <= 3 ? 'var(--orange-50)' : 'var(--slate-100)',
                  color: row.you ? '#fff' : row.rank <= 3 ? 'var(--brand-accent-strong)' : 'var(--slate-500)',
                  flex: 'none',
                }}
              >
                {row.rank}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: row.you ? '#fff' : 'var(--text-strong)' }}>{row.name}</div>
                <div style={{ fontSize: 11.5, color: row.you ? 'rgba(255,255,255,0.72)' : 'var(--text-muted)' }}>{row.city}</div>
              </div>
              <div style={{ ...display, fontSize: 14.5, whiteSpace: 'nowrap', flex: 'none', color: row.you ? '#FFD68C' : 'var(--text-strong)' }}>
                {fmt(row.sp)} <span style={{ fontFamily: 'var(--font-condensed)', fontSize: 11, letterSpacing: '0.06em' }}>SP</span>
              </div>
            </div>
          ))}
        </div>
        <div
          onClick={() => app.showToast('Champion card ready', 'Shared image: "#4 in Ludhiana — Shakti Club" with your shop name')}
          className="hov-bright"
          style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'var(--blue-600)',
            color: '#fff',
            borderRadius: 999,
            padding: 12,
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-brand)',
          }}
        >
          <Icon name="share-2" size={16} color="#ffffff" />
          Share my champion card on WhatsApp
        </div>
      </div>

      <div style={{ padding: '20px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ ...display, fontSize: 15.5 }}>Trophy case</span>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>4 of 9 earned</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
          {BADGES.map((b) => (
            <div
              key={b.name}
              style={{
                background: '#fff',
                border: '1px solid var(--slate-200)',
                borderRadius: 14,
                padding: '13px 6px 11px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 7,
                textAlign: 'center',
                opacity: b.earned ? 1 : 0.45,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: b.earned ? 'var(--orange-50)' : 'var(--slate-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={b.icon} size={20} color={b.earned ? '#E0790C' : '#9AA8B8'} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.25 }}>{b.name}</div>
              <div style={{ fontSize: 9.5, color: 'var(--text-muted)', lineHeight: 1.3 }}>{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- scan QR ---------- */

export function ScanScreen() {
  const app = useApp();
  const corner = (pos: React.CSSProperties, radius: React.CSSProperties) => (
    <div style={{ position: 'absolute', width: 38, height: 38, ...pos, ...radius }} />
  );
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--blue-900)', color: '#fff', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
        <div
          onClick={app.goBack}
          style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Icon name="arrow-left" size={19} color="#ffffff" />
        </div>
        <div style={{ ...display, fontSize: 18, flex: 1 }}>Scan cartons</div>
        <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.14)', borderRadius: 999, padding: '4px 10px' }}>+5 SP / carton</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 30px' }}>
        <div style={{ position: 'relative', width: 230, height: 230 }}>
          {corner({ top: 0, left: 0, borderTop: '3.5px solid var(--orange-400)', borderLeft: '3.5px solid var(--orange-400)' }, { borderTopLeftRadius: 14 })}
          {corner({ top: 0, right: 0, borderTop: '3.5px solid var(--orange-400)', borderRight: '3.5px solid var(--orange-400)' }, { borderTopRightRadius: 14 })}
          {corner({ bottom: 0, left: 0, borderBottom: '3.5px solid var(--orange-400)', borderLeft: '3.5px solid var(--orange-400)' }, { borderBottomLeftRadius: 14 })}
          {corner({ bottom: 0, right: 0, borderBottom: '3.5px solid var(--orange-400)', borderRight: '3.5px solid var(--orange-400)' }, { borderBottomRightRadius: 14 })}
          <div style={{ position: 'absolute', inset: 22, borderRadius: 14, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="package" size={84} color="rgba(255,255,255,0.35)" strokeWidth={1.2} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 10,
              right: 10,
              height: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg,transparent,var(--orange-400),transparent)',
              animation: 'sc-scanline 2.6s ease-in-out infinite',
              boxShadow: '0 0 14px rgba(247,148,29,0.8)',
            }}
          />
        </div>
        <div style={{ marginTop: 26, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Point at the QR on the carton flap</div>
          <div style={{ ...display, fontSize: 26, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
            {app.scans} <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>of 130 cartons</span>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 3 }}>INV-2231 · geo-verified · one scan per QR, ever</div>
          <div style={{ width: 220, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.15)', overflow: 'hidden', margin: '12px auto 0' }}>
            <div style={{ height: '100%', borderRadius: 999, background: 'var(--grad-orange)', width: `${Math.round((app.scans / 130) * 100)}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>
      <div style={{ padding: '0 24px 26px' }}>
        <div
          onClick={app.simulateScan}
          className="hov-bright"
          style={{
            background: 'var(--grad-orange)',
            borderRadius: 999,
            padding: 15,
            textAlign: 'center',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 8px 26px rgba(247,148,29,0.45)',
          }}
        >
          Simulate a carton scan
        </div>
      </div>
    </div>
  );
}

/* ---------- orders & tracking ---------- */

export function OrdersScreen() {
  const app = useApp();
  return (
    <div>
      <BackHeader title="Orders & tracking" />
      <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 18, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>ORD-1147</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>312 pcs · ₹2,04,800 · placed 02 Jul</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)', background: 'var(--blue-50)', borderRadius: 999, padding: '4px 11px' }}>In transit</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ORDER_STEPS.map((st, i) => {
              const dotBg = st.state === 'done' ? 'var(--green-500)' : st.state === 'current' ? 'var(--blue-600)' : '#fff';
              const dotBorder = st.state === 'done' ? 'var(--green-500)' : st.state === 'current' ? 'var(--blue-600)' : 'var(--slate-300)';
              return (
                <div key={st.title} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: dotBg,
                        border: `2px solid ${dotBorder}`,
                        flex: 'none',
                      }}
                    >
                      <Icon name={st.icon} size={13} color={st.state === 'todo' ? '#9AA8B8' : '#ffffff'} />
                    </div>
                    {i < ORDER_STEPS.length - 1 && (
                      <div style={{ width: 2, flex: 1, minHeight: 22, background: st.state === 'done' ? 'var(--green-500)' : 'var(--slate-200)' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: st.state === 'todo' ? 'var(--text-muted)' : 'var(--text-strong)' }}>{st.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{st.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            onClick={() => app.nav('scan')}
            className="hov-bright"
            style={{
              marginTop: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'var(--grad-orange)',
              color: '#fff',
              borderRadius: 999,
              padding: 12,
              fontSize: 13.5,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-accent)',
            }}
          >
            <Icon name="qr-code" size={16} color="#ffffff" />
            Delivered? Scan cartons → earn ~650 SP
          </div>
        </div>

        <div style={{ ...display, fontSize: 15.5, marginTop: 4 }}>Past orders</div>
        {PAST_ORDERS.map((po) => (
          <div key={po.no} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="package-check" size={19} color="#1E9E5A" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>
                {po.no} <span style={{ fontWeight: 500, color: 'var(--text-faint)', fontSize: 11.5 }}>· {po.date}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{po.sub}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-accent-strong)' }}>{po.sp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- media kit ---------- */

export function MediaScreen() {
  const app = useApp();
  return (
    <div>
      <BackHeader title="Shakti Media Kit" sub="Auto-stamped: Gupta Furniture House · 98140 22331" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, padding: '14px 16px 18px' }}>
        {MEDIA_ITEMS.map((mi) => (
          <div key={mi.name} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ height: 120, background: '#EEF0F3', position: 'relative' }}>
              <img src={productImg(mi)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(11,33,66,0.82)',
                  color: '#fff',
                  fontSize: 8,
                  padding: '4px 8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontWeight: 700 }}>GUPTA FURNITURE HOUSE</span>
                <span>98140 22331</span>
              </div>
            </div>
            <div style={{ padding: '10px 11px 11px' }}>
              <div style={{ fontWeight: 700, fontSize: 12.5, lineHeight: 1.3 }}>{mi.name}</div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2 }}>{mi.sub}</div>
              <div
                onClick={() => app.showToast('Sent to WhatsApp', mi.name + ' · stamped with your shop details')}
                className="hov-bright"
                style={{
                  marginTop: 9,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: 'var(--blue-600)',
                  color: '#fff',
                  borderRadius: 999,
                  padding: 7,
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Icon name="send" size={13} color="#ffffff" />
                Send on WhatsApp
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- support & warranty ---------- */

export function SupportScreen() {
  const app = useApp();
  return (
    <div>
      <BackHeader title="Support & warranty" />
      <div style={{ padding: '14px 16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ borderRadius: 16, background: 'var(--cream-50)', border: '1px solid var(--sand-200)', padding: '14px 15px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <Icon name="shield-check" size={26} color="#0A3F86" strokeWidth={1.7} />
          <div style={{ fontSize: 12.5, color: 'var(--text-body)', lineHeight: 1.5 }}>
            <b>10-year warranty, visible process.</b> Raise a replacement with photos — track it like an order. Approved claims dispatch with your next truck.
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: 14, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>TKT-0312 · Sonet leg crack</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>2 units · photos attached · raised 28 Jun</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', background: 'var(--green-50)', borderRadius: 999, padding: '4px 10px' }}>
              Replacement approved
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 13 }}>
            <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--green-500)' }} />
            <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--green-500)' }} />
            <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--slate-200)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--text-muted)', marginTop: 5 }}>
            <span>Received</span>
            <span style={{ color: 'var(--status-success)', fontWeight: 700 }}>Approved</span>
            <span>Dispatches with ORD-1147</span>
          </div>
        </div>

        <div
          onClick={() => app.showToast('Complaint form', 'Photo upload + model picker — full flow in build phase')}
          className="hov-bright"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'var(--grad-orange)',
            color: '#fff',
            borderRadius: 999,
            padding: 13,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          <Icon name="camera" size={17} color="#ffffff" />
          New complaint with photo
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="phone" size={18} color="#0A52B4" />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>Helpline</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>1800 102 4455</div>
            </div>
          </div>
          <div style={{ flex: 1, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="message-circle" size={18} color="#1E9E5A" />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>WhatsApp</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Reply in 2 hrs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- notifications ---------- */

export function NotifsScreen() {
  return (
    <div>
      <BackHeader title="Notifications" />
      <div style={{ padding: '12px 16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {NOTIFS.map((n) => (
          <div key={n.title} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 14, padding: '12px 13px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: n.tileBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
              <Icon name={n.icon} size={17} color={n.iconColor} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{n.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{n.sub}</div>
            </div>
            <span style={{ fontSize: 10.5, color: 'var(--text-faint)', flex: 'none' }}>{n.time}</span>
          </div>
        ))}
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>Also mirrored on WhatsApp for offline dealers</div>
      </div>
    </div>
  );
}

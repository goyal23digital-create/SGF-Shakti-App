import { Icon } from '../lib/icons';
import { logoMark, logoMarkWhite } from '../assets';
import { fmt } from '../lib/format';
import { LANG_CHIPS, LANG_LABELS, LANG_ORDER } from './i18n';
import { useApp } from './store';
import { display, eyebrow, SCoin } from './components';

/* ---------- language pill row (login + more screens) ---------- */

export function LangPills({ grow = false }: { grow?: boolean }) {
  const app = useApp();
  return (
    <>
      {LANG_ORDER.map((code) => {
        const on = app.lang === code;
        return (
          <div
            key={code}
            onClick={() => app.setLang(code)}
            style={{
              ...(grow ? { flex: 1, textAlign: 'center' as const, padding: 9, fontSize: 13 } : { padding: '6px 13px', fontSize: 12.5 }),
              whiteSpace: 'nowrap',
              borderRadius: 999,
              fontWeight: on ? 700 : 500,
              cursor: 'pointer',
              border: `1px solid ${on ? 'var(--blue-600)' : 'var(--slate-300)'}`,
              background: on ? 'var(--blue-600)' : '#fff',
              color: on ? '#fff' : 'var(--slate-600)',
            }}
          >
            {LANG_LABELS[code]}
          </div>
        );
      })}
    </>
  );
}

/* ---------- login ---------- */

export function LoginScreen() {
  const app = useApp();
  const otpBox = (d: string) => (
    <div
      key={d}
      style={{
        width: 52,
        height: 56,
        border: '1.5px solid var(--blue-500)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...display,
        fontSize: 22,
      }}
    >
      {d}
    </div>
  );
  return (
    <div className="no-scrollbar" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '18px 18px 0' }}>
        <LangPills />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 30px', textAlign: 'center' }}>
        <img src={logoMark} alt="SGF Shakti" style={{ width: 84, height: 84, objectFit: 'contain', borderRadius: 22, boxShadow: 'var(--shadow-md)' }} />
        <div style={{ ...eyebrow, letterSpacing: '0.24em', fontSize: 13, color: 'var(--brand-accent-strong)', marginTop: 20 }}>SGF Shakti Partner App</div>
        <div style={{ ...display, fontSize: 40, lineHeight: 1.05, letterSpacing: '-0.01em', marginTop: 6 }}>Shakti Club</div>
        <div style={{ fontSize: 14.5, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5 }}>{app.t.earnLine}</div>
        {!app.otpStage ? (
          <div style={{ width: '100%', marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--slate-300)', borderRadius: 999, padding: '14px 18px', background: '#fff' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-body)', fontSize: 15 }}>+91</span>
              <span style={{ width: 1, height: 18, background: 'var(--slate-200)' }} />
              <span style={{ fontSize: 15, color: 'var(--text-strong)', fontWeight: 600, letterSpacing: '0.03em' }}>98140 22331</span>
            </div>
            <div
              onClick={app.getOtp}
              className="hov-bright"
              style={{
                background: 'var(--grad-orange)',
                color: '#fff',
                borderRadius: 999,
                padding: 15,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 15.5,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-accent)',
              }}
            >
              Get OTP
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14, animation: 'sc-fade-in 0.4s ease' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>OTP sent to +91 98140 22331</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>{['7', '3', '4', '1'].map(otpBox)}</div>
            <div
              onClick={app.verifyOtp}
              className="hov-bright"
              style={{
                background: 'var(--grad-orange)',
                color: '#fff',
                borderRadius: 999,
                padding: 15,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 15.5,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-accent)',
              }}
            >
              Verify &amp; enter the Club
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '0 30px 30px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--status-success)', background: 'var(--green-50)', borderRadius: 999, padding: '4px 10px', fontWeight: 600 }}>✓ Dealer code</span>
          <span style={{ fontSize: 11, color: 'var(--status-success)', background: 'var(--green-50)', borderRadius: 999, padding: '4px 10px', fontWeight: 600 }}>✓ GST</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--slate-100)', borderRadius: 999, padding: '4px 10px', fontWeight: 600 }}>Shop photo</span>
        </div>
        <div style={{ ...eyebrow, letterSpacing: '0.18em', fontSize: 11, color: 'var(--text-faint)' }}>हर घर शक्ति · Har Ghar Shakti</div>
      </div>
    </div>
  );
}

/* ---------- home ---------- */

const MISSIONS = (progressOn: boolean) => [
  {
    icon: 'rocket',
    title: 'New launch: Heritage Stool',
    sub: '2× SP on SGF-9901 till 31 Jul',
    reward: '2× SP',
    hasProgress: true,
    pctW: progressOn ? '32%' : '2%',
    progressLabel: '64 of 200 units',
    deadline: '25 days left',
  },
  { icon: 'wallet', title: 'Clear INV-2262 before the 10th', sub: 'Early payment on ₹86,400', reward: '+540 SP', hasProgress: false, pctW: '', progressLabel: '', deadline: '' },
  { icon: 'camera', title: 'Display photo of the month', sub: 'Your SGF corner, one photo', reward: '+100 SP', hasProgress: false, pctW: '', progressLabel: '', deadline: '' },
];

export function HomeScreen() {
  const app = useApp();
  const t = app.t;
  const quickActions = [
    { icon: 'shopping-cart', label: t.order, go: () => app.nav('shop') },
    { icon: 'qr-code', label: t.scan, go: () => app.nav('scan') },
    { icon: 'gift', label: t.rewards, go: () => app.nav('rewards') },
    { icon: 'wallet', label: t.ledger, go: () => app.nav('ledger') },
  ];
  return (
    <div>
      {/* header */}
      <div style={{ background: '#fff', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--slate-100)' }}>
        <img src={logoMark} alt="" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 9 }} />
        <div style={{ flex: 1 }}>
          <div style={{ ...eyebrow, fontSize: 11, color: 'var(--brand-accent-strong)' }}>Shakti Club</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>Gupta Furniture House · Ludhiana</div>
        </div>
        <div
          onClick={app.cycleLang}
          className="hov-bg"
          style={{ border: '1px solid var(--slate-200)', borderRadius: 999, padding: '5px 11px', fontSize: 12, fontWeight: 700, color: 'var(--brand-primary)', cursor: 'pointer' }}
        >
          {LANG_CHIPS[app.lang]}
        </div>
        <div
          onClick={() => app.nav('notifs')}
          className="hov-bg"
          style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Icon name="bell" size={20} color="#364150" />
          <span
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              width: 15,
              height: 15,
              borderRadius: 8,
              background: 'var(--orange-500)',
              color: '#fff',
              fontSize: 9.5,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            3
          </span>
        </div>
      </div>

      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 12px' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'conic-gradient(var(--orange-500) 0 91%, var(--slate-200) 91% 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--blue-700)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...display,
              fontSize: 16,
              border: '2.5px solid #fff',
            }}
          >
            RG
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...display, fontSize: 19 }}>{t.hello}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>SGF-LDH-042 · 14-month partner</div>
        </div>
      </div>

      {/* tier / SP hero card */}
      <div
        style={{
          margin: '0 16px',
          borderRadius: 20,
          background: 'var(--grad-blue)',
          color: '#fff',
          padding: '18px 18px 16px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-brand)',
        }}
      >
        <div style={{ position: 'absolute', right: -34, top: -34, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', right: 6, bottom: -58, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...eyebrow, fontSize: 11.5, background: 'rgba(255,255,255,0.16)', borderRadius: 999, padding: '4px 11px' }}>Shakti Silver</span>
          <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,186,31,0.22)', color: '#FFD68C', borderRadius: 999, padding: '4px 9px' }}>1.1× SP</span>
          <div style={{ flex: 1 }} />
          <img src={logoMarkWhite} alt="" style={{ height: 22, opacity: 0.9 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <SCoin size={44} fontSize={22} animate shadow="0 4px 14px rgba(247,148,29,0.5)" />
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ ...display, fontSize: 34, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{fmt(app.spShown)}</span>
              <span style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: 15, letterSpacing: '0.08em', color: '#FFD68C' }}>SP</span>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: -2 }}>
              {t.balance} · ≈ ₹{fmt(Math.round(app.sp * 0.25))} {t.worth}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>
            <span>Silver</span>
            <span style={{ color: '#FFD68C', fontWeight: 700 }}>Shakti Gold</span>
          </div>
          <div style={{ height: 9, borderRadius: 999, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                borderRadius: 999,
                background: 'var(--grad-orange)',
                width: app.progressOn ? '91%' : '2%',
                transition: 'width 1.5s cubic-bezier(0.2,0.6,0.2,1)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontSize: 11.5, color: 'rgba(255,255,255,0.75)' }}>
            <span>12-mo billing ₹13.7L of ₹15L</span>
            <span style={{ fontWeight: 700, color: '#fff' }}>₹1,30,000 {t.toGold}</span>
          </div>
        </div>
      </div>

      {/* festival banner */}
      {app.festival && (
        <div
          style={{
            margin: '12px 16px 0',
            borderRadius: 16,
            background: 'var(--grad-orange)',
            color: '#fff',
            padding: '13px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: 'var(--shadow-accent)',
          }}
        >
          <Icon name="party-popper" size={24} color="#ffffff" />
          <div style={{ flex: 1 }}>
            <div style={{ ...display, fontSize: 15 }}>Shakti Summer Dhamaka</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>2× SP on every paid invoice · ends 20 Jul</div>
          </div>
          <span style={{ ...display, fontSize: 20 }}>2×</span>
        </div>
      )}

      {/* scratch shelf */}
      <div
        onClick={app.openScratch}
        className="hov-lift"
        style={{
          margin: '12px 16px 0',
          borderRadius: 16,
          background: '#fff',
          border: '1px solid var(--slate-200)',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 13,
          cursor: 'pointer',
          transition: 'transform 0.18s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: 56,
            height: 42,
            borderRadius: 10,
            background: 'linear-gradient(135deg,#D7DDE6,#9AA8B8)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', color: '#4C5969' }}>SCRATCH</span>
          <span style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <span style={{ position: 'absolute', top: 0, bottom: 0, width: 26, background: 'rgba(255,255,255,0.65)', animation: 'sc-shimmer 2.2s ease-in-out infinite' }} />
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{t.scratchTitle}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {app.scratchUsed ? 'Next card on your next paid invoice' : '1 card waiting · expires in 72 hrs'}
          </div>
        </div>
        <Icon name="chevron-right" size={19} color="#9AA8B8" />
      </div>

      {/* missions */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ ...display, fontSize: 17 }}>{t.missions}</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>3 of 3 live</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MISSIONS(app.progressOn).map((m) => (
            <div key={m.title} style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 16, padding: '13px 14px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  <Icon name={m.icon} size={20} color="#0A52B4" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.25 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{m.sub}</div>
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: 'var(--brand-accent-strong)',
                    background: 'var(--orange-50)',
                    border: '1px solid var(--orange-100)',
                    borderRadius: 999,
                    padding: '4px 10px',
                    flex: 'none',
                  }}
                >
                  {m.reward}
                </span>
              </div>
              {m.hasProgress && (
                <div style={{ marginTop: 11 }}>
                  <div style={{ height: 6, borderRadius: 999, background: 'var(--slate-100)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: 'var(--grad-orange)', width: m.pctW, transition: 'width 1.2s cubic-bezier(0.2,0.6,0.2,1)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 5 }}>
                    <span>{m.progressLabel}</span>
                    <span>{m.deadline}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* quick actions */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ ...display, fontSize: 17, marginBottom: 10 }}>{t.quick}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {quickActions.map((q) => (
            <div
              key={q.icon}
              onClick={q.go}
              className="hov-lift-shadow"
              style={{
                background: '#fff',
                border: '1px solid var(--slate-200)',
                borderRadius: 16,
                padding: '13px 4px 11px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 7,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <Icon name={q.icon} size={22} color="#0A3F86" strokeWidth={1.8} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-body)' }}>{q.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* leaderboard teaser */}
      <div
        onClick={() => app.nav('leaderboard')}
        className="hov-lift"
        style={{
          margin: '20px 16px 0',
          background: '#fff',
          border: '1px solid var(--slate-200)',
          borderRadius: 16,
          padding: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 13,
          cursor: 'pointer',
          transition: 'transform 0.18s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--orange-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="trophy" size={21} color="#E0790C" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>
            {t.rank}: <span style={{ color: 'var(--brand-accent-strong)' }}>#4</span> of 38
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ludhiana district · Silver league · 370 SP behind #3</div>
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-link)' }}>{t.viewBoard}</span>
      </div>

      <div style={{ textAlign: 'center', padding: '26px 40px 22px' }}>
        <div style={{ ...eyebrow, fontSize: 11, color: 'var(--text-faint)' }}>हर घर शक्ति</div>
      </div>
    </div>
  );
}

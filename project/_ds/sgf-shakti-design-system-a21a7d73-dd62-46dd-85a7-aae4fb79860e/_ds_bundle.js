/* @ds-bundle: {"format":4,"namespace":"SGFShaktiDesignSystem_a21a7d","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"StatCard","sourcePath":"components/core/StatCard.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"7641cfb99420","components/core/Badge.jsx":"864a97fd8623","components/core/Card.jsx":"f7b2d827b541","components/core/StatCard.jsx":"4bb587c483ad","components/core/Tag.jsx":"af76d5d17f81","components/data/Table.jsx":"9918d9fc1db9","components/feedback/Alert.jsx":"9f3107f7bb49","components/feedback/Dialog.jsx":"cd6306e4b1df","components/feedback/ProgressBar.jsx":"f54132c0bce0","components/feedback/Toast.jsx":"f5d64438273c","components/feedback/Tooltip.jsx":"7be5d6e057ce","components/forms/Button.jsx":"b5618b303f05","components/forms/Checkbox.jsx":"23d04155901e","components/forms/IconButton.jsx":"b14b3055549f","components/forms/Input.jsx":"f51b4e72cd91","components/forms/Radio.jsx":"6f42a19a5927","components/forms/Select.jsx":"4d30b462d2b3","components/forms/Switch.jsx":"fe645c2c3986","components/forms/Textarea.jsx":"686c3e85d790","components/navigation/Breadcrumb.jsx":"e33e37a8e77a","components/navigation/Pagination.jsx":"084822088d1f","components/navigation/Tabs.jsx":"c65e63392032","guidelines/tweaks-panel.jsx":"6591467622ed"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SGFShaktiDesignSystem_a21a7d = window.SGFShaktiDesignSystem_a21a7d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const dims = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 52,
  xl: 72
};

/** User / dealer avatar. Shows image, else initials on a brand gradient. */
function Avatar({
  src,
  name = '',
  size = 'md',
  square = false,
  style = {},
  ...rest
}) {
  const d = dims[size] || dims.md;
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      width: d,
      height: d,
      borderRadius: square ? 'var(--radius-md)' : '50%',
      overflow: 'hidden',
      background: 'var(--grad-blue)',
      color: '#fff',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: d * 0.4,
      letterSpacing: '0.01em',
      boxShadow: 'var(--shadow-xs)',
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials || '?');
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  neutral: {
    bg: 'var(--slate-100)',
    fg: 'var(--slate-700)'
  },
  brand: {
    bg: 'var(--blue-50)',
    fg: 'var(--blue-700)'
  },
  accent: {
    bg: 'var(--orange-100)',
    fg: 'var(--orange-700)'
  },
  success: {
    bg: 'var(--status-success-bg)',
    fg: 'var(--green-600)'
  },
  warning: {
    bg: 'var(--status-warning-bg)',
    fg: 'var(--amber-600)'
  },
  danger: {
    bg: 'var(--status-danger-bg)',
    fg: 'var(--red-600)'
  }
};
const solids = {
  neutral: {
    bg: 'var(--slate-600)',
    fg: '#fff'
  },
  brand: {
    bg: 'var(--brand-primary)',
    fg: '#fff'
  },
  accent: {
    bg: 'var(--orange-500)',
    fg: '#fff'
  },
  success: {
    bg: 'var(--status-success)',
    fg: '#fff'
  },
  warning: {
    bg: 'var(--status-warning)',
    fg: '#fff'
  },
  danger: {
    bg: 'var(--status-danger)',
    fg: '#fff'
  }
};

/** Small status / category label. */
function Badge({
  tone = 'neutral',
  solid = false,
  dot = false,
  size = 'md',
  style = {},
  children,
  ...rest
}) {
  const c = (solid ? solids : tones)[tone] || tones.neutral;
  const sm = size === 'sm';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: sm ? '2px 8px' : '3px 11px',
      fontFamily: 'var(--font-body)',
      fontSize: sm ? 11 : 12.5,
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
      color: c.fg,
      background: c.bg,
      borderRadius: 'var(--radius-pill)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: c.fg,
      opacity: solid ? 0.9 : 1
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Surface container. `interactive` adds hover lift. `pad` controls inner padding. */
function Card({
  interactive = false,
  pad = 'md',
  elevation = 'sm',
  style = {},
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pads = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)'
  };
  const shadows = {
    none: 'none',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: pads[pad],
      boxShadow: interactive && hover ? 'var(--shadow-lg)' : shadows[elevation],
      transform: interactive && hover ? 'translateY(-3px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard)',
      cursor: interactive ? 'pointer' : 'default',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/StatCard.jsx
try { (() => {
/** KPI / metric tile for dashboards. */
function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendDir = 'up',
  accent = 'brand',
  style = {}
}) {
  const accents = {
    brand: 'var(--brand-primary)',
    accent: 'var(--orange-500)',
    success: 'var(--status-success)',
    danger: 'var(--status-danger)'
  };
  const trendColor = trendDir === 'up' ? 'var(--status-success)' : 'var(--status-danger)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-condensed)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-md)',
      background: 'var(--blue-50)',
      color: accents[accent]
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 32,
      lineHeight: 1,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-muted)'
    }
  }, unit)), trend && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 13,
      fontWeight: 600,
      color: trendColor
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: trendDir === 'down' ? 'scaleY(-1)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 17l6-6 4 4 8-8M21 7v6M21 7h-6"
  })), trend));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Removable filter / selection chip. */
function Tag({
  selected = false,
  onRemove,
  leadingIcon,
  style = {},
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '5px 12px',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 500,
      color: selected ? 'var(--brand-primary)' : 'var(--text-body)',
      background: selected ? 'var(--blue-50)' : 'var(--surface-card)',
      border: `1px solid ${selected ? 'var(--border-brand)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-pill)',
      cursor: onRemove || rest.onClick ? 'pointer' : 'default',
      transition: 'all var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), leadingIcon, children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    "aria-label": "Remove",
    style: {
      display: 'flex',
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      color: hover ? 'var(--text-strong)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
/**
 * Data table. columns: [{key,header,align,width,render}]. rows: array of objects.
 */
function Table({
  columns = [],
  rows = [],
  rowKey = 'id',
  stickyHeader = false,
  onRowClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      overflowX: 'auto',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-card)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: '12px 16px',
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-condensed)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      background: 'var(--surface-sunken)',
      borderBottom: '1px solid var(--border-subtle)',
      width: c.width,
      position: stickyHeader ? 'sticky' : 'static',
      top: 0,
      zIndex: 1
    }
  }, c.header)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((row, ri) => /*#__PURE__*/React.createElement("tr", {
    key: row[rowKey] ?? ri,
    onClick: onRowClick ? () => onRowClick(row) : undefined,
    style: {
      cursor: onRowClick ? 'pointer' : 'default',
      transition: 'background var(--dur-fast) var(--ease-standard)'
    },
    onMouseEnter: e => {
      if (onRowClick) e.currentTarget.style.background = 'var(--slate-50)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      textAlign: c.align || 'left',
      padding: '13px 16px',
      fontSize: 14,
      color: 'var(--text-body)',
      borderBottom: ri === rows.length - 1 ? 'none' : '1px solid var(--border-subtle)'
    }
  }, c.render ? c.render(row[c.key], row) : row[c.key])))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
const tones = {
  info: {
    bg: 'var(--status-info-bg)',
    border: 'var(--blue-200)',
    fg: 'var(--blue-700)',
    icon: 'info'
  },
  success: {
    bg: 'var(--status-success-bg)',
    border: '#Bde8cd',
    fg: 'var(--green-600)',
    icon: 'success'
  },
  warning: {
    bg: 'var(--status-warning-bg)',
    border: '#F7DFA8',
    fg: 'var(--amber-600)',
    icon: 'warning'
  },
  danger: {
    bg: 'var(--status-danger-bg)',
    border: '#F6C9C9',
    fg: 'var(--red-600)',
    icon: 'danger'
  }
};
const paths = {
  info: 'M12 16v-4M12 8h.01',
  success: 'M20 6L9 17l-5-5',
  warning: 'M12 9v4M12 17h.01',
  danger: 'M15 9l-6 6M9 9l6 6'
};

/** Inline contextual message banner. */
function Alert({
  tone = 'info',
  title,
  onClose,
  style = {},
  children
}) {
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      gap: 12,
      padding: '14px 16px',
      fontFamily: 'var(--font-body)',
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      display: 'flex',
      color: t.fg,
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, tone !== 'success' && /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: paths[tone]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14.5,
      color: 'var(--text-strong)',
      marginBottom: children ? 3 : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'var(--text-body)',
      lineHeight: 1.5
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      flex: 'none',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
/** Modal dialog. Render conditionally on `open`. */
function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  width = 460,
  children
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onMouseDown: e => {
      if (e.target === e.currentTarget) onClose && onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      background: 'rgba(11,33,66,0.45)',
      backdropFilter: 'blur(3px)',
      animation: 'sgfFade var(--dur-base) var(--ease-standard)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      width: '100%',
      maxWidth: width,
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-xl)',
      overflow: 'hidden',
      animation: 'sgfPop var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      padding: '22px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 21,
      color: 'var(--text-strong)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 14,
      color: 'var(--text-muted)',
      lineHeight: 1.5
    }
  }, description)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      flex: 'none',
      border: 'none',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-sm)',
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  })))), children && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 24px 0',
      fontSize: 14.5,
      color: 'var(--text-body)',
      lineHeight: 1.55
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      padding: 24,
      marginTop: 6
    }
  }, footer)), /*#__PURE__*/React.createElement("style", null, `@keyframes sgfFade{from{opacity:0}to{opacity:1}}@keyframes sgfPop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}`));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
/** Linear progress bar. `value` 0–100, or omit for indeterminate. */
function ProgressBar({
  value,
  label,
  tone = 'brand',
  size = 'md',
  showValue = false,
  style = {}
}) {
  const tones = {
    brand: 'var(--grad-blue)',
    accent: 'var(--grad-orange)',
    success: 'var(--status-success)'
  };
  const h = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const indeterminate = value === undefined || value === null;
  const pct = Math.max(0, Math.min(100, value || 0));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 6,
      fontSize: 13
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, label), showValue && !indeterminate && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: h,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-sunken)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      borderRadius: 'var(--radius-pill)',
      background: tones[tone] || tones.brand,
      width: indeterminate ? '40%' : `${pct}%`,
      transition: 'width var(--dur-slow) var(--ease-standard)',
      animation: indeterminate ? 'sgfIndet 1.2s var(--ease-standard) infinite' : 'none'
    }
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes sgfIndet{0%{margin-left:-40%}100%{margin-left:100%}}`));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const tones = {
  default: {
    fg: 'var(--text-strong)',
    accent: 'var(--brand-primary)'
  },
  success: {
    fg: 'var(--text-strong)',
    accent: 'var(--status-success)'
  },
  danger: {
    fg: 'var(--text-strong)',
    accent: 'var(--status-danger)'
  }
};

/** Single toast notification (compose your own stack/positioning). */
function Toast({
  tone = 'default',
  title,
  message,
  icon,
  onClose,
  style = {}
}) {
  const t = tones[tone] || tones.default;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      minWidth: 280,
      maxWidth: 380,
      padding: '13px 14px',
      fontFamily: 'var(--font-body)',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      borderLeft: `4px solid ${t.accent}`,
      animation: 'sgfToastIn var(--dur-base) var(--ease-out)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      display: 'flex',
      color: t.accent,
      marginTop: 1
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: t.fg
    }
  }, title), message && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: title ? 2 : 0,
      lineHeight: 1.45
    }
  }, message)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      flex: 'none',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-faint)',
      display: 'flex',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  }))), /*#__PURE__*/React.createElement("style", null, `@keyframes sgfToastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
/** Hover tooltip wrapper. */
function Tooltip({
  label,
  placement = 'top',
  children
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: 8
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: 8
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: 8
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: 8
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      zIndex: 1100,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      padding: '6px 10px',
      fontFamily: 'var(--font-body)',
      fontSize: 12.5,
      fontWeight: 500,
      color: '#fff',
      background: 'var(--slate-900)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-md)',
      animation: 'sgfTipIn var(--dur-fast) var(--ease-out)',
      ...pos[placement]
    }
  }, label, /*#__PURE__*/React.createElement("style", null, `@keyframes sgfTipIn{from{opacity:0}to{opacity:1}}`)));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: {
    padding: '0 14px',
    height: 34,
    fontSize: 13,
    gap: 6
  },
  md: {
    padding: '0 20px',
    height: 42,
    fontSize: 15,
    gap: 8
  },
  lg: {
    padding: '0 28px',
    height: 52,
    fontSize: 17,
    gap: 10
  }
};
const variants = {
  accent: {
    background: 'var(--grad-orange)',
    color: 'var(--text-on-accent)',
    border: '1px solid transparent',
    boxShadow: 'var(--shadow-accent)'
  },
  primary: {
    background: 'var(--brand-primary)',
    color: '#fff',
    border: '1px solid transparent',
    boxShadow: 'var(--shadow-brand)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--brand-primary)',
    border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-xs)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--brand-primary)',
    border: '1px solid transparent',
    boxShadow: 'none'
  },
  danger: {
    background: 'var(--status-danger)',
    color: '#fff',
    border: '1px solid transparent',
    boxShadow: 'none'
  }
};

/**
 * SGF Shakti primary action button.
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  as: Tag = 'button',
  style = {},
  children,
  ...rest
}) {
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: s.fontSize,
    lineHeight: 1,
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap',
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform var(--dur-fast) var(--ease-standard), filter var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
    opacity: disabled ? 0.5 : 1,
    transform: !disabled && press ? 'scale(0.97)' : !disabled && hover ? 'translateY(-1px)' : 'none',
    filter: !disabled && hover ? 'brightness(1.05)' : 'none',
    ...v,
    ...style
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    type: Tag === 'button' ? type : undefined,
    disabled: Tag === 'button' ? disabled : undefined,
    style: base,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox with label. Controlled via `checked`/`onChange` or uncontrolled. */
function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  ...rest
}) {
  const reactId = React.useId();
  const inputId = id || reactId;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: description ? 'flex-start' : 'center',
      fontFamily: 'var(--font-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: "checkbox",
    checked: on,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 1,
      height: 1
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      flex: 'none',
      marginTop: description ? 2 : 0,
      borderRadius: 'var(--radius-xs)',
      background: on ? 'var(--brand-primary)' : 'var(--surface-card)',
      border: `1.5px solid ${on ? 'var(--brand-primary)' : 'var(--border-strong)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-standard)'
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4L19 7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: 34,
  md: 42,
  lg: 52
};
const variants = {
  solid: {
    background: 'var(--brand-primary)',
    color: '#fff',
    border: '1px solid transparent'
  },
  accent: {
    background: 'var(--grad-orange)',
    color: '#fff',
    border: '1px solid transparent'
  },
  soft: {
    background: 'var(--blue-50)',
    color: 'var(--brand-primary)',
    border: '1px solid transparent'
  },
  outline: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-default)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-body)',
    border: '1px solid transparent'
  }
};

/** Square/round icon-only button. */
function IconButton({
  variant = 'ghost',
  size = 'md',
  round = false,
  disabled = false,
  label,
  style = {},
  children,
  ...rest
}) {
  const dim = sizes[size] || sizes.md;
  const v = variants[variant] || variants.ghost;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      flex: 'none',
      borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'all var(--dur-fast) var(--ease-standard)',
      filter: hover && !disabled ? 'brightness(0.96)' : 'none',
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text input with optional label, leading icon, hint and error. */
function Input({
  label,
  hint,
  error,
  leadingIcon,
  trailingIcon,
  size = 'md',
  id,
  style = {},
  disabled = false,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId();
  const inputId = id || reactId;
  const h = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const fs = size === 'lg' ? 16 : 15;
  const borderColor = error ? 'var(--status-danger)' : focus ? 'var(--border-brand)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      width: '100%',
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: h,
      padding: '0 14px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? 'var(--ring-focus)' : 'var(--shadow-xs)',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      opacity: disabled ? 0.6 : 1
    }
  }, leadingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      display: 'flex'
    }
  }, leadingIcon), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: fs,
      color: 'var(--text-strong)',
      minWidth: 0,
      ...style
    }
  }, rest)), trailingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      display: 'flex'
    }
  }, trailingIcon)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--status-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
/** Radio group. options: [{value,label,description}]. Controlled via value/onChange. */
function Radio({
  name,
  options = [],
  value,
  defaultValue,
  onChange,
  disabled = false
}) {
  const reactName = React.useId();
  const groupName = name || reactName;
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internal;
  const pick = v => {
    if (disabled) return;
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      fontFamily: 'var(--font-body)'
    }
  }, options.map(o => {
    const on = selected === o.value;
    return /*#__PURE__*/React.createElement("label", {
      key: o.value,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: o.description ? 'flex-start' : 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: groupName,
      checked: on,
      onChange: () => pick(o.value),
      disabled: disabled,
      style: {
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 20,
        height: 20,
        flex: 'none',
        borderRadius: '50%',
        marginTop: o.description ? 2 : 0,
        border: `1.5px solid ${on ? 'var(--brand-primary)' : 'var(--border-strong)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all var(--dur-fast) var(--ease-standard)'
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: 'var(--brand-primary)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--text-strong)'
      }
    }, o.label), o.description && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        color: 'var(--text-muted)'
      }
    }, o.description)));
  }));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Styled native select with label/hint/error. Pass options as [{value,label}] or children. */
function Select({
  label,
  hint,
  error,
  options,
  size = 'md',
  id,
  style = {},
  disabled = false,
  children,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId();
  const inputId = id || reactId;
  const h = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const borderColor = error ? 'var(--status-danger)' : focus ? 'var(--border-brand)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      width: '100%',
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: inputId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      height: h,
      padding: '0 38px 0 14px',
      appearance: 'none',
      WebkitAppearance: 'none',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-strong)',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      cursor: 'pointer',
      boxShadow: focus ? 'var(--ring-focus)' : 'var(--shadow-xs)',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, rest), options ? options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)) : children), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    style: {
      position: 'absolute',
      right: 14,
      color: 'var(--text-muted)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--status-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Toggle switch. */
function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  size = 'md',
  id
}) {
  const reactId = React.useId();
  const inputId = id || reactId;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const w = size === 'sm' ? 38 : 46;
  const h = size === 'sm' ? 22 : 26;
  const knob = h - 6;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    id: inputId,
    onClick: toggle,
    disabled: disabled,
    style: {
      width: w,
      height: h,
      flex: 'none',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      padding: 0,
      background: on ? 'var(--status-success)' : 'var(--slate-300)',
      cursor: 'inherit',
      position: 'relative',
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? w - knob - 3 : 3,
      width: knob,
      height: knob,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-base) var(--ease-standard)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text-strong)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Multi-line text input. */
function Textarea({
  label,
  hint,
  error,
  rows = 4,
  id,
  style = {},
  disabled = false,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId();
  const inputId = id || reactId;
  const borderColor = error ? 'var(--status-danger)' : focus ? 'var(--border-brand)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      width: '100%',
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    rows: rows,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      resize: 'vertical',
      padding: '12px 14px',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.5,
      color: 'var(--text-strong)',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focus ? 'var(--ring-focus)' : 'var(--shadow-xs)',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--status-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
/** Breadcrumb trail. items: [{label, href}]. Last is current page. */
function Breadcrumb({
  items = [],
  style = {}
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    style: {
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 7,
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7
      }
    }, last ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: 'var(--text-strong)'
      }
    }, it.label) : /*#__PURE__*/React.createElement("a", {
      href: it.href || '#',
      style: {
        fontSize: 13.5,
        fontWeight: 500,
        color: 'var(--text-muted)',
        textDecoration: 'none'
      }
    }, it.label), !last && /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "var(--text-faint)",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 18l6-6-6-6"
    })));
  })));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
/** Page pagination. */
function Pagination({
  page = 1,
  pageCount = 1,
  onChange,
  style = {}
}) {
  const go = p => {
    if (p >= 1 && p <= pageCount && p !== page) onChange && onChange(p);
  };
  const pages = [];
  const add = p => pages.push(p);
  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) add(i);
  } else {
    add(1);
    if (page > 3) add('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) add(i);
    if (page < pageCount - 2) add('…');
    add(pageCount);
  }
  const btn = (content, opts = {}) => {
    const {
      active,
      disabled,
      onClick,
      label
    } = opts;
    return /*#__PURE__*/React.createElement("button", {
      key: label || content,
      onClick: onClick,
      disabled: disabled,
      "aria-label": label,
      style: {
        minWidth: 38,
        height: 38,
        padding: '0 10px',
        border: `1px solid ${active ? 'var(--brand-primary)' : 'var(--border-default)'}`,
        background: active ? 'var(--brand-primary)' : 'var(--surface-card)',
        color: active ? '#fff' : 'var(--text-body)',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all var(--dur-fast) var(--ease-standard)'
      }
    }, content);
  };
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Pagination",
    style: {
      display: 'inline-flex',
      gap: 6,
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, btn(/*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  })), {
    disabled: page <= 1,
    onClick: () => go(page - 1),
    label: 'Previous'
  }), pages.map((p, i) => p === '…' ? /*#__PURE__*/React.createElement("span", {
    key: 'e' + i,
    style: {
      minWidth: 24,
      textAlign: 'center',
      alignSelf: 'center',
      color: 'var(--text-faint)'
    }
  }, "\u2026") : btn(p, {
    active: p === page,
    onClick: () => go(p),
    label: 'Page ' + p
  })), btn(/*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 18l6-6-6-6"
  })), {
    disabled: page >= pageCount,
    onClick: () => go(page + 1),
    label: 'Next'
  }));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/** Tabs. items: [{value,label,icon}]. Controlled via value/onChange or uncontrolled. */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  style = {}
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const isControlled = value !== undefined;
  const active = isControlled ? value : internal;
  const pick = v => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  if (variant === 'pill') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        gap: 4,
        padding: 4,
        background: 'var(--surface-sunken)',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)',
        ...style
      }
    }, items.map(it => {
      const on = active === it.value;
      return /*#__PURE__*/React.createElement("button", {
        key: it.value,
        onClick: () => pick(it.value),
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '8px 16px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          fontWeight: 600,
          borderRadius: 'var(--radius-pill)',
          color: on ? 'var(--brand-primary)' : 'var(--text-muted)',
          background: on ? 'var(--surface-card)' : 'transparent',
          boxShadow: on ? 'var(--shadow-sm)' : 'none',
          transition: 'all var(--dur-fast) var(--ease-standard)'
        }
      }, it.icon, it.label);
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--border-subtle)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, items.map(it => {
    const on = active === it.value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      onClick: () => pick(it.value),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '11px 16px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 14.5,
        fontWeight: 600,
        marginBottom: -1,
        color: on ? 'var(--brand-primary)' : 'var(--text-muted)',
        borderBottom: `2.5px solid ${on ? 'var(--brand-accent)' : 'transparent'}`,
        transition: 'all var(--dur-fast) var(--ease-standard)'
      }
    }, it.icon, it.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// guidelines/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "guidelines/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.Tabs = __ds_scope.Tabs;

})();

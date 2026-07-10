interface LogoProps {
  logoDataUri?: string | null;
  size?: number;
}

/**
 * Company logo. Renders the uploaded logo (data URI) when present,
 * otherwise a polished default "SGF" monogram that scales 32–96px.
 */
export function Logo({ logoDataUri, size = 40 }: LogoProps) {
  if (typeof logoDataUri === 'string' && logoDataUri.trim() !== '') {
    return (
      <img
        src={logoDataUri}
        alt="Company logo"
        className="object-contain rounded-xl bg-white flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label="SGF logo"
      className="flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <defs>
        <linearGradient id="sgf-monogram-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a1f2e" />
          <stop offset="100%" stopColor="#3730a3" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="96" height="96" rx="22" fill="url(#sgf-monogram-bg)" />
      <text
        x="48"
        y="46"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#d4af37"
        fontFamily="'Inter', system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="30"
        letterSpacing="1.5"
      >
        SGF
      </text>
      <rect x="30" y="66" width="36" height="3.5" rx="1.75" fill="#d4af37" opacity="0.8" />
    </svg>
  );
}

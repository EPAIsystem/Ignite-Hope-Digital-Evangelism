// Inline circular monogram — reused everywhere "Ignite Hope" appears as
// the primary brand identity, paired with the app's PWA/favicon design.
export default function IgniteMark({ size = 40, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="20" r="19" fill="#1a120d" stroke="#b9842a" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#b9842a" strokeWidth="0.75" opacity="0.6" />
      <text x="20" y="25" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" fontSize="13" fill="#b9842a">
        IH
      </text>
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <span className="logo-mark" aria-hidden="true"><i /><b /><em /></span>
      {!compact && <span className="brand-copy"><strong>TEKİRDAĞ</strong><small>BASKETBOL İL TEMSİLCİLİĞİ</small></span>}
    </div>
  );
}

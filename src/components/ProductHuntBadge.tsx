import { siteConfig } from '@/data/site';

type ProductHuntBadgeProps = {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
};

const ProductHuntBadge = ({
  variant = 'dark',
  size = 'md',
  className = '',
}: ProductHuntBadgeProps) => {
  const { url, label } = siteConfig.productHunt;
  const href = `${url}?utm_source=badge&utm_medium=badge&utm_s_campaign=badge`;

  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs gap-2' : 'px-4 py-2 text-sm gap-2.5';
  const variantClasses =
    variant === 'light'
      ? 'bg-white/10 border-white/25 text-white hover:bg-white/20'
      : 'bg-[#DA552F] border-[#DA552F] text-white hover:bg-[#c44a28]';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center rounded-full border font-semibold transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      <ProductHuntIcon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
      <span>{label}</span>
    </a>
  );
};

const ProductHuntIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.2 14.4H9.6V7.2h3.6c2.04 0 3.6 1.32 3.6 3.36 0 1.44-.72 2.52-1.92 3.12l2.28 2.88h-2.64l-1.92-2.52zm-.24-4.56c.96 0 1.44-.48 1.44-1.2 0-.72-.48-1.2-1.44-1.2H11.4v2.4h1.56z" />
  </svg>
);

export default ProductHuntBadge;

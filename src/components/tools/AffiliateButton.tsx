import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isExternalUrl, trackAffiliateClick } from '@/utils/airbnbTools';

type Props = {
  toolSlug: string;
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
};

export function AffiliateButton({
  toolSlug,
  href,
  children,
  className,
  variant = 'default',
  size = 'default',
}: Props) {
  const external = isExternalUrl(href);

  if (!external) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link to={href} onClick={() => trackAffiliateClick(toolSlug, href)}>
          {children}
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        onClick={() => trackAffiliateClick(toolSlug, href)}
      >
        {children}
        <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
      </a>
    </Button>
  );
}

import { useMemo, useState } from 'react';
import type { Conciergerie } from '@/types/conciergerie';
import { getConciergerieLogoCandidates } from '@/utils/conciergerieLogo';

type Props = {
  conciergerie: Pick<Conciergerie, 'name' | 'logo' | 'logoUrl' | 'website' | 'slug'>;
  className?: string;
  imgClassName?: string;
  alt?: string;
};

/**
 * Affiche le logo avec fallback automatique :
 * URL custom → logo remote (site officiel) → SVG local → favicon → default.
 */
export default function ConciergerieLogo({
  conciergerie,
  className,
  imgClassName = 'w-16 h-16 object-contain',
  alt,
}: Props) {
  const candidates = useMemo(() => getConciergerieLogoCandidates(conciergerie), [conciergerie]);
  const [index, setIndex] = useState(0);
  const src = candidates[Math.min(index, candidates.length - 1)] ?? '/logos/default.svg';

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt ?? `Logo ${conciergerie.name}`}
        className={imgClassName}
        loading="lazy"
        decoding="async"
        onError={() => {
          setIndex((i) => (i + 1 < candidates.length ? i + 1 : i));
        }}
      />
    </div>
  );
}

import {
  Layers,
  LayoutDashboard,
  TrendingUp,
  Lock,
  KeyRound,
  Sparkles,
  MessageSquare,
  Wallet,
  Shield,
  BarChart3,
  Globe,
  Camera,
  Workflow,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import type { AirbnbToolCategorySlug } from '@/types/airbnbTool';

const map: Record<AirbnbToolCategorySlug, LucideIcon> = {
  'channel-manager': Layers,
  pms: LayoutDashboard,
  'pricing-dynamique': TrendingUp,
  'serrures-connectees': Lock,
  'check-in-automatique': KeyRound,
  menage: Sparkles,
  messagerie: MessageSquare,
  comptabilite: Wallet,
  assurance: Shield,
  'analyse-marche': BarChart3,
  'site-web': Globe,
  photos: Camera,
  automatisation: Workflow,
  formation: GraduationCap,
};

export function getCategoryIcon(slug: AirbnbToolCategorySlug): LucideIcon {
  return map[slug] ?? Layers;
}

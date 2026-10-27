import {
  LayoutDashboard,
  Layers,
  FileText,
  FolderTree,
  MessageSquare,
  FileSpreadsheet,
  Bot,
  Building2,
  Package,
  Star,
  Search,
  ShieldCheck,
  Zap,
  Settings,
  LucideIcon,
  HelpCircle,
  Database,
  BarChart3,
  Network,
} from "lucide-react";
import { Role } from "../lib/types";

export type ModuleGroup = "taxonomy" | "content" | "ai" | "system";

export interface CMSModule {
  id: string;
  label: string;
  href: string;
  iconName: string;
  group: ModuleGroup;
  badge?: string;
  minRole: Role;
  description: string;
  status: "active" | "beta" | "planned";
}

export const MODULE_GROUPS: Record<ModuleGroup, { label: string; order: number }> = {
  taxonomy: { label: "Taxonomy & Directory Hierarchy", order: 1 },
  content: { label: "Research & Content Publishing", order: 2 },
  ai: { label: "AI & Agency Intelligence", order: 3 },
  system: { label: "Platform & Governance", order: 4 },
};

/**
 * Extensible CMS Module Registry
 * Reflects the TrustValue domain hierarchy:
 * Sector -> Category -> Provider (Brand) -> Product/Plan (Offering)
 */
export const CMS_MODULES: CMSModule[] = [
  // --- 1. Core Taxonomy & Directory Hierarchy (Interlinked) ---
  {
    id: "sectors",
    label: "1. Sectors Taxonomy",
    href: "/dashboard/sectors",
    iconName: "Layers",
    group: "taxonomy",
    badge: "18 Hubs",
    minRole: "editor",
    description: "Level 0 Root: 18 audited sectors (Insurance, Real Estate, Banking, Healthcare...)",
    status: "active",
  },
  {
    id: "categories",
    label: "2. Sector Categories",
    href: "/dashboard/categories",
    iconName: "FolderTree",
    group: "taxonomy",
    badge: "Taxonomy Tree",
    minRole: "editor",
    description: "Level 1-2: Hierarchical category tree per sector (e.g. Life -> Term Insurance)",
    status: "active",
  },
  {
    id: "providers",
    label: "3. Providers & Brands",
    href: "/dashboard/providers",
    iconName: "Building2",
    group: "taxonomy",
    badge: "Brands",
    minRole: "editor",
    description: "Registered brands, insurers, banks, builders operating across sectors",
    status: "active",
  },
  {
    id: "offerings",
    label: "4. Products & Plans",
    href: "/dashboard/offerings",
    iconName: "Package",
    group: "taxonomy",
    badge: "Offerings",
    minRole: "editor",
    description: "Specific underwritten plans, loan schemes, or projects linked to (Sector, Provider, Category)",
    status: "active",
  },

  // --- 2. Research & Content Publishing ---
  {
    id: "articles",
    label: "Articles & Research",
    href: "/dashboard/blogs",
    iconName: "FileText",
    group: "content",
    minRole: "editor",
    description: "Investigative consumer guides, circular explainers, and regulatory audits",
    status: "active",
  },
  {
    id: "article_categories",
    label: "Blog Categories",
    href: "/dashboard/blogs/categories",
    iconName: "FolderTree",
    group: "content",
    minRole: "editor",
    description: "Editorial blog categories, taxonomy, and SEO descriptions",
    status: "active",
  },
  {
    id: "comments",
    label: "Comments & Discussions",
    href: "/dashboard/blogs/comments",
    iconName: "MessageSquare",
    group: "content",
    minRole: "editor",
    description: "Moderate user queries and community discussions across articles",
    status: "active",
  },
  {
    id: "import",
    label: "Bulk Excel Import",
    href: "/dashboard/blogs/import",
    iconName: "FileSpreadsheet",
    group: "content",
    minRole: "admin",
    description: "Mass batch upload of articles, FAQs, and scheduled publications via spreadsheet",
    status: "active",
  },

  // --- 3. AI & Agency Intelligence ---
  {
    id: "agents",
    label: "Agency Agents Hub",
    href: "/dashboard/agents",
    iconName: "Bot",
    group: "ai",
    badge: "279 AI",
    minRole: "editor",
    description: "Consult 279 specialized autonomous agents for research, SEO, and fact checking",
    status: "active",
  },

  // --- 4. Platform & Governance ---
  {
    id: "seo",
    label: "SEO Suite",
    href: "/dashboard/seo",
    iconName: "Search",
    group: "system",
    minRole: "editor",
    description: "Global SERP simulator, canonical URL policies, and sitemap priorities",
    status: "active",
  },
  {
    id: "chain",
    label: "Governance & Chain",
    href: "/dashboard/chain",
    iconName: "ShieldCheck",
    group: "system",
    badge: "SHA-256",
    minRole: "superadmin",
    description: "3-tier approval gate, cryptographic audit ledger, and role permissions",
    status: "active",
  },
  {
    id: "cache",
    label: "Cache & Invalidation",
    href: "/dashboard/cache",
    iconName: "Zap",
    group: "system",
    minRole: "admin",
    description: "Sub-millisecond Next.js ISR cache invalidation and edge CDN sync",
    status: "active",
  },
  {
    id: "settings",
    label: "Settings & Subdomain",
    href: "/dashboard/settings",
    iconName: "Settings",
    group: "system",
    minRole: "superadmin",
    description: "Subdomain mapping, database connections, and headless API keys",
    status: "active",
  },
];

// Helper icon resolver
export const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Layers,
  FileText,
  FolderTree,
  MessageSquare,
  FileSpreadsheet,
  Bot,
  Building2,
  Package,
  Star,
  Search,
  ShieldCheck,
  Zap,
  Settings,
  HelpCircle,
  Database,
  BarChart3,
  Network,
};

export function getModulesByGroup(group: ModuleGroup): CMSModule[] {
  return CMS_MODULES.filter((m) => m.group === group);
}

export function getModuleById(id: string): CMSModule | undefined {
  return CMS_MODULES.find((m) => m.id === id);
}

export function hasModuleAccess(module: CMSModule, userRole: Role): boolean {
  const roleWeights: Record<Role, number> = {
    editor: 1,
    admin: 2,
    superadmin: 3,
  };
  return roleWeights[userRole] >= roleWeights[module.minRole];
}

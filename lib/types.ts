export type Role = "superadmin" | "admin" | "editor";

export type ContentStatus = "draft" | "in_review" | "approved" | "published" | "scheduled" | "archived";

export interface CMSUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  lastLogin?: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  keywords: string[];
  ogImage?: string;
  noIndex?: boolean;
  schemaType?: "Article" | "WebPage" | "GovernmentService" | "FAQPage" | "Product";
}

export interface SEOCheckResult {
  score: number; // 0 - 100
  titleLength: { score: number; text: string; status: "good" | "warn" | "bad" };
  descLength: { score: number; text: string; status: "good" | "warn" | "bad" };
  keywordInTitle: boolean;
  keywordInDesc: boolean;
  keywordDensity: number;
  suggestions: string[];
}

export interface CategoryNode {
  slug: string;
  name: string;
  intro?: string;
  children?: CategoryNode[];
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount?: number;
}

export interface AttributeDef {
  key: string;
  label: string;
  type: "currency" | "percent" | "number" | "text" | "rating" | "boolean";
  comparable?: boolean;
  filterable?: boolean;
  unit?: string;
}

export interface SectorConfig {
  slug: string;
  name: string;
  icon: string;
  description: string;
  watch?: string;
  nav?: {
    providers: string;
    categories: string;
  };
  labels?: {
    provider: string;
    providers: string;
    offering: string;
    offerings: string;
    variant: string;
    levels: string[];
  };
  maxCategoryDepth?: number;
  defaultTemplate?: string;
  location?: "none" | "optional" | "required";
  status?: ContentStatus;
  attributes?: AttributeDef[];
  categories?: CategoryNode[];
  seo?: SEOMetadata;
  lastEditedBy?: string;
  lastEditedAt?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  sector: string;
  readTime: string;
  summary: string;
  directAnswer?: string;
  body: string;
  status: ContentStatus;
  author: string;
  tags?: string[];
  categoryId?: string;
  featuredImage?: string;
  faqData?: FAQItem[];
  views?: number;
  commentsCount?: number;
  indexedAt?: string;
  relatedSlugs?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  seo: SEOMetadata;
  lastEditedBy?: string;
}

export interface Comment {
  id: string;
  articleSlug: string;
  articleTitle?: string;
  name: string;
  email?: string;
  comment: string;
  approved: boolean;
  parentId?: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: Role;
  action: "create" | "update" | "publish" | "delete" | "status_change" | "auth";
  entityType: "sector" | "blog" | "seo" | "user" | "system" | "provider" | "offering" | "category";
  entityId: string;
  details: string;
}

export interface WebhookConfig {
  frontendRevalidateUrl: string;
  secretToken: string;
  lastPingStatus?: "success" | "error" | "pending";
  lastPingAt?: string;
}

export interface ProviderProfile {
  description: string;
  registration?: string;
  trust?: Record<string, string>;
}

export interface Provider {
  slug: string;
  name: string;
  type: string;
  parentGroup?: string;
  website?: string;
  sectors: Record<string, ProviderProfile>;
}

export interface OfferingVariant {
  slug: string;
  name: string;
  attributes: Record<string, any>;
}

export interface Offering {
  slug: string;
  provider: string;
  sector: string;
  name: string;
  primaryCategory: string;
  extraCategories?: string[];
  status: "published" | "draft";
  lastVerified: string;
  summary?: string;
  attributes: Record<string, any>;
  variants?: OfferingVariant[];
}

export interface ResolvedCategory {
  sectorSlug: string;
  sectorName: string;
  slug: string;
  name: string;
  path: string[];
  level: number;
  offeringsCount: number;
}


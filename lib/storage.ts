import fs from "node:fs";
import path from "node:path";
import { SectorConfig, BlogPost, AuditEvent, Provider, Offering, ResolvedCategory } from "./types";

// Determine content directory: works whether running in /cms or project root
function findContentDir(): string {
  const candidates = [
    path.join(process.cwd(), "..", "content"),
    path.join(process.cwd(), "content"),
    path.join(__dirname, "../../../content"),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }
  // fallback to local content dir inside cms
  const localFallback = path.join(process.cwd(), "content");
  if (!fs.existsSync(localFallback)) {
    fs.mkdirSync(localFallback, { recursive: true });
  }
  return localFallback;
}

const CONTENT_DIR = findContentDir();
const SECTORS_DIR = path.join(CONTENT_DIR, "sectors");
const BLOGS_FILE = path.join(CONTENT_DIR, "blogs", "articles.json");
const AUDIT_FILE = path.join(CONTENT_DIR, "audit-log.json");
const PROVIDERS_FILE = path.join(CONTENT_DIR, "providers.json");
const OFFERINGS_DIR = path.join(CONTENT_DIR, "offerings");

/* ----------------------------- SECTORS ----------------------------- */

export function listSectors(): SectorConfig[] {
  if (!fs.existsSync(SECTORS_DIR)) return [];
  const files = fs.readdirSync(SECTORS_DIR).filter((f) => f.endsWith(".json"));
  const sectors: SectorConfig[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(SECTORS_DIR, file), "utf8");
      const parsed = JSON.parse(raw);
      sectors.push({
        ...parsed,
        status: parsed.status || "published",
      });
    } catch (e) {
      console.error(`Error loading sector file ${file}:`, e);
    }
  }

  return sectors.sort((a, b) => a.name.localeCompare(b.name));
}

export function getSectorBySlug(slug: string): SectorConfig | null {
  const filePath = path.join(SECTORS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSector(sector: SectorConfig, editorName = "Admin"): boolean {
  if (!fs.existsSync(SECTORS_DIR)) {
    fs.mkdirSync(SECTORS_DIR, { recursive: true });
  }
  const filePath = path.join(SECTORS_DIR, `${sector.slug}.json`);
  const payload: SectorConfig = {
    ...sector,
    lastEditedBy: editorName,
    lastEditedAt: new Date().toISOString(),
  };

  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
  recordAudit({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: "active_user",
    userName: editorName,
    role: "admin",
    action: "update",
    entityType: "sector",
    entityId: sector.slug,
    details: `Updated sector ${sector.name} (${sector.slug}) attributes & SEO`,
  });

  return true;
}

/* ----------------------------- BLOGS ----------------------------- */

export function listBlogs(): BlogPost[] {
  if (!fs.existsSync(BLOGS_FILE)) {
    // Return sample seed if file doesn't exist yet
    return [];
  }
  try {
    const raw = fs.readFileSync(BLOGS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const blogs = listBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

export function saveBlog(post: BlogPost, editorName = "Editor"): boolean {
  const blogs = listBlogs();
  const existingIndex = blogs.findIndex((b) => b.slug === post.slug);
  const now = new Date().toISOString();

  const blogToSave: BlogPost = {
    ...post,
    updatedAt: now,
    lastEditedBy: editorName,
    publishedAt: post.status === "published" ? (post.publishedAt || now) : post.publishedAt,
  };

  if (existingIndex >= 0) {
    blogs[existingIndex] = blogToSave;
  } else {
    blogs.unshift(blogToSave);
  }

  const blogsDir = path.dirname(BLOGS_FILE);
  if (!fs.existsSync(blogsDir)) {
    fs.mkdirSync(blogsDir, { recursive: true });
  }

  fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), "utf8");

  recordAudit({
    id: `aud_${Date.now()}`,
    timestamp: now,
    userId: "active_user",
    userName: editorName,
    role: "editor",
    action: existingIndex >= 0 ? "update" : "create",
    entityType: "blog",
    entityId: post.slug,
    details: `${existingIndex >= 0 ? "Updated" : "Created"} blog article "${post.title}" [Status: ${post.status}]`,
  });

  return true;
}

export function deleteBlog(slug: string, editorName = "Admin"): boolean {
  const blogs = listBlogs();
  const filtered = blogs.filter((b) => b.slug !== slug);
  if (filtered.length === blogs.length) return false;

  fs.writeFileSync(BLOGS_FILE, JSON.stringify(filtered, null, 2), "utf8");
  recordAudit({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: "active_user",
    userName: editorName,
    role: "admin",
    action: "delete",
    entityType: "blog",
    entityId: slug,
    details: `Deleted blog article ${slug}`,
  });
  return true;
}

/* ----------------------------- AUDIT LOG ----------------------------- */

export function listAuditLogs(): AuditEvent[] {
  if (!fs.existsSync(AUDIT_FILE)) {
    return [
      {
        id: "aud_seed_1",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        userId: "usr_sa_001",
        userName: "Vikram Malhotra",
        role: "superadmin",
        action: "auth",
        entityType: "system",
        entityId: "cms_core",
        details: "CMS Initialized on Subdomain Architecture",
      },
      {
        id: "aud_seed_2",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        userId: "usr_ad_002",
        userName: "Ananya Deshmukh",
        role: "admin",
        action: "publish",
        entityType: "blog",
        entityId: "irdai-3-year-incontestability-rule-explained",
        details: "Approved & Published legal circular breakdown",
      },
    ];
  }
  try {
    const raw = fs.readFileSync(AUDIT_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordAudit(event: AuditEvent): void {
  try {
    const logs = listAuditLogs();
    logs.unshift(event);
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs.slice(0, 200), null, 2), "utf8");
  } catch (e) {
    console.error("Failed to write audit event:", e);
  }
}

/* ----------------------------- PROVIDERS & BRANDS ----------------------------- */

export function listProviders(): Provider[] {
  if (!fs.existsSync(PROVIDERS_FILE)) return [];
  try {
    const raw = fs.readFileSync(PROVIDERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading providers.json:", e);
    return [];
  }
}

export function getProviderBySlug(slug: string): Provider | null {
  const all = listProviders();
  return all.find((p) => p.slug === slug) || null;
}

export function saveProvider(provider: Provider, editorName = "Admin"): boolean {
  const providers = listProviders();
  const existingIndex = providers.findIndex((p) => p.slug === provider.slug);
  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    providers[existingIndex] = provider;
  } else {
    providers.unshift(provider);
  }

  const pDir = path.dirname(PROVIDERS_FILE);
  if (!fs.existsSync(pDir)) {
    fs.mkdirSync(pDir, { recursive: true });
  }

  fs.writeFileSync(PROVIDERS_FILE, JSON.stringify(providers, null, 2), "utf8");

  recordAudit({
    id: `aud_${Date.now()}`,
    timestamp: now,
    userId: "active_user",
    userName: editorName,
    role: "admin",
    action: existingIndex >= 0 ? "update" : "create",
    entityType: "provider",
    entityId: provider.slug,
    details: `${existingIndex >= 0 ? "Updated" : "Created"} provider brand "${provider.name}" (${provider.slug})`,
  });

  return true;
}

export function deleteProvider(slug: string, editorName = "Admin"): boolean {
  const providers = listProviders();
  const filtered = providers.filter((p) => p.slug !== slug);
  if (filtered.length === providers.length) return false;

  fs.writeFileSync(PROVIDERS_FILE, JSON.stringify(filtered, null, 2), "utf8");
  recordAudit({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: "active_user",
    userName: editorName,
    role: "admin",
    action: "delete",
    entityType: "provider",
    entityId: slug,
    details: `Deleted provider brand ${slug}`,
  });
  return true;
}

/* ----------------------------- PRODUCTS & PLANS (OFFERINGS) ----------------------------- */

export function listOfferings(sector?: string): Offering[] {
  if (!fs.existsSync(OFFERINGS_DIR)) return [];
  const files = sector ? [`${sector}.json`] : fs.readdirSync(OFFERINGS_DIR).filter((f) => f.endsWith(".json"));
  const all: Offering[] = [];

  for (const f of files) {
    const sName = f.replace(/\.json$/, "");
    const full = path.join(OFFERINGS_DIR, f);
    if (!fs.existsSync(full)) continue;
    try {
      const raw = fs.readFileSync(full, "utf8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const item of list) {
          all.push({ ...item, sector: sName });
        }
      }
    } catch (e) {
      console.error(`Error reading offerings/${f}:`, e);
    }
  }

  return all;
}

export function saveOffering(offering: Offering, editorName = "Admin"): boolean {
  if (!offering.sector) return false;
  if (!fs.existsSync(OFFERINGS_DIR)) {
    fs.mkdirSync(OFFERINGS_DIR, { recursive: true });
  }

  const sectorFile = path.join(OFFERINGS_DIR, `${offering.sector}.json`);
  let list: Offering[] = [];
  if (fs.existsSync(sectorFile)) {
    try {
      const raw = fs.readFileSync(sectorFile, "utf8");
      list = JSON.parse(raw);
    } catch {
      list = [];
    }
  }

  const existingIndex = list.findIndex((o) => o.slug === offering.slug);
  const now = new Date().toISOString();
  const cleanOffering = {
    ...offering,
    lastVerified: offering.lastVerified || now.split("T")[0],
  };

  if (existingIndex >= 0) {
    list[existingIndex] = cleanOffering;
  } else {
    list.unshift(cleanOffering);
  }

  fs.writeFileSync(sectorFile, JSON.stringify(list, null, 2), "utf8");

  recordAudit({
    id: `aud_${Date.now()}`,
    timestamp: now,
    userId: "active_user",
    userName: editorName,
    role: "admin",
    action: existingIndex >= 0 ? "update" : "create",
    entityType: "offering",
    entityId: offering.slug,
    details: `${existingIndex >= 0 ? "Updated" : "Created"} plan/offering "${offering.name}" (${offering.slug}) under ${offering.sector}`,
  });

  return true;
}

export function deleteOffering(sector: string, slug: string, editorName = "Admin"): boolean {
  const sectorFile = path.join(OFFERINGS_DIR, `${sector}.json`);
  if (!fs.existsSync(sectorFile)) return false;

  try {
    const raw = fs.readFileSync(sectorFile, "utf8");
    const list: Offering[] = JSON.parse(raw);
    const filtered = list.filter((o) => o.slug !== slug);
    if (filtered.length === list.length) return false;

    fs.writeFileSync(sectorFile, JSON.stringify(filtered, null, 2), "utf8");
    recordAudit({
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: "active_user",
      userName: editorName,
      role: "admin",
      action: "delete",
      entityType: "offering",
      entityId: slug,
      details: `Deleted plan/offering ${slug} from ${sector}`,
    });
    return true;
  } catch {
    return false;
  }
}

/* ----------------------------- SECTOR CATEGORIES (RELATIONAL TAXONOMY) ----------------------------- */

export function listSectorCategories(): ResolvedCategory[] {
  const sectors = listSectors();
  const offerings = listOfferings();
  const out: ResolvedCategory[] = [];

  const walk = (nodes: any[], parentPath: string[], level: number, sSlug: string, sName: string) => {
    for (const n of nodes) {
      const curPath = [...parentPath, n.slug];
      const pStr = curPath.join("/");

      // Count offerings under this category path
      const count = offerings.filter(
        (o) => o.sector === sSlug && (o.primaryCategory === pStr || o.primaryCategory.startsWith(pStr + "/"))
      ).length;

      out.push({
        sectorSlug: sSlug,
        sectorName: sName,
        slug: n.slug,
        name: n.name,
        path: curPath,
        level,
        offeringsCount: count,
      });

      if (n.children && Array.isArray(n.children)) {
        walk(n.children, curPath, level + 1, sSlug, sName);
      }
    }
  };

  for (const s of sectors) {
    if (s.categories && Array.isArray(s.categories)) {
      walk(s.categories, [], 1, s.slug, s.name);
    }
  }

  return out;
}

export function addCategoryToSector(
  sectorSlug: string,
  category: { slug: string; name: string; parentCategorySlug?: string; intro?: string },
  editorName = "Admin"
): boolean {
  const sector = getSectorBySlug(sectorSlug);
  if (!sector) return false;

  if (!sector.categories) {
    sector.categories = [];
  }

  const newNode = {
    slug: category.slug,
    name: category.name,
    ...(category.intro ? { intro: category.intro } : {}),
    children: [],
  };

  if (!category.parentCategorySlug) {
    // Top-level category in sector
    const existing = sector.categories.findIndex((c) => c.slug === category.slug);
    if (existing >= 0) {
      sector.categories[existing] = { ...sector.categories[existing], ...newNode };
    } else {
      sector.categories.push(newNode);
    }
  } else {
    // Nested child category under parentCategorySlug
    let added = false;
    const insertIntoParent = (nodes: any[]): boolean => {
      for (const node of nodes) {
        if (node.slug === category.parentCategorySlug) {
          if (!node.children) node.children = [];
          const exChild = node.children.findIndex((c: any) => c.slug === category.slug);
          if (exChild >= 0) {
            node.children[exChild] = { ...node.children[exChild], ...newNode };
          } else {
            node.children.push(newNode);
          }
          return true;
        }
        if (node.children && Array.isArray(node.children)) {
          if (insertIntoParent(node.children)) return true;
        }
      }
      return false;
    };

    added = insertIntoParent(sector.categories);
    if (!added) {
      // Fallback: append to root if parent wasn't found
      sector.categories.push(newNode);
    }
  }

  saveSector(sector, editorName);

  recordAudit({
    id: `aud_${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: "active_user",
    userName: editorName,
    role: "admin",
    action: "create",
    entityType: "category",
    entityId: `${sectorSlug}/${category.slug}`,
    details: `Added category "${category.name}" to sector ${sector.name}`,
  });

  return true;
}


import { CMSUser, Role } from "./types";

export const DEMO_USERS: Record<Role, CMSUser> = {
  superadmin: {
    id: "usr_sa_001",
    name: "Vikram Malhotra",
    email: "superadmin@trustvalue.ai",
    role: "superadmin",
    avatar: "👑",
    lastLogin: "Just now",
  },
  admin: {
    id: "usr_ad_002",
    name: "Ananya Deshmukh",
    email: "admin@trustvalue.ai",
    role: "admin",
    avatar: "🛡️",
    lastLogin: "2 hours ago",
  },
  editor: {
    id: "usr_ed_003",
    name: "Rohan Varma",
    email: "editor@trustvalue.ai",
    role: "editor",
    avatar: "✍️",
    lastLogin: "Yesterday",
  },
};

export const PERMISSIONS = {
  superadmin: {
    canPublish: true,
    canEditSectors: true,
    canEditBlogs: true,
    canManageRoles: true,
    canEditSystemSettings: true,
    canOverrideSeo: true,
    canViewAuditTrail: true,
    canBypassApproval: true,
  },
  admin: {
    canPublish: true,
    canEditSectors: true,
    canEditBlogs: true,
    canManageRoles: false,
    canEditSystemSettings: false,
    canOverrideSeo: true,
    canViewAuditTrail: true,
    canBypassApproval: false,
  },
  editor: {
    canPublish: false,
    canEditSectors: false, // can only propose/draft
    canEditBlogs: true,
    canManageRoles: false,
    canEditSystemSettings: false,
    canOverrideSeo: false,
    canViewAuditTrail: false,
    canBypassApproval: false,
  },
};

export function hasPermission(role: Role, permission: keyof typeof PERMISSIONS["superadmin"]): boolean {
  return !!PERMISSIONS[role]?.[permission];
}

/** In client/browser, default session fallback */
export function getCurrentUser(): CMSUser {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("tv_cms_active_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
  }
  return DEMO_USERS.superadmin;
}

export function setCurrentUser(user: CMSUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("tv_cms_active_user", JSON.stringify(user));
  }
}

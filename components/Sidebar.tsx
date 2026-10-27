"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ExternalLink, ChevronRight, Sparkles, LayoutDashboard } from "lucide-react";
import { getCurrentUser, setCurrentUser, DEMO_USERS } from "../lib/auth";
import { CMSUser, Role } from "../lib/types";
import { CMS_MODULES, MODULE_GROUPS, ICON_MAP, hasModuleAccess, ModuleGroup } from "../config/modules";

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<CMSUser>(DEMO_USERS.superadmin);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleRoleChange = (role: Role) => {
    const newUser = DEMO_USERS[role];
    setUser(newUser);
    setCurrentUser(newUser);
    window.location.reload();
  };

  // Group modules based on MODULE_GROUPS
  const sortedGroups = (Object.keys(MODULE_GROUPS) as ModuleGroup[]).sort(
    (a, b) => MODULE_GROUPS[a].order - MODULE_GROUPS[b].order
  );

  return (
    <aside style={{
      width: "280px",
      height: "100vh",
      position: "sticky",
      top: 0,
      backgroundColor: "var(--bg-surface)",
      borderRight: "1px solid var(--border-subtle)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      flexShrink: 0,
      userSelect: "none",
      zIndex: 50,
      overflowY: "auto",
    }}>
      {/* Brand Header */}
      <div style={{ padding: "0 12px 20px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#fff",
            fontSize: "18px",
            boxShadow: "0 4px 12px rgba(37,99,235,0.4)"
          }}>
            T
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
              TrustValue CMS
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
              Subdomain Control Core
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Module Navigation */}
      <nav style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
        {/* Premier Top Item: Overview */}
        <div style={{ marginBottom: "16px" }}>
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: pathname === "/dashboard" ? 700 : 500,
              color: pathname === "/dashboard" ? "#ffffff" : "var(--text-secondary)",
              backgroundColor: pathname === "/dashboard" ? "var(--accent-blue)" : "transparent",
              boxShadow: pathname === "/dashboard" ? "0 2px 8px rgba(37,99,235,0.4)" : "none",
              transition: "all 0.15s ease",
              textDecoration: "none",
            }}
            className={pathname !== "/dashboard" ? "hover:bg-slate-800/50 hover:text-slate-100" : ""}
          >
            <LayoutDashboard size={17} opacity={pathname === "/dashboard" ? 1 : 0.8} />
            <span style={{ flex: 1 }}>Overview</span>
          </Link>
        </div>

        {sortedGroups.map((grpKey) => {
          const groupMeta = MODULE_GROUPS[grpKey];
          const modulesInGroup = CMS_MODULES.filter(
            (m) => m.group === grpKey && hasModuleAccess(m, user.role)
          );

          if (modulesInGroup.length === 0) return null;

          return (
            <div key={grpKey} style={{ marginBottom: "16px" }}>
              <div style={{
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                color: "var(--text-muted)",
                padding: "4px 12px 6px 12px",
                fontWeight: 700,
              }}>
                {groupMeta.label}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {modulesInGroup.map((item) => {
                  const Icon = ICON_MAP[item.iconName] || ChevronRight;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href) &&
                      !CMS_MODULES.some(
                        (other) =>
                          other.href !== item.href &&
                          other.href.startsWith(item.href) &&
                          pathname.startsWith(other.href)
                      ));

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      title={item.description}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "13.5px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#ffffff" : "var(--text-secondary)",
                        backgroundColor: isActive ? "var(--accent-blue)" : "transparent",
                        transition: "all 0.15s ease",
                        textDecoration: "none",
                      }}
                      className={!isActive ? "hover:bg-slate-800/50 hover:text-slate-100" : ""}
                    >
                      <Icon size={17} opacity={isActive ? 1 : 0.75} />
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span style={{
                          fontSize: "10.5px",
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: "99px",
                          backgroundColor: isActive
                            ? "rgba(255,255,255,0.25)"
                            : item.badge.includes("AI")
                            ? "rgba(139, 92, 246, 0.2)"
                            : item.badge === "Audited"
                            ? "rgba(16, 185, 129, 0.2)"
                            : "var(--bg-hover)",
                          color: isActive
                            ? "#fff"
                            : item.badge.includes("AI")
                            ? "#c084fc"
                            : item.badge === "Audited"
                            ? "#34d399"
                            : "var(--text-muted)",
                          border: !isActive && item.badge.includes("AI")
                            ? "1px solid rgba(139, 92, 246, 0.3)"
                            : "none",
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Public Storefront Link */}
        <div style={{ marginTop: "8px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            color: "var(--text-muted)",
            padding: "0 12px 6px 12px",
            fontWeight: 700,
          }}>
            Frontend Production
          </div>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
            className="hover:bg-slate-800/50 hover:text-slate-100"
          >
            <ExternalLink size={16} opacity={0.7} />
            <span style={{ flex: 1 }}>Live Storefront (3000)</span>
          </a>
        </div>
      </nav>

      {/* Role Switcher & Persona Card */}
      <div style={{
        marginTop: "auto",
        backgroundColor: "var(--bg-main)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "10px",
        padding: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{ fontSize: "20px" }}>{user.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name}
            </div>
            <div style={{
              fontSize: "11px",
              color: user.role === "superadmin" ? "var(--accent-purple)" : user.role === "admin" ? "var(--accent-blue)" : "var(--text-secondary)",
              fontWeight: 600,
              textTransform: "uppercase"
            }}>
              {user.role}
            </div>
          </div>
        </div>

        {/* Quick Role Tester Switcher */}
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => handleRoleChange("superadmin")}
            title="Switch to Superadmin"
            style={{
              flex: 1,
              padding: "5px",
              borderRadius: "6px",
              fontSize: "10.5px",
              border: user.role === "superadmin" ? "1px solid var(--accent-purple)" : "1px solid var(--border-subtle)",
              backgroundColor: user.role === "superadmin" ? "rgba(139,92,246,0.2)" : "transparent",
              color: user.role === "superadmin" ? "#c084fc" : "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            👑 Super
          </button>
          <button
            onClick={() => handleRoleChange("admin")}
            title="Switch to Admin"
            style={{
              flex: 1,
              padding: "5px",
              borderRadius: "6px",
              fontSize: "10.5px",
              border: user.role === "admin" ? "1px solid var(--accent-blue)" : "1px solid var(--border-subtle)",
              backgroundColor: user.role === "admin" ? "rgba(59,130,246,0.2)" : "transparent",
              color: user.role === "admin" ? "#60a5fa" : "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            🛡️ Admin
          </button>
          <button
            onClick={() => handleRoleChange("editor")}
            title="Switch to Editor"
            style={{
              flex: 1,
              padding: "5px",
              borderRadius: "6px",
              fontSize: "10.5px",
              border: user.role === "editor" ? "1px solid var(--accent-emerald)" : "1px solid var(--border-subtle)",
              backgroundColor: user.role === "editor" ? "rgba(16,185,129,0.2)" : "transparent",
              color: user.role === "editor" ? "#34d399" : "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            ✍️ Edit
          </button>
        </div>
      </div>
    </aside>
  );
}

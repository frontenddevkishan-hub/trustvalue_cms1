"use client";

import { Search, Bell, Sparkles, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "Editorial Dashboard", subtitle = "TrustValue Headless Engine" }: HeaderProps) {
  return (
    <header style={{
      height: "70px",
      position: "sticky",
      top: 0,
      zIndex: 40,
      backdropFilter: "blur(12px)",
      backgroundColor: "rgba(15, 23, 42, 0.88)",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 36px",
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
          {title}
        </h1>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Status Pill */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "99px",
          backgroundColor: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.25)",
          color: "#34d399",
          fontSize: "12px",
          fontWeight: 500,
        }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
          Frontend Sync: Connected (Port 3000)
        </div>

        {/* Subdomain Pill */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "99px",
          backgroundColor: "var(--bg-main)",
          border: "1px solid var(--border-strong)",
          color: "var(--text-secondary)",
          fontSize: "12px",
        }}>
          <Sparkles size={14} color="var(--accent-blue)" />
          Subdomain: cms.trustvalue.ai
        </div>
      </div>
    </header>
  );
}

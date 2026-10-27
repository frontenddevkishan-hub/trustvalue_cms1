"use client";

import Link from "next/link";
import { Plus, Search, ExternalLink, Sparkles, Filter, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  entityType: string;
  items: Array<{
    id: string;
    title: string;
    sector: string;
    status: string;
    metrics: string;
    updatedAt: string;
  }>;
}

export function EntityScaffoldClient({ title, subtitle, entityType, items }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>{title}</h2>
            <span style={{
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "99px",
              background: "rgba(59, 130, 246, 0.15)",
              color: "var(--accent-blue)",
              fontWeight: 600,
            }}>
              Modular Tab Engine
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>{subtitle}</p>
        </div>

        <button className="btn btn-primary" onClick={() => alert(`Create new ${entityType} form initialized`)}>
          <Plus size={16} /> New {entityType}
        </button>
      </div>

      {/* Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        background: "var(--bg-surface)",
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid var(--border-subtle)"
      }}>
        <div style={{ position: "relative", flex: 1, maxWidth: "380px" }}>
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input
            type="text"
            placeholder={`Search ${entityType.toLowerCase()}s by name, sector, or metric...`}
            style={{
              width: "100%",
              padding: "7px 12px 7px 34px",
              borderRadius: "6px",
              background: "var(--bg-main)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              fontSize: "13px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", alignSelf: "center" }}>
            Showing {items.length} records
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-main)" }}>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Name / Entity</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Sector</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Trust / SLA Metric</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Last Audited</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "14px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {it.title}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: "rgba(59, 130, 246, 0.1)",
                    color: "var(--accent-blue)",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "capitalize"
                  }}>
                    {it.sector}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                  {it.metrics}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "99px",
                    background: it.status === "audited" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                    color: it.status === "audited" ? "var(--accent-emerald)" : "var(--accent-amber)",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "capitalize"
                  }}>
                    {it.status === "audited" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {it.status}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "12px" }}>
                  {it.updatedAt}
                </td>
                <td style={{ padding: "14px 16px", textAlign: "right" }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: "11px", padding: "4px 8px" }}
                    onClick={() => alert(`Editing ${it.title}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

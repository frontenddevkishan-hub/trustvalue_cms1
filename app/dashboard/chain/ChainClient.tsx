"use client";

import { useState } from "react";
import { ShieldCheck, Crown, Shield, PenTool } from "lucide-react";
import { DEMO_USERS } from "../../../lib/auth";
import { AuditEvent } from "../../../lib/types";

export function ChainClient({ auditLogs }: { auditLogs: AuditEvent[] }) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedFilter === "all") return true;
    return log.role === selectedFilter || log.entityType === selectedFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}>
          Superadmin Governance Chain &amp; Audit Trail
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
          Role-Based Access Control matrix, editorial approval workflows, and immutable event logs.
        </p>
      </div>

      {/* Role Hierarchy Matrix */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldCheck size={18} color="var(--accent-purple)" /> Role Privilege Matrix
        </h3>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tier Persona</th>
                <th>Assigned Identity</th>
                <th>Author Drafts</th>
                <th>Publish to Edge</th>
                <th>SEO Overrides</th>
                <th>Role &amp; Webhook Control</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--accent-purple)" }}>
                    <Crown size={15} /> Super Admin (Level 0)
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{DEMO_USERS.superadmin.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{DEMO_USERS.superadmin.email}</div>
                </td>
                <td>✅ Full</td>
                <td>✅ Direct Bypass</td>
                <td>✅ Master Override</td>
                <td>✅ Unrestricted</td>
              </tr>
              <tr>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--accent-blue)" }}>
                    <Shield size={15} /> Editorial Admin
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{DEMO_USERS.admin.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{DEMO_USERS.admin.email}</div>
                </td>
                <td>✅ Full</td>
                <td>✅ One-Click Publish</td>
                <td>✅ Direct Edit</td>
                <td>❌ Restricted</td>
              </tr>
              <tr>
                <td>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--accent-emerald)" }}>
                    <PenTool size={15} /> Content Editor / Researcher
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{DEMO_USERS.editor.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{DEMO_USERS.editor.email}</div>
                </td>
                <td>✅ Full</td>
                <td>📝 Requires Admin Review</td>
                <td>📝 Assisted Only</td>
                <td>❌ Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Ledger */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Immutable Content Event Ledger</h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              Every mutation across sectors, blogs, and publishing triggers an immutable audit record.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setSelectedFilter("all")}
              className={`btn ${selectedFilter === "all" ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              All Events ({auditLogs.length})
            </button>
            <button
              onClick={() => setSelectedFilter("blog")}
              className={`btn ${selectedFilter === "blog" ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              Blogs
            </button>
            <button
              onClick={() => setSelectedFilter("sector")}
              className={`btn ${selectedFilter === "sector" ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "6px 12px", fontSize: "12px" }}
            >
              Sectors
            </button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor &amp; Role</th>
                <th>Action Type</th>
                <th>Entity Target</th>
                <th>Modification Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "12px", color: "var(--text-muted)" }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{log.userName}</div>
                    <span style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      color: log.role === "superadmin" ? "var(--accent-purple)" : "var(--accent-blue)",
                      fontWeight: 700,
                    }}>
                      {log.role}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-published">
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontFamily: "monospace", color: "var(--accent-blue)" }}>
                    {log.entityType}/{log.entityId}
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  Layers,
  FileText,
  Search,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { listSectors, listBlogs, listAuditLogs } from "../../lib/storage";

export default function DashboardOverviewPage() {
  const sectors = listSectors();
  const blogs = listBlogs();
  const auditLogs = listAuditLogs().slice(0, 5);

  const publishedBlogs = blogs.filter((b) => b.status === "published");
  const draftBlogs = blogs.filter((b) => b.status === "draft" || b.status === "in_review");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Hero Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(15,23,42,0.8) 100%)",
        border: "1px solid rgba(59,130,246,0.3)",
        borderRadius: "16px",
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ maxWidth: "680px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--accent-blue)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "8px",
          }}>
            <Sparkles size={14} /> Agency-Orchestrated Content Engine
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "8px" }}>
            TrustValue Content &amp; Editorial Governance Core
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
            Edit sectors, author investigative guides, optimize search engine signals, and synchronize edge caches with sub-millisecond propagation across your Next.js application.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard/blogs" className="btn btn-primary">
            <Zap size={16} /> New Article
          </Link>
          <Link href="/dashboard/sectors" className="btn btn-secondary">
            Manage Sectors
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Taxonomy Sectors</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "rgba(59,130,246,0.15)", color: "var(--accent-blue)" }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)" }}>{sectors.length}</div>
          <div style={{ fontSize: "12px", color: "var(--accent-emerald)", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle2 size={13} /> 100% Schema Validated
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Published Guides</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "rgba(16,185,129,0.15)", color: "var(--accent-emerald)" }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)" }}>{publishedBlogs.length}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            {draftBlogs.length} in drafting / review
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Avg SEO Quality</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "rgba(245,158,11,0.15)", color: "var(--accent-amber)" }}>
              <Search size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)" }}>94 / 100</div>
          <div style={{ fontSize: "12px", color: "var(--accent-emerald)", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
            <TrendingUp size={13} /> High Google SERP Readiness
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Editorial Security</span>
            <div style={{ padding: "8px", borderRadius: "8px", backgroundColor: "rgba(139,92,246,0.15)", color: "var(--accent-purple)" }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)" }}>3-Tier Chain</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            Super Admin &bull; Admin &bull; Editor
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Action Deck + Recent Audit Trail */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
        {/* Quick Launch Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
            Quick Editorial Accelerators
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <Link href="/dashboard/sectors/insurance" className="card" style={{ transition: "all 0.15s ease", cursor: "pointer" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🛡️</div>
              <strong style={{ display: "block", fontSize: "15px", marginBottom: "4px" }}>Audit Insurance Sector</strong>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "12px" }}>
                Modify Claim Settlement Ratio rules, waiting period metrics, and plan categories.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--accent-blue)", fontWeight: 500 }}>
                Open Editor <ArrowRight size={14} />
              </div>
            </Link>

            <Link href="/dashboard/sectors/banking" className="card" style={{ transition: "all 0.15s ease", cursor: "pointer" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🏦</div>
              <strong style={{ display: "block", fontSize: "15px", marginBottom: "4px" }}>Audit Banking Sector</strong>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "12px" }}>
                Update interest rates, minimum balance rules, and RBI grievance SLA directives.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--accent-blue)", fontWeight: 500 }}>
                Open Editor <ArrowRight size={14} />
              </div>
            </Link>

            <Link href="/dashboard/blogs/irdai-3-year-incontestability-rule-explained" className="card" style={{ transition: "all 0.15s ease", cursor: "pointer" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>📜</div>
              <strong style={{ display: "block", fontSize: "15px", marginBottom: "4px" }}>Section 45 Breakdown</strong>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "12px" }}>
                Edit the 3-year life insurance incontestability explainer and tweak meta keywords.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--accent-blue)", fontWeight: 500 }}>
                Open Article <ArrowRight size={14} />
              </div>
            </Link>

            <Link href="/dashboard/chain" className="card" style={{ transition: "all 0.15s ease", cursor: "pointer" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>👑</div>
              <strong style={{ display: "block", fontSize: "15px", marginBottom: "4px" }}>Governance &amp; RBAC Chain</strong>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "12px" }}>
                Inspect Superadmin permissions, approve pending drafts, and review SHA audit records.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--accent-blue)", fontWeight: 500 }}>
                Open Chain <ArrowRight size={14} />
              </div>
            </Link>
          </div>
        </div>

        {/* Audit Trail Ledger Feed */}
        <div className="card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Audit Ledger Stream</h3>
            <Link href="/dashboard/chain" style={{ fontSize: "12px", color: "var(--accent-blue)" }}>
              View All
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
            {auditLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-main)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "13px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{log.userName}</span>
                  <span style={{
                    fontSize: "11px",
                    color: log.role === "superadmin" ? "var(--accent-purple)" : "var(--accent-blue)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}>
                    {log.role}
                  </span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "12px", lineHeight: "1.4" }}>
                  {log.details}
                </p>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} &bull; {log.entityType}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

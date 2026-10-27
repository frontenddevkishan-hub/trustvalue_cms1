"use client";

import { useState } from "react";
import { Search, Globe, Bot, Shield, CheckCircle2, RefreshCw, Sparkles, AlertCircle } from "lucide-react";

export default function GlobalSeoPage() {
  const [siteTitleTemplate, setSiteTitleTemplate] = useState("%s | TrustValue Legal & Regulatory Audit");
  const [canonicalBase, setCanonicalBase] = useState("https://trustvalue.ai");
  const [allowAiBots, setAllowAiBots] = useState(true);
  const [sitemapStatus, setSitemapStatus] = useState("Synchronized (18 Sectors + 3 Blogs + 24 Hubs)");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleReindex = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSitemapStatus("Fresh sitemap.xml generated & pinged to Googlebot & Bingbot.");
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}>
          Global SEO &amp; Search Engine Command Center
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
          Configure canonical indexation policies, automated XML sitemaps, and AI crawler access rules.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
        {/* Left Column: Sitewide Directives */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <Globe size={18} color="var(--accent-blue)" /> Canonical Domain &amp; Title Formatting
            </h3>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Canonical Production Domain
              </label>
              <input
                type="text"
                value={canonicalBase}
                onChange={(e) => setCanonicalBase(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Sitewide Title Template (%s will be replaced by page headline)
              </label>
              <input
                type="text"
                value={siteTitleTemplate}
                onChange={(e) => setSiteTitleTemplate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* AI Bot Policy & Robots.txt */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <Bot size={18} color="var(--accent-purple)" /> Autonomous LLM &amp; Crawler Indexation Policy
            </h3>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", backgroundColor: "var(--bg-main)", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div>
                <strong style={{ display: "block", fontSize: "14px" }}>Allow AI Crawlers (Search Grounding)</strong>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Permits GPTBot, ClaudeBot, and Perplexity to index audited claim ratios and consumer scores.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowAiBots}
                onChange={(e) => setAllowAiBots(e.target.checked)}
                style={{ width: "20px", height: "20px", accentColor: "var(--accent-blue)", cursor: "pointer" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Current robots.txt Preview
              </label>
              <pre style={{
                backgroundColor: "var(--bg-main)",
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                fontSize: "12px",
                fontFamily: "monospace",
                color: "var(--text-secondary)",
              }}>
{`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

User-agent: GPTBot
${allowAiBots ? "Allow: /" : "Disallow: /"}

User-agent: ClaudeBot
${allowAiBots ? "Allow: /" : "Disallow: /"}

Sitemap: ${canonicalBase}/sitemap.xml`}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic XML Sitemap & Health */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>XML Sitemap Pipeline</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              Sitemaps are dynamically generated using Next.js App Router metadata conventions (`app/sitemap.js`).
            </p>

            <div style={{ backgroundColor: "var(--bg-main)", padding: "14px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>Status:</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-emerald)" }}>
                {sitemapStatus}
              </div>
            </div>

            <button
              onClick={handleReindex}
              disabled={isRefreshing}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              <RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Regenerating..." : "Ping Search Engine Sitemaps"}
            </button>
          </div>

          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600 }}>Indexation Quality Checklist</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-emerald)" }}>
                <CheckCircle2 size={16} /> Canonical URLs self-referencing
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-emerald)" }}>
                <CheckCircle2 size={16} /> Schema.org TechArticle JSON-LD active
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-emerald)" }}>
                <CheckCircle2 size={16} /> OpenGraph 1200x630 banners generated
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-emerald)" }}>
                <CheckCircle2 size={16} /> Sub-0.8s LCP Edge Cache enabled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

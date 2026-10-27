"use client";

import { useState } from "react";
import { Settings, Globe, Database, Key, Send, CheckCircle2, RefreshCw, Sparkles, ExternalLink } from "lucide-react";

export default function SystemSettingsPage() {
  const [frontendUrl, setFrontendUrl] = useState("http://localhost:3000");
  const [secretToken, setSecretToken] = useState("tv_reval_secret_token_secure_9876");
  const [storageDriver, setStorageDriver] = useState<"file" | "postgres">("file");
  const [dbUri, setDbUri] = useState("postgresql://postgres:password@localhost:5432/trustvalue");
  const [testResult, setTestResult] = useState<{ status: "idle" | "testing" | "success" | "error"; msg?: string }>({ status: "idle" });

  const handleTestPing = async () => {
    setTestResult({ status: "testing" });
    try {
      const res = await fetch("/api/v1/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: "system",
          slug: "healthcheck",
          action: "update",
        }),
      });
      const data = await res.json();
      setTestResult({
        status: "success",
        msg: `Ping dispatched! Edge hook response: ${data.message}`,
      });
    } catch (e: any) {
      setTestResult({
        status: "error",
        msg: `Ping failed: ${e.message}`,
      });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}>
          Subdomain Architecture &amp; System Configuration
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
          Configure edge synchronization webhooks, subdomain DNS bindings, and database drivers.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
        {/* Left Column: Subdomain & Webhook */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Subdomain DNS Blueprint */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <Globe size={18} color="var(--accent-blue)" /> Subdomain Hostname &amp; DNS Target
            </h3>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Target Subdomain Hostname
              </label>
              <input
                type="text"
                readOnly
                value="cms.trustvalue.ai"
                className="input-field"
                style={{ backgroundColor: "var(--bg-main)", color: "var(--accent-blue)", fontWeight: 600 }}
              />
            </div>

            <div style={{
              backgroundColor: "var(--bg-main)",
              borderRadius: "8px",
              padding: "14px",
              border: "1px solid var(--border-subtle)",
              fontSize: "12px",
              lineHeight: "1.6",
              color: "var(--text-secondary)",
            }}>
              <strong>DNS Configuration:</strong>
              <div style={{ fontFamily: "monospace", marginTop: "4px", color: "var(--text-primary)" }}>
                CNAME &nbsp; cms &nbsp; ➔ &nbsp; cname.vercel-dns.com (or your server IP)
              </div>
              <div style={{ marginTop: "6px", color: "var(--text-muted)" }}>
                When ready, simply deploy this `/cms` folder independently. No other project files are required.
              </div>
            </div>
          </div>

          {/* Frontend Sync Webhook */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <RefreshCw size={18} color="var(--accent-emerald)" /> Edge Cache Invalidation Dispatcher
            </h3>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Main Production Site URL
              </label>
              <input
                type="text"
                value={frontendUrl}
                onChange={(e) => setFrontendUrl(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Shared Webhook Secret Token
              </label>
              <input
                type="password"
                value={secretToken}
                onChange={(e) => setSecretToken(e.target.value)}
                className="input-field"
              />
            </div>

            <button
              onClick={handleTestPing}
              disabled={testResult.status === "testing"}
              className="btn btn-primary"
            >
              <Send size={15} />
              {testResult.status === "testing" ? "Testing Connection..." : "Test Frontend Revalidation Ping"}
            </button>

            {testResult.status === "success" && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: "rgba(16,185,129,0.15)", color: "var(--accent-emerald)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} />
                <span>{testResult.msg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pluggable Database & Storage Driver */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <Database size={18} color="var(--accent-amber)" /> Storage Engine Driver
            </h3>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              TrustValue CMS provides a dual-storage adapter. In local dev, it edits `/content` directly. In cloud production, switch to PostgreSQL.
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setStorageDriver("file")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: storageDriver === "file" ? "1px solid var(--accent-emerald)" : "1px solid var(--border-subtle)",
                  backgroundColor: storageDriver === "file" ? "rgba(16,185,129,0.15)" : "var(--bg-main)",
                  color: storageDriver === "file" ? "#34d399" : "var(--text-muted)",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                📁 Local File Adapter (content/)
              </button>
              <button
                onClick={() => setStorageDriver("postgres")}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: storageDriver === "postgres" ? "1px solid var(--accent-blue)" : "1px solid var(--border-subtle)",
                  backgroundColor: storageDriver === "postgres" ? "rgba(59,130,246,0.15)" : "var(--bg-main)",
                  color: storageDriver === "postgres" ? "#60a5fa" : "var(--text-muted)",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                🐘 PostgreSQL Database
              </button>
            </div>

            {storageDriver === "postgres" && (
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  PostgreSQL Connection String
                </label>
                <input
                  type="text"
                  value={dbUri}
                  onChange={(e) => setDbUri(e.target.value)}
                  className="input-field"
                  style={{ fontFamily: "monospace", fontSize: "12px" }}
                />
              </div>
            )}
          </div>

          {/* Headless API Tokens */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <Key size={18} color="var(--accent-purple)" /> Headless API Credentials
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Use this Bearer token to query `/api/v1/sectors` and `/api/v1/blogs` programmatically from external services.
            </p>
            <div style={{
              padding: "10px 12px",
              backgroundColor: "var(--bg-main)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "12px",
              color: "var(--text-secondary)",
              wordBreak: "break-all",
            }}>
              tv_live_headless_token_8829f0bc71e4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

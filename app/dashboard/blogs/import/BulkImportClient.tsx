"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, Download, Calendar, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export function BulkImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null);

  const handleImport = () => {
    if (!file) return;
    setImporting(true);
    // Simulated import
    setTimeout(() => {
      setResult({ success: 15, errors: ["Row 8: Missing 'slug' field", "Row 12: Invalid date format in 'published_at'"] });
      setImporting(false);
    }, 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px", marginBottom: "4px" }}>
          Bulk Import & Scheduler
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          Upload Excel/CSV spreadsheets to bulk-create articles with scheduled publish dates and auto-GSC indexing.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Upload Card */}
        <div className="card">
          <div className="card-header">
            <h3><Upload size={16} /> Upload Spreadsheet</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                border: "2px dashed var(--border-strong)",
                borderRadius: "12px",
                padding: "40px 20px",
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color 0.15s",
                background: file ? "rgba(16, 185, 129, 0.05)" : "transparent",
                borderColor: file ? "var(--accent-emerald)" : "var(--border-strong)",
              }}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <input
                type="file"
                id="fileInput"
                accept=".xlsx,.xls,.csv"
                style={{ display: "none" }}
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setResult(null);
                }}
              />
              {file ? (
                <>
                  <CheckCircle2 size={32} style={{ color: "var(--accent-emerald)", marginBottom: "8px" }} />
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>{file.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    {(file.size / 1024).toFixed(1)} KB — Click to change
                  </div>
                </>
              ) : (
                <>
                  <FileSpreadsheet size={32} style={{ color: "var(--text-muted)", marginBottom: "8px" }} />
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    Drop your Excel (.xlsx) or CSV file here
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    or click to browse files
                  </div>
                </>
              )}
            </div>

            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px" }}
              onClick={handleImport}
              disabled={!file || importing}
            >
              {importing ? (
                <>⏳ Processing...</>
              ) : (
                <><Upload size={15} /> Import & Schedule Articles</>
              )}
            </button>
          </div>
        </div>

        {/* Template & Instructions */}
        <div className="card">
          <div className="card-header">
            <h3><FileSpreadsheet size={16} /> Spreadsheet Format</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
              Your spreadsheet must include the following columns in the exact order:
            </p>

            <div className="table-container" style={{ fontSize: "12px" }}>
              <table>
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Required</th>
                    <th>Format</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["title", "Yes", "Text — Article headline"],
                    ["slug", "Yes", "URL-safe lowercase (e.g. my-article)"],
                    ["content", "Yes", "HTML or plain text body"],
                    ["direct_answer", "No", "1–2 sentence quick answer"],
                    ["category", "No", "Category slug"],
                    ["meta_title", "No", "SEO title (50–60 chars)"],
                    ["meta_description", "No", "SEO description (140–160 chars)"],
                    ["featured_image", "No", "URL to WebP image"],
                    ["status", "No", "published / scheduled / draft"],
                    ["published_at", "No", "YYYY-MM-DD HH:MM:SS"],
                    ["tags", "No", "Comma-separated keywords"],
                  ].map(([col, req, fmt]) => (
                    <tr key={col}>
                      <td style={{ fontWeight: 600, fontFamily: "monospace" }}>{col}</td>
                      <td style={{ color: req === "Yes" ? "var(--accent-emerald)" : "var(--text-muted)", fontWeight: 600 }}>
                        {req}
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>{fmt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                <Download size={13} /> Download Template (.xlsx)
              </button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                <Download size={13} /> Download Template (.csv)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Results */}
      {result && (
        <div className="card">
          <div className="card-header">
            <h3>Import Results</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "var(--accent-emerald)",
              fontWeight: 600,
            }}>
              <CheckCircle2 size={16} /> {result.success} articles imported successfully
            </div>
            {result.errors.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-amber)", fontSize: "13px", fontWeight: 600 }}>
                  <AlertTriangle size={14} /> {result.errors.length} warnings
                </div>
                {result.errors.map((err, i) => (
                  <div key={i} style={{ fontSize: "12px", color: "var(--text-muted)", paddingLeft: "22px" }}>
                    • {err}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scheduler Queue Preview */}
      <div className="card">
        <div className="card-header">
          <h3><Clock size={16} /> Automation Scheduler Queue</h3>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
          Articles with <code style={{ color: "var(--accent-purple)", background: "rgba(126,34,206,0.1)", padding: "2px 6px", borderRadius: "4px" }}>status: scheduled</code> and
          a future <code style={{ color: "var(--accent-purple)", background: "rgba(126,34,206,0.1)", padding: "2px 6px", borderRadius: "4px" }}>published_at</code> date
          will automatically be published when their timestamp arrives. The system will also auto-submit to Google Search Console for instant indexing.
        </p>
      </div>
    </div>
  );
}

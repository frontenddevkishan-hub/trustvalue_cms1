"use client";

import { useMemo } from "react";
import { SEOMetadata } from "../lib/types";
import { analyzeSEO } from "../lib/seo-engine";
import { CheckCircle2, AlertTriangle, XCircle, Globe, Sparkles } from "lucide-react";

interface SeoInspectorProps {
  metadata: Partial<SEOMetadata>;
  slug: string;
  bodyText?: string;
  baseUrl?: string;
}

export function SeoInspector({ metadata, slug, bodyText = "", baseUrl = "https://trustvalue.ai" }: SeoInspectorProps) {
  const analysis = useMemo(() => {
    return analyzeSEO(metadata, bodyText);
  }, [metadata, bodyText]);

  const previewUrl = `${baseUrl}/${slug || "preview-slug"}`;

  const scoreColor =
    analysis.score >= 80 ? "var(--accent-emerald)" : analysis.score >= 50 ? "var(--accent-amber)" : "var(--accent-rose)";

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Globe size={18} color="var(--accent-blue)" />
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Google SERP &amp; SEO Inspector</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Health Score:</span>
          <span style={{
            fontSize: "14px",
            fontWeight: 700,
            color: scoreColor,
            backgroundColor: "var(--bg-main)",
            padding: "4px 10px",
            borderRadius: "6px",
            border: `1px solid ${scoreColor}`,
          }}>
            {analysis.score} / 100
          </span>
        </div>
      </div>

      {/* Google SERP Snippet Box */}
      <div style={{
        backgroundColor: "#202124",
        borderRadius: "8px",
        padding: "16px 20px",
        border: "1px solid #3c4043",
        fontFamily: "Arial, sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: "#1a73e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "9px",
            color: "#fff",
            fontWeight: "bold",
          }}>
            T
          </div>
          <div style={{ fontSize: "12px", color: "#bdc1c6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {previewUrl}
          </div>
        </div>

        <div style={{
          color: "#8ab4f8",
          fontSize: "18px",
          lineHeight: "1.3",
          fontWeight: 400,
          cursor: "pointer",
          marginBottom: "4px",
        }}>
          {metadata.title || "Untiled Document — TrustValue.ai"}
        </div>

        <div style={{
          color: "#bdc1c6",
          fontSize: "13px",
          lineHeight: "1.4",
        }}>
          {metadata.description || "No meta description provided. Search engines will generate an excerpt dynamically from the page body."}
        </div>
      </div>

      {/* Metric Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div style={{ backgroundColor: "var(--bg-main)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
            <span style={{ color: "var(--text-muted)" }}>Title Character Count</span>
            <span style={{
              fontWeight: 600,
              color: analysis.titleLength.status === "good" ? "var(--accent-emerald)" : "var(--accent-amber)"
            }}>
              {analysis.titleLength.text}
            </span>
          </div>
          <div style={{ height: "4px", backgroundColor: "var(--border-subtle)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              width: `${Math.min(100, ((metadata.title?.length || 0) / 60) * 100)}%`,
              height: "100%",
              backgroundColor: analysis.titleLength.status === "good" ? "var(--accent-emerald)" : "var(--accent-amber)",
            }} />
          </div>
        </div>

        <div style={{ backgroundColor: "var(--bg-main)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
            <span style={{ color: "var(--text-muted)" }}>Description Length</span>
            <span style={{
              fontWeight: 600,
              color: analysis.descLength.status === "good" ? "var(--accent-emerald)" : "var(--accent-amber)"
            }}>
              {analysis.descLength.text}
            </span>
          </div>
          <div style={{ height: "4px", backgroundColor: "var(--border-subtle)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              width: `${Math.min(100, ((metadata.description?.length || 0) / 160) * 100)}%`,
              height: "100%",
              backgroundColor: analysis.descLength.status === "good" ? "var(--accent-emerald)" : "var(--accent-amber)",
            }} />
          </div>
        </div>
      </div>

      {/* Focus Keyword & Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div style={{
          backgroundColor: "rgba(245, 158, 11, 0.05)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          borderRadius: "8px",
          padding: "14px 16px",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent-amber)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={14} /> Optimization Recommendations ({analysis.suggestions.length})
          </div>
          <ul style={{ paddingLeft: "18px", fontSize: "12px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
            {analysis.suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

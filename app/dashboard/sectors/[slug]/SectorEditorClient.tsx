"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Shield, Tag, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { SectorConfig, SEOMetadata, AttributeDef } from "../../../../lib/types";
import { getCurrentUser } from "../../../../lib/auth";
import { SeoInspector } from "../../../../components/SeoInspector";
import { PublishBar } from "../../../../components/PublishBar";

interface Props {
  initialSector: SectorConfig;
  isNew?: boolean;
}

export function SectorEditorClient({ initialSector, isNew = false }: Props) {
  const router = useRouter();
  const [currentUser] = useState(() => getCurrentUser());
  const [sector, setSector] = useState<SectorConfig>(() => {
    const data = { ...initialSector };
    if (!data.seo) {
      data.seo = {
        title: `${data.name} Ratings, Reviews & Benchmark Index | TrustValue`,
        description: data.description || `Compare top audited brands and products in ${data.name}.`,
        focusKeyword: data.name,
        keywords: [data.name, "TrustScore", "Consumer Reviews", "Regulatory Audit"],
        schemaType: "WebPage",
      };
    }
    return data;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "attributes" | "seo">("general");

  // State for adding a new attribute
  const [newAttr, setNewAttr] = useState<AttributeDef>({
    key: "",
    label: "",
    type: "text",
    unit: "",
    comparable: true,
    filterable: false,
  });

  const handleGeneralChange = (key: keyof SectorConfig, val: any) => {
    if (key === "name" && isNew) {
      // Auto-generate slug if it's new and unmodified
      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      setSector({ ...sector, name: val, slug: autoSlug });
    } else {
      setSector({ ...sector, [key]: val });
    }
  };

  const handleSeoChange = (key: keyof SEOMetadata, val: any) => {
    setSector({
      ...sector,
      seo: {
        ...(sector.seo as SEOMetadata),
        [key]: val,
      },
    });
  };

  const handleAddAttribute = () => {
    if (!newAttr.key || !newAttr.label) {
      alert("Please provide both a Field Key and a Label.");
      return;
    }
    const safeKey = newAttr.key.toLowerCase().replace(/[^a-z0-9_]+/g, "_");
    const updatedAttrs = [...(sector.attributes || []), { ...newAttr, key: safeKey }];
    setSector({ ...sector, attributes: updatedAttrs });
    setNewAttr({
      key: "",
      label: "",
      type: "text",
      unit: "",
      comparable: true,
      filterable: false,
    });
  };

  const handleRemoveAttribute = (indexToRemove: number) => {
    const updated = (sector.attributes || []).filter((_, idx) => idx !== indexToRemove);
    setSector({ ...sector, attributes: updated });
  };

  const handleSave = async () => {
    if (!sector.name || !sector.slug) {
      alert("Sector name and slug are required.");
      return;
    }
    setIsSaving(true);
    try {
      if (isNew) {
        await fetch("/api/v1/sectors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sector),
        });
      } else {
        await fetch(`/api/v1/sectors/${sector.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sector),
        });
      }
    } catch {
      // fallback
    }

    setTimeout(() => {
      setIsSaving(false);
      if (isNew) {
        router.push(`/dashboard/sectors/${sector.slug}`);
      }
    }, 600);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/dashboard/sectors" className="btn btn-secondary" style={{ padding: "8px 12px" }}>
            <ArrowLeft size={16} /> All Sectors
          </Link>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{sector.icon}</span> {isNew ? "Create New Industry Sector" : `${sector.name} (${sector.slug})`}
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {isNew
                ? "Register a new regulated sector with custom metrics and category taxonomy"
                : "Configuring schema and regulatory invariants for the public sector directory"}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", backgroundColor: "var(--bg-surface)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
          <button
            onClick={() => setActiveTab("general")}
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "general" ? "var(--accent-blue)" : "transparent",
              color: activeTab === "general" ? "#fff" : "var(--text-secondary)",
            }}
          >
            General Config
          </button>
          <button
            onClick={() => setActiveTab("attributes")}
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "attributes" ? "var(--accent-blue)" : "transparent",
              color: activeTab === "attributes" ? "#fff" : "var(--text-secondary)",
            }}
          >
            Auditing Attributes ({sector.attributes?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              fontWeight: 500,
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "seo" ? "var(--accent-blue)" : "transparent",
              color: activeTab === "seo" ? "#fff" : "var(--text-secondary)",
            }}
          >
            SEO &amp; SERP Inspector
          </button>
        </div>
      </div>

      {/* Tab 1: General Config */}
      {activeTab === "general" && (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Core Sector Identity</h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Sector Name
              </label>
              <input
                type="text"
                value={sector.name}
                onChange={(e) => handleGeneralChange("name", e.target.value)}
                placeholder="e.g. Fintech, Logistics, Pharmaceuticals..."
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Sector Emoji Icon
              </label>
              <input
                type="text"
                value={sector.icon}
                onChange={(e) => handleGeneralChange("icon", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                URL Route Slug (used in /{sector.slug})
              </label>
              <input
                type="text"
                value={sector.slug}
                disabled={!isNew}
                onChange={(e) => handleGeneralChange("slug", e.target.value)}
                className="input-field"
                style={{ fontFamily: "monospace" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Location Mode
              </label>
              <select
                value={(sector as any).location || "none"}
                onChange={(e) => handleGeneralChange("location" as any, e.target.value)}
                className="input-field"
              >
                <option value="none">None (National / Global)</option>
                <option value="optional">Optional (City Filterable)</option>
                <option value="required">Required (City-Specific Services)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
              Public Description (Lead Paragraph)
            </label>
            <textarea
              rows={3}
              value={sector.description}
              onChange={(e) => handleGeneralChange("description", e.target.value)}
              className="input-field"
              style={{ fontFamily: "inherit", resize: "vertical" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
              Sector Invariant Note (Displayed as warning note on public site)
            </label>
            <input
              type="text"
              value={sector.watch || ""}
              onChange={(e) => handleGeneralChange("watch", e.target.value)}
              placeholder="e.g. Verify regulatory registration number before comparing plans..."
              className="input-field"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Auditing Attributes */}
      {activeTab === "attributes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Add New Attribute Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px", backgroundColor: "#0b1222" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} color="var(--accent-blue)" /> Add New Metric / Attribute to Sector
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr 0.8fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Key (snake_case)
                </label>
                <input
                  type="text"
                  placeholder="e.g. claim_ratio"
                  value={newAttr.key}
                  onChange={(e) => setNewAttr({ ...newAttr, key: e.target.value })}
                  className="input-field"
                  style={{ fontFamily: "monospace", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Display Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Claim Settlement Ratio"
                  value={newAttr.label}
                  onChange={(e) => setNewAttr({ ...newAttr, label: e.target.value })}
                  className="input-field"
                  style={{ fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Data Type
                </label>
                <select
                  value={newAttr.type}
                  onChange={(e) => setNewAttr({ ...newAttr, type: e.target.value as any })}
                  className="input-field"
                  style={{ fontSize: "13px" }}
                >
                  <option value="text">text</option>
                  <option value="percent">percent (%)</option>
                  <option value="currency">currency (₹)</option>
                  <option value="number">number</option>
                  <option value="rating">rating (0-5)</option>
                  <option value="boolean">boolean</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Unit (optional)
                </label>
                <input
                  type="text"
                  placeholder="₹, %, days"
                  value={newAttr.unit || ""}
                  onChange={(e) => setNewAttr({ ...newAttr, unit: e.target.value })}
                  className="input-field"
                  style={{ fontSize: "13px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px" }}>
              <div style={{ display: "flex", gap: "18px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={newAttr.comparable}
                    onChange={(e) => setNewAttr({ ...newAttr, comparable: e.target.checked })}
                    style={{ accentColor: "var(--accent-blue)" }}
                  />
                  Comparable (Side-by-side table)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={newAttr.filterable}
                    onChange={(e) => setNewAttr({ ...newAttr, filterable: e.target.checked })}
                    style={{ accentColor: "var(--accent-blue)" }}
                  />
                  Filterable (Facet selector)
                </label>
              </div>

              <button
                type="button"
                onClick={handleAddAttribute}
                className="btn btn-primary"
                style={{ padding: "6px 14px", fontSize: "13px" }}
              >
                <Plus size={14} /> Add Attribute
              </button>
            </div>
          </div>

          {/* Current Attributes Table */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
                Configured Verification Metrics ({sector.attributes?.length || 0})
              </h3>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Field Key</th>
                    <th>Label</th>
                    <th>Data Type</th>
                    <th>Unit</th>
                    <th>Comparable</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sector.attributes && sector.attributes.length > 0 ? (
                    sector.attributes.map((attr, idx) => (
                      <tr key={attr.key || idx}>
                        <td style={{ fontFamily: "monospace", color: "var(--accent-blue)" }}>{attr.key}</td>
                        <td style={{ fontWeight: 600 }}>{attr.label}</td>
                        <td>
                          <span className="badge badge-draft">{attr.type}</span>
                        </td>
                        <td>{attr.unit || "—"}</td>
                        <td>{attr.comparable ? "✅ Yes" : "❌ No"}</td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(idx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--accent-rose)",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                            title="Remove attribute"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                        No attributes configured yet. Add your first verification metric using the form above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SEO & SERP Preview */}
      {activeTab === "seo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Meta Information</h3>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                SEO Page Title
              </label>
              <input
                type="text"
                value={sector.seo?.title || ""}
                onChange={(e) => handleSeoChange("title", e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Meta Description
              </label>
              <textarea
                rows={3}
                value={sector.seo?.description || ""}
                onChange={(e) => handleSeoChange("description", e.target.value)}
                className="input-field"
                style={{ fontFamily: "inherit" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={sector.seo?.focusKeyword || ""}
                  onChange={(e) => handleSeoChange("focusKeyword", e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Schema Graph Type
                </label>
                <select
                  value={sector.seo?.schemaType || "WebPage"}
                  onChange={(e) => handleSeoChange("schemaType", e.target.value as any)}
                  className="input-field"
                >
                  <option value="WebPage">WebPage</option>
                  <option value="GovernmentService">GovernmentService</option>
                  <option value="FAQPage">FAQPage</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Google SERP Inspector */}
          <SeoInspector
            metadata={sector.seo || {}}
            slug={sector.slug}
            bodyText={sector.description}
          />
        </div>
      )}

      {/* Sticky Publish Bar */}
      <PublishBar
        status="published"
        currentUser={currentUser}
        onSaveDraft={handleSave}
        onPublish={handleSave}
        isSaving={isSaving}
        lastSavedAt={sector.lastEditedAt}
      />
    </div>
  );
}

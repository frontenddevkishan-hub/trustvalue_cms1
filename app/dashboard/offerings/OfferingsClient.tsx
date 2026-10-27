"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Package, Search, ExternalLink, Building2, FolderTree, Layers, Sparkles, CheckCircle2, Plus, X, Check } from "lucide-react";
import { Offering } from "../../../lib/types";

interface EnrichedOffering extends Offering {
  providerName: string;
}

interface SectorSummary {
  slug: string;
  name: string;
  categories: {
    slug: string;
    name: string;
    children?: { slug: string; name: string }[];
  }[];
}

interface ProviderSummary {
  slug: string;
  name: string;
  activeSectors: string[];
}

interface Props {
  initialOfferings: EnrichedOffering[];
  availableSectors?: SectorSummary[];
  availableProviders?: ProviderSummary[];
}

export function OfferingsClient({
  initialOfferings,
  availableSectors = [],
  availableProviders = [],
}: Props) {
  const [offerings, setOfferings] = useState<EnrichedOffering[]>(initialOfferings);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSector, setFormSector] = useState(availableSectors[0]?.slug || "insurance");
  const [formProvider, setFormProvider] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [formSummary, setFormSummary] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCoverage, setFormCoverage] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Available categories flattened for selected sector
  const currentSectorCategories = useMemo(() => {
    const s = availableSectors.find((sec) => sec.slug === formSector);
    if (!s) return [];
    const list: { path: string; label: string }[] = [];
    s.categories.forEach((cat) => {
      list.push({ path: cat.slug, label: cat.name });
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach((ch) => {
          list.push({ path: ch.slug, label: `  ↳ ${ch.name}` });
        });
      }
    });
    return list;
  }, [availableSectors, formSector]);

  // Available providers for selected sector
  const currentSectorProviders = useMemo(() => {
    const list = availableProviders.filter(
      (p) => p.activeSectors.length === 0 || p.activeSectors.includes(formSector)
    );
    return list.length > 0 ? list : availableProviders;
  }, [availableProviders, formSector]);

  const sectors = useMemo(() => {
    const set = new Set<string>();
    offerings.forEach((o) => {
      if (o.sector) set.add(o.sector);
    });
    return Array.from(set);
  }, [offerings]);

  const filtered = useMemo(() => {
    return offerings.filter((o) => {
      const matchSector = selectedSector === "all" || o.sector === selectedSector;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.slug.toLowerCase().includes(q) ||
        o.providerName.toLowerCase().includes(q) ||
        o.primaryCategory.toLowerCase().includes(q) ||
        o.sector.toLowerCase().includes(q);

      return matchSector && matchSearch;
    });
  }, [offerings, selectedSector, searchQuery]);

  const handleNameChange = (val: string) => {
    setFormName(val);
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setFormSlug(autoSlug);
  };

  const handleCreateOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveProvider = formProvider || currentSectorProviders[0]?.slug;
    const effectiveCategory = formCategory || currentSectorCategories[0]?.path || "general";

    if (!formName || !formSlug || !formSector || !effectiveProvider) {
      setStatusMsg({ type: "error", text: "Sector, provider, plan name, and slug are required." });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    const payload: Offering = {
      slug: formSlug.trim(),
      name: formName.trim(),
      sector: formSector,
      provider: effectiveProvider,
      primaryCategory: effectiveCategory,
      status: formStatus,
      lastVerified: new Date().toISOString().split("T")[0],
      summary: formSummary.trim() || `Audited plan offering by ${effectiveProvider}.`,
      attributes: {
        ...(formPrice ? { price_range: formPrice.trim() } : {}),
        ...(formCoverage ? { coverage_limit: formCoverage.trim() } : {}),
      },
    };

    try {
      const res = await fetch("/api/v1/offerings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create offering");
      }

      const pObj = availableProviders.find((p) => p.slug === effectiveProvider);
      const enrichedNew: EnrichedOffering = {
        ...payload,
        providerName: pObj ? pObj.name : effectiveProvider,
      };

      setOfferings((prev) => [enrichedNew, ...prev]);
      setStatusMsg({ type: "success", text: `Plan offering "${formName}" created successfully!` });

      setTimeout(() => {
        setIsModalOpen(false);
        setFormName("");
        setFormSlug("");
        setFormSummary("");
        setFormPrice("");
        setFormCoverage("");
        setStatusMsg(null);
      }, 700);
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(15,23,42,0.85) 100%)",
        border: "1px solid rgba(245,158,11,0.3)",
        borderRadius: "14px",
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--accent-amber)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "6px"
          }}>
            <Sparkles size={14} /> Relational Plan &amp; Product Offerings
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px 0" }}>
            Products, Plans &amp; Schemes
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, maxWidth: "680px" }}>
            Stored in <code style={{ color: "#38bdf8" }}>content/offerings/*.json</code>. Every offering is relational: it belongs to a <strong style={{ color: "#f8fafc" }}>Sector</strong>, is underwritten by a <strong style={{ color: "#f8fafc" }}>Provider Brand</strong>, and files under a <strong style={{ color: "#f8fafc" }}>Category</strong>.
          </p>
        </div>

        <div style={{
          padding: "12px 18px",
          borderRadius: "10px",
          background: "rgba(15,23,42,0.8)",
          border: "1px solid var(--border-subtle)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--accent-amber)" }}>{offerings.length}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
            Active Offerings
          </div>
        </div>
      </div>

      {/* Toolbar (Sticky Pinned) */}
      <div
        className="sticky-filter-bar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
          padding: "14px 18px",
        }}
      >
        {/* Sector Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
          <button
            onClick={() => setSelectedSector("all")}
            style={{
              padding: "5px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              background: selectedSector === "all" ? "var(--accent-amber)" : "var(--bg-main)",
              color: selectedSector === "all" ? "#78350f" : "var(--text-secondary)",
              border: selectedSector === "all" ? "1px solid #f59e0b" : "1px solid var(--border-subtle)",
            }}
          >
            All Sectors ({offerings.length})
          </button>
          {sectors.map((s) => {
            const count = offerings.filter((o) => o.sector === s).length;
            const active = selectedSector === s;
            return (
              <button
                key={s}
                onClick={() => setSelectedSector(s)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  cursor: "pointer",
                  background: active ? "var(--accent-amber)" : "var(--bg-main)",
                  color: active ? "#78350f" : "var(--text-secondary)",
                  border: active ? "1px solid #f59e0b" : "1px solid var(--border-subtle)",
                }}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Add Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 320px", justifyContent: "flex-end" }}>
          <div style={{ position: "relative", minWidth: "220px", maxWidth: "340px", flex: 1 }}>
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
            <input
              type="text"
              placeholder="Search plan name, provider, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 12px 7px 34px",
                borderRadius: "6px",
                background: "var(--bg-main)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{
              whiteSpace: "nowrap",
              padding: "7px 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              background: "#f59e0b",
              borderColor: "#f59e0b",
              color: "#451a03",
              fontWeight: 700
            }}
          >
            <Plus size={15} /> Add Plan Offering
          </button>
        </div>
      </div>

      {/* Grid of Offerings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
        {filtered.map((offering) => {
          const liveUrl = `http://localhost:3000/${offering.sector}/${offering.primaryCategory}/${offering.slug}`;
          return (
            <div
              key={`${offering.sector}-${offering.slug}`}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px",
                border: "1px solid var(--border-subtle)",
                background: "var(--bg-card)",
              }}
            >
              <div>
                {/* Header Row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    background: "rgba(245,158,11,0.12)",
                    color: "var(--accent-amber)",
                    border: "1px solid rgba(245,158,11,0.25)"
                  }}>
                    {offering.sector}
                  </span>

                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: offering.status === "published" ? "var(--accent-emerald)" : "var(--accent-amber)",
                    textTransform: "capitalize"
                  }}>
                    <CheckCircle2 size={12} /> {offering.status}
                  </span>
                </div>

                {/* Offering Title & Provider */}
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "4px 0", color: "var(--text-primary)" }}>
                  {offering.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--accent-blue)", fontWeight: 600 }}>
                  <Building2 size={13} />
                  <span>{offering.providerName}</span>
                </div>

                {/* Canonical Category Breadcrumb */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  background: "var(--bg-main)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  marginTop: "12px",
                  fontFamily: "var(--font-mono, monospace)"
                }}>
                  <FolderTree size={12} style={{ color: "#38bdf8" }} />
                  <span>/{offering.primaryCategory}</span>
                </div>

                {/* Summary */}
                {offering.summary && (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", margin: "10px 0 12px 0" }}>
                    {offering.summary}
                  </p>
                )}

                {/* Attributes Preview */}
                {offering.attributes && Object.keys(offering.attributes).length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                    marginTop: "8px",
                    padding: "8px 10px",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "6px",
                    fontSize: "11px"
                  }}>
                    {Object.entries(offering.attributes).slice(0, 4).map(([k, v]) => (
                      <div key={k} style={{ overflow: "hidden" }}>
                        <span style={{ color: "var(--text-muted)", textTransform: "capitalize" }}>
                          {k.replace(/_/g, " ")}:
                        </span>{" "}
                        <strong style={{ color: "var(--text-primary)" }}>
                          {Array.isArray(v) ? `${v.length} items` : String(v)}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "12px",
                marginTop: "14px",
                borderTop: "1px solid var(--border-subtle)",
                fontSize: "11px",
                color: "var(--text-muted)"
              }}>
                <span>Verified: {offering.lastVerified}</span>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "var(--accent-amber)",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                >
                  Storefront <ExternalLink size={11} />
                </a>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No offerings match your search criteria.
          </div>
        )}
      </div>

      {/* Create Plan / Offering Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px",
        }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "14px",
            width: "100%",
            maxWidth: "600px",
            padding: "24px 28px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Package size={20} style={{ color: "var(--accent-amber)" }} />
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Create Product / Plan Offering
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOffering} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Sector, Provider, Category Relational Chain */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    1. Parent Sector *
                  </label>
                  <select
                    value={formSector}
                    onChange={(e) => {
                      setFormSector(e.target.value);
                      setFormProvider("");
                      setFormCategory("");
                    }}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px" }}
                  >
                    {availableSectors.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name} ({s.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    2. Underwriting Provider Brand *
                  </label>
                  <select
                    value={formProvider || currentSectorProviders[0]?.slug || ""}
                    onChange={(e) => setFormProvider(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px" }}
                  >
                    {currentSectorProviders.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} ({p.slug})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  3. Primary Category Taxonomy *
                </label>
                <select
                  value={formCategory || currentSectorCategories[0]?.path || ""}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", padding: "8px 12px", fontFamily: "var(--font-mono, monospace)" }}
                >
                  {currentSectorCategories.length > 0 ? (
                    currentSectorCategories.map((c) => (
                      <option key={c.path} value={c.path}>
                        {c.label} ({c.path})
                      </option>
                    ))
                  ) : (
                    <option value="general">General</option>
                  )}
                </select>
              </div>

              {/* Name & Slug */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Plan / Offering Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Protect Term Plus"
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Plan Slug *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. pure-protect-term-plus"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px", fontFamily: "var(--font-mono, monospace)" }}
                    required
                  />
                </div>
              </div>

              {/* Status & Attributes */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Publication Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px" }}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Under Review)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Price / Premium Range (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 850–2,400 / month"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Max Benefit / Cover / Sum Assured (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 1 Crore – 5 Crore"
                  value={formCoverage}
                  onChange={(e) => setFormCoverage(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", padding: "8px 12px" }}
                />
              </div>

              {/* Summary */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Plan Summary / Editorial Highlights
                </label>
                <textarea
                  placeholder="Key differentiators, audited terms, claim turnaround guarantee..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", minHeight: "65px", padding: "8px 12px" }}
                />
              </div>

              {/* Status Message */}
              {statusMsg && (
                <div style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  background: statusMsg.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: statusMsg.type === "success" ? "var(--accent-emerald)" : "var(--accent-rose)",
                  border: `1px solid ${statusMsg.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                }}>
                  {statusMsg.text}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "#f59e0b",
                    borderColor: "#f59e0b",
                    color: "#451a03",
                    fontWeight: 700
                  }}
                >
                  {isSubmitting ? "Creating..." : <><Check size={14} /> Create Plan Offering</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

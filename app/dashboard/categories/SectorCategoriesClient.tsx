"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FolderTree, Search, ExternalLink, Package, ArrowRight, Layers, Sparkles, Plus, X, Check } from "lucide-react";
import { ResolvedCategory } from "../../../lib/types";

interface SectorSummary {
  slug: string;
  name: string;
  categories: { slug: string; name: string }[];
}

interface Props {
  initialCategories: ResolvedCategory[];
  availableSectors?: SectorSummary[];
}

export function SectorCategoriesClient({ initialCategories, availableSectors = [] }: Props) {
  const [categories, setCategories] = useState<ResolvedCategory[]>(initialCategories);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSector, setFormSector] = useState(availableSectors[0]?.slug || "insurance");
  const [formParent, setFormParent] = useState("");
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formIntro, setFormIntro] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Available parent categories for currently selected sector in modal
  const currentSectorParents = useMemo(() => {
    const s = availableSectors.find((sec) => sec.slug === formSector);
    return s?.categories || [];
  }, [availableSectors, formSector]);

  const sectors = useMemo(() => {
    if (availableSectors.length > 0) {
      return availableSectors.map((s) => ({ slug: s.slug, name: s.name }));
    }
    const map = new Map<string, string>();
    categories.forEach((c) => {
      map.set(c.sectorSlug, c.sectorName);
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [availableSectors, categories]);

  const filtered = useMemo(() => {
    return categories.filter((c) => {
      const matchSector = selectedSector === "all" || c.sectorSlug === selectedSector;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.sectorName.toLowerCase().includes(q) ||
        c.path.join("/").toLowerCase().includes(q);

      return matchSector && matchSearch;
    });
  }, [categories, selectedSector, searchQuery]);

  const handleNameChange = (val: string) => {
    setFormName(val);
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setFormSlug(autoSlug);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSector || !formName || !formSlug) {
      setStatusMsg({ type: "error", text: "Sector, name, and slug are required." });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/v1/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectorSlug: formSector,
          name: formName.trim(),
          slug: formSlug.trim(),
          parentCategorySlug: formParent || undefined,
          intro: formIntro.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      // Add to local state immediately
      const secObj = availableSectors.find((s) => s.slug === formSector);
      const parentPath = formParent ? [formParent, formSlug] : [formSlug];
      const newResolved: ResolvedCategory = {
        sectorSlug: formSector,
        sectorName: secObj ? secObj.name : formSector,
        slug: formSlug,
        name: formName,
        path: parentPath,
        level: formParent ? 2 : 1,
        offeringsCount: 0,
      };

      setCategories((prev) => [newResolved, ...prev]);
      setStatusMsg({ type: "success", text: `Category "${formName}" created successfully!` });

      setTimeout(() => {
        setIsModalOpen(false);
        setFormName("");
        setFormSlug("");
        setFormIntro("");
        setFormParent("");
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
        background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(15,23,42,0.85) 100%)",
        border: "1px solid rgba(59,130,246,0.3)",
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
            color: "var(--accent-blue)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "6px"
          }}>
            <Sparkles size={14} /> Level 1 &amp; 2 Taxonomy Architecture
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px 0" }}>
            Sector Categories Taxonomy
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, maxWidth: "680px" }}>
            Hierarchical categories authored in <code style={{ color: "#38bdf8" }}>content/sectors/[sector].json</code>. Every category routes to <code style={{ color: "#a7f3d0" }}>/[sector]/[category]</code> and categorizes audited products &amp; provider plans.
          </p>
        </div>

        <div style={{
          padding: "12px 18px",
          borderRadius: "10px",
          background: "rgba(15,23,42,0.8)",
          border: "1px solid var(--border-subtle)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>{categories.length}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
            Mapped Categories
          </div>
        </div>
      </div>

      {/* Toolbar: Sector filter, Search & Add Category (Sticky Pinned) */}
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
              background: selectedSector === "all" ? "var(--accent-blue)" : "var(--bg-main)",
              color: selectedSector === "all" ? "#fff" : "var(--text-secondary)",
              border: selectedSector === "all" ? "1px solid #3b82f6" : "1px solid var(--border-subtle)",
            }}
          >
            All Sectors ({categories.length})
          </button>
          {sectors.map((s) => {
            const count = categories.filter((c) => c.sectorSlug === s.slug).length;
            const active = selectedSector === s.slug;
            return (
              <button
                key={s.slug}
                onClick={() => setSelectedSector(s.slug)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: active ? "var(--accent-blue)" : "var(--bg-main)",
                  color: active ? "#fff" : "var(--text-secondary)",
                  border: active ? "1px solid #3b82f6" : "1px solid var(--border-subtle)",
                }}
              >
                {s.name} ({count})
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
              placeholder="Search category name, path, or sector..."
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
            style={{ whiteSpace: "nowrap", padding: "7px 14px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px" }}
          >
            <Plus size={15} /> Add Category
          </button>
        </div>
      </div>

      {/* Table of Relational Categories */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-main)" }}>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Category Name</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Parent Sector</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Taxonomy Depth</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Canonical Path</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600 }}>Audited Products</th>
              <th style={{ padding: "12px 16px", color: "var(--text-muted)", fontWeight: 600, textAlign: "right" }}>Storefront URL</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat, idx) => {
              const liveUrl = `http://localhost:3000/${cat.sectorSlug}/${cat.path.join("/")}`;
              return (
                <tr key={idx} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--text-primary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: `${(cat.level - 1) * 16}px` }}>
                      <FolderTree size={14} style={{ color: cat.level === 1 ? "var(--accent-blue)" : "#a855f7" }} />
                      <span>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: "rgba(59,130,246,0.1)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.2)"
                    }}>
                      {cat.sectorName}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-mono, monospace)"
                    }}>
                      <Layers size={12} /> Level {cat.level}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono, monospace)", color: "#38bdf8", fontSize: "12px" }}>
                    /{cat.sectorSlug}/{cat.path.join("/")}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      color: cat.offeringsCount > 0 ? "var(--accent-emerald)" : "var(--text-muted)",
                      fontWeight: 600
                    }}>
                      <Package size={13} /> {cat.offeringsCount} plan{cat.offeringsCount === 1 ? "" : "s"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        color: "var(--accent-blue)",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      View Live <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  No categories match your search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Category Modal */}
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
            maxWidth: "520px",
            padding: "24px 28px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FolderTree size={20} style={{ color: "var(--accent-blue)" }} />
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Create Sector Category
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Sector Selection */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Parent Sector Hub *
                </label>
                <select
                  value={formSector}
                  onChange={(e) => {
                    setFormSector(e.target.value);
                    setFormParent("");
                  }}
                  className="input-field"
                  style={{ width: "100%", padding: "8px 12px" }}
                >
                  {sectors.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name} ({s.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Parent Category (Optional) */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Parent Category (Optional - for Level 2 nesting)
                </label>
                <select
                  value={formParent}
                  onChange={(e) => setFormParent(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", padding: "8px 12px" }}
                >
                  <option value="">-- None (Top-Level Category) --</option>
                  {currentSectorParents.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.slug})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Name */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Critical Illness Insurance"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", padding: "8px 12px" }}
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  URL Slug *
                </label>
                <input
                  type="text"
                  placeholder="e.g. critical-illness-insurance"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", padding: "8px 12px", fontFamily: "var(--font-mono, monospace)" }}
                  required
                />
                <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                  Canonical URL: /{formSector}/{formParent ? `${formParent}/` : ""}{formSlug || "..."}
                </span>
              </div>

              {/* Intro / Description */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
                  Description / Intro (Optional)
                </label>
                <textarea
                  placeholder="Brief summary explaining what this category covers..."
                  value={formIntro}
                  onChange={(e) => setFormIntro(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", minHeight: "60px", padding: "8px 12px" }}
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
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
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
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {isSubmitting ? "Saving..." : <><Check size={14} /> Save Category</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

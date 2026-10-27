"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Building2, Search, ExternalLink, Package, Globe, ShieldCheck, Sparkles, Layers, Plus, X, Check } from "lucide-react";
import { Provider } from "../../../lib/types";

interface EnrichedProvider extends Provider {
  offeringsCount: number;
  activeSectors: string[];
}

interface SectorSummary {
  slug: string;
  name: string;
}

interface Props {
  initialProviders: EnrichedProvider[];
  availableSectors?: SectorSummary[];
}

export function ProvidersClient({ initialProviders, availableSectors = [] }: Props) {
  const [providers, setProviders] = useState<EnrichedProvider[]>(initialProviders);
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formType, setFormType] = useState("Insurer");
  const [formParentGroup, setFormParentGroup] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formSector, setFormSector] = useState(availableSectors[0]?.slug || "insurance");
  const [formRegistration, setFormRegistration] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Unique sectors from providers
  const allSectors = useMemo(() => {
    const set = new Set<string>();
    providers.forEach((p) => {
      p.activeSectors.forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [providers]);

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchSector = selectedSector === "all" || p.activeSectors.includes(selectedSector);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.parentGroup?.toLowerCase().includes(q);

      return matchSector && matchSearch;
    });
  }, [providers, selectedSector, searchQuery]);

  const handleNameChange = (val: string) => {
    setFormName(val);
    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setFormSlug(autoSlug);
  };

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSlug || !formSector) {
      setStatusMsg({ type: "error", text: "Provider name, slug, and sector are required." });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    const payload: Provider = {
      slug: formSlug.trim(),
      name: formName.trim(),
      type: formType.trim(),
      parentGroup: formParentGroup.trim() || undefined,
      website: formWebsite.trim() || undefined,
      sectors: {
        [formSector]: {
          description: formDescription.trim() || `Audited provider profile for ${formName}.`,
          registration: formRegistration.trim() || undefined,
        },
      },
    };

    try {
      const res = await fetch("/api/v1/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create provider");
      }

      const enrichedNew: EnrichedProvider = {
        ...payload,
        offeringsCount: 0,
        activeSectors: [formSector],
      };

      setProviders((prev) => [enrichedNew, ...prev]);
      setStatusMsg({ type: "success", text: `Provider brand "${formName}" created successfully!` });

      setTimeout(() => {
        setIsModalOpen(false);
        setFormName("");
        setFormSlug("");
        setFormParentGroup("");
        setFormWebsite("");
        setFormRegistration("");
        setFormDescription("");
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
        background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(15,23,42,0.85) 100%)",
        border: "1px solid rgba(16,185,129,0.3)",
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
            color: "var(--accent-emerald)",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "6px"
          }}>
            <Sparkles size={14} /> Registered Institutional Directory
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 6px 0" }}>
            Providers &amp; Registered Brands
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0, maxWidth: "680px" }}>
            Real institution profiles stored in <code style={{ color: "#38bdf8" }}>content/providers.json</code>. Each provider can operate across multiple sectors, with statutory registration numbers and verified products.
          </p>
        </div>

        <div style={{
          padding: "12px 18px",
          borderRadius: "10px",
          background: "rgba(15,23,42,0.8)",
          border: "1px solid var(--border-subtle)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "var(--accent-emerald)" }}>{providers.length}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
            Audited Brands
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
              background: selectedSector === "all" ? "var(--accent-emerald)" : "var(--bg-main)",
              color: selectedSector === "all" ? "#064e3b" : "var(--text-secondary)",
              border: selectedSector === "all" ? "1px solid #10b981" : "1px solid var(--border-subtle)",
            }}
          >
            All Sectors ({providers.length})
          </button>
          {allSectors.map((s) => {
            const count = providers.filter((p) => p.activeSectors.includes(s)).length;
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
                  background: active ? "var(--accent-emerald)" : "var(--bg-main)",
                  color: active ? "#064e3b" : "var(--text-secondary)",
                  border: active ? "1px solid #10b981" : "1px solid var(--border-subtle)",
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
              placeholder="Search provider name, type, or parent group..."
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
              background: "#10b981",
              borderColor: "#10b981",
              color: "#064e3b",
              fontWeight: 700
            }}
          >
            <Plus size={15} /> Add Provider Brand
          </button>
        </div>
      </div>

      {/* Grid of Providers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px" }}>
        {filtered.map((prov) => {
          return (
            <div
              key={prov.slug}
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
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(16,185,129,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-emerald)"
                    }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                        {prov.name}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>
                          {prov.type}
                        </span>
                        {prov.parentGroup && (
                          <span style={{ fontSize: "11px", color: "var(--accent-blue)", fontWeight: 600 }}>
                            • {prov.parentGroup}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {prov.website && (
                    <a
                      href={prov.website}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: "var(--text-muted)",
                        padding: "4px",
                        display: "inline-flex",
                        alignItems: "center"
                      }}
                      title="Visit Official Website"
                    >
                      <Globe size={15} />
                    </a>
                  )}
                </div>

                {/* Active Sectors & Registrations */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "14px 0" }}>
                  {Object.entries(prov.sectors || {}).map(([secSlug, profile]) => (
                    <div
                      key={secSlug}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "6px",
                        background: "var(--bg-main)",
                        border: "1px solid var(--border-subtle)",
                        fontSize: "12px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{
                          textTransform: "uppercase",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "var(--accent-emerald)",
                          letterSpacing: "0.5px"
                        }}>
                          {secSlug}
                        </span>
                        {profile.registration && (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            fontSize: "10px",
                            color: "var(--text-secondary)",
                            fontFamily: "var(--font-mono, monospace)"
                          }}>
                            <ShieldCheck size={11} style={{ color: "var(--accent-emerald)" }} />
                            {profile.registration}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                        {profile.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "12px",
                borderTop: "1px solid var(--border-subtle)",
                fontSize: "12px"
              }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  color: prov.offeringsCount > 0 ? "var(--text-primary)" : "var(--text-muted)",
                  fontWeight: 600
                }}>
                  <Package size={13} style={{ color: "var(--accent-emerald)" }} />
                  {prov.offeringsCount} registered offering{prov.offeringsCount === 1 ? "" : "s"}
                </span>

                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
                  slug: {prov.slug}
                </span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No providers found matching your filter criteria.
          </div>
        )}
      </div>

      {/* Create Provider Modal */}
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
            maxWidth: "560px",
            padding: "24px 28px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Building2 size={20} style={{ color: "var(--accent-emerald)" }} />
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Register Provider / Brand
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProvider} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Name & Slug */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Brand / Entity Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tata AIA Life"
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Brand Slug *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. tata-aia-life"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px", fontFamily: "var(--font-mono, monospace)" }}
                    required
                  />
                </div>
              </div>

              {/* Type & Parent Group */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Entity Type *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px" }}
                  >
                    <option value="Insurer">Insurer</option>
                    <option value="Bank">Bank</option>
                    <option value="Builder">Builder / Real Estate</option>
                    <option value="Hospital chain">Hospital Chain</option>
                    <option value="Brand">Consumer Brand</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Fintech">Fintech / NBFC</option>
                    <option value="Platform">Platform / Marketplace</option>
                    <option value="Ministry">Government Ministry</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Parent Conglomerate / Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tata Group"
                    value={formParentGroup}
                    onChange={(e) => setFormParentGroup(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px" }}
                  />
                </div>
              </div>

              {/* Official Website */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Official Website
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/brand"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", padding: "8px 12px" }}
                />
              </div>

              {/* Primary Operating Sector & Statutory License */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Operating Sector *
                  </label>
                  <select
                    value={formSector}
                    onChange={(e) => setFormSector(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px" }}
                  >
                    {(availableSectors.length > 0 ? availableSectors : allSectors.map((s) => ({ slug: s, name: s }))).map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Statutory License / Reg No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IRDAI-REG-0110"
                    value={formRegistration}
                    onChange={(e) => setFormRegistration(e.target.value)}
                    className="input-field"
                    style={{ width: "100%", padding: "8px 12px", fontFamily: "var(--font-mono, monospace)" }}
                  />
                </div>
              </div>

              {/* Institutional Summary */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Institutional Profile Description
                </label>
                <textarea
                  placeholder="Summary of the provider's operations, market standing, and consumer trust record..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="input-field"
                  style={{ width: "100%", minHeight: "65px", padding: "8px 12px" }}
                />
              </div>

              {/* Status Msg */}
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

              {/* Action buttons */}
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
                    background: "#10b981",
                    borderColor: "#10b981",
                    color: "#064e3b",
                    fontWeight: 700
                  }}
                >
                  {isSubmitting ? "Registering..." : <><Check size={14} /> Register Provider</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

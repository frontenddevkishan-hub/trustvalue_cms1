"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Plus, FolderTree, Building2, Package, ExternalLink } from "lucide-react";
import { SectorConfig } from "../../../lib/types";

interface EnrichedSector extends SectorConfig {
  providersCount?: number;
  offeringsCount?: number;
  categoriesCount?: number;
}

export function SectorsClient({ initialSectors }: { initialSectors: EnrichedSector[] }) {
  const [query, setQuery] = useState("");

  const filtered = initialSectors.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.slug.toLowerCase().includes(query.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px" }}>
          Sector Taxonomies &amp; Audit Schemas
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
          The 18 root regulated industry hubs. Directly maps to Categories, Registered Brands, and Verified Plans.
        </p>
      </div>

      {/* Search & Actions Bar (Sticky Pinned) */}
      <div
        className="sticky-filter-bar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div style={{ position: "relative", flex: 1, maxWidth: "380px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search sectors by name, slug, or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: "36px" }}
          />
        </div>

        <Link href="/dashboard/sectors/new" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
          <Plus size={16} /> Add New Sector
        </Link>
      </div>

      {/* Sectors Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {filtered.map((sector) => {
          const liveStorefrontUrl = `http://localhost:3000/${sector.slug}`;
          return (
            <div key={sector.slug} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "28px" }}>{sector.icon}</span>
                  <a
                    href={liveStorefrontUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "11px",
                      color: "var(--accent-blue)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Public Hub <ExternalLink size={11} />
                  </a>
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                  {sector.name}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.5", minHeight: "36px" }}>
                  {sector.description}
                </p>

                {/* Relational Chain Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginTop: "14px" }}>
                  <Link
                    href={`/dashboard/categories?search=${sector.slug}`}
                    style={{
                      padding: "8px 6px",
                      borderRadius: "6px",
                      background: "var(--bg-main)",
                      border: "1px solid var(--border-subtle)",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    <FolderTree size={14} style={{ color: "#38bdf8", margin: "0 auto 4px auto" }} />
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {sector.categoriesCount ?? (sector.categories || []).length}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Categories</div>
                  </Link>

                  <Link
                    href={`/dashboard/providers?search=${sector.slug}`}
                    style={{
                      padding: "8px 6px",
                      borderRadius: "6px",
                      background: "var(--bg-main)",
                      border: "1px solid var(--border-subtle)",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Building2 size={14} style={{ color: "var(--accent-emerald)", margin: "0 auto 4px auto" }} />
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {sector.providersCount ?? 0}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Brands</div>
                  </Link>

                  <Link
                    href={`/dashboard/offerings?search=${sector.slug}`}
                    style={{
                      padding: "8px 6px",
                      borderRadius: "6px",
                      background: "var(--bg-main)",
                      border: "1px solid var(--border-subtle)",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    <Package size={14} style={{ color: "var(--accent-amber)", margin: "0 auto 4px auto" }} />
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {sector.offeringsCount ?? 0}
                    </div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>Plans</div>
                  </Link>
                </div>
              </div>

              <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)" }}>
                <Link
                  href={`/dashboard/sectors/${sector.slug}`}
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Configure Sector &amp; Rules <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

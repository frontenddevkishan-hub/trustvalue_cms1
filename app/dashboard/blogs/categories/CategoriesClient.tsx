"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, FolderTree } from "lucide-react";
import { BlogCategory } from "../../../../lib/types";

const INITIAL_CATEGORIES: BlogCategory[] = [
  { id: "cat_1", name: "Insurance & IRDAI Compliance", slug: "insurance-irdai-compliance", description: "Regulatory analysis, consumer circulars, and IRDAI oversight content.", articleCount: 12 },
  { id: "cat_2", name: "Real Estate & RERA", slug: "real-estate-rera", description: "RERA compliance, property buyer guides, and builder accountability.", articleCount: 8 },
  { id: "cat_3", name: "Healthcare & NABH", slug: "healthcare-nabh", description: "Hospital accreditation, NABH standards, and patient rights.", articleCount: 5 },
  { id: "cat_4", name: "Banking & RBI", slug: "banking-rbi", description: "RBI circulars, consumer banking rights, and fintech compliance.", articleCount: 14 },
  { id: "cat_5", name: "Fraud Detection & Consumer Alerts", slug: "fraud-detection-consumer-alerts", description: "Trust score fraud patterns, scam detection, and consumer warnings.", articleCount: 3 },
  { id: "cat_6", name: "Investments & SEBI", slug: "investments-sebi", description: "SEBI guidelines, mutual fund analysis, and investor protection.", articleCount: 6 },
];

export function CategoriesClient() {
  const [categories, setCategories] = useState<BlogCategory[]>(INITIAL_CATEGORIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setError("");
  };

  const startEdit = (cat: BlogCategory) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || "");
  };

  const autoSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setError("Category name is required.");
      return;
    }

    const slug = formSlug.trim() || autoSlug(formName);

    // Check unique slug
    const existing = categories.find((c) => c.slug === slug && c.id !== editingId);
    if (existing) {
      setError("A category with this slug already exists.");
      return;
    }

    if (editingId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, name: formName, slug, description: formDesc } : c
        )
      );
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat_${Date.now()}`,
          name: formName,
          slug,
          description: formDesc,
          articleCount: 0,
        },
      ]);
    }

    resetForm();
  };

  const handleDelete = (cat: BlogCategory) => {
    if (confirm(`Delete category "${cat.name}"? Articles using this category will become uncategorized.`)) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px", marginBottom: "4px" }}>
          Blog Categories &amp; Topic Silos
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          Organize investigative articles and research guides into SEO topic clusters with unique slug permalinks.
        </p>
      </div>

      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          color: "#f87171",
          padding: "10px 16px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 500,
        }}>
          ⚠ {error}
        </div>
      )}

      <div className="admin-grid-sidebar">
        {/* Create / Edit Form (Sticky Pinned) */}
        <div className="card" style={{ position: "sticky", top: "85px" }}>
          <div className="card-header">
            <h3><FolderTree size={16} /> {editingId ? "Edit Category" : "Create New Category Silo"}</h3>
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="catName">Category Name *</label>
              <input
                type="text"
                id="catName"
                className="input-field"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!editingId) setFormSlug(autoSlug(e.target.value));
                }}
                placeholder="e.g. Satellite & Connectivity"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="catSlug">Slug (Permalinks)</label>
              <input
                type="text"
                id="catSlug"
                className="input-field"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. satellite-connectivity"
                style={{ fontFamily: "monospace" }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="catDesc">SEO Silo Description</label>
              <textarea
                id="catDesc"
                className="input-field"
                rows={3}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Brief editorial overview of this cluster for Google ranking..."
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "10px" }}>
                {editingId ? "Update Category" : "+ Create Category"}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Category List Table */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "20px 24px 0 24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>
              Existing Categories ({categories.length})
            </h3>
          </div>
          <div className="table-container" style={{ border: "none", borderRadius: 0, marginTop: "12px" }}>
            <table>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Articles</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 600 }}>{cat.name}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: "monospace" }}>
                      /{cat.slug}
                    </td>
                    <td>
                      <span className="category-tag">
                        {cat.articleCount || 0} Articles
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="action-row">
                        <a
                          href={`/${cat.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-xs btn-secondary"
                        >
                          View <ExternalLink size={11} />
                        </a>
                        <button
                          className="btn btn-xs btn-secondary"
                          onClick={() => startEdit(cat)}
                        >
                          <Pencil size={11} /> Edit
                        </button>
                        <button
                          className="btn btn-xs btn-outline-danger"
                          onClick={() => handleDelete(cat)}
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state">
                        <p>No categories created yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

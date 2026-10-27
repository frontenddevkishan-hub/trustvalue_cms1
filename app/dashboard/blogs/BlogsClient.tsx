"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  Download,
  Clock,
  Trash2,
  CheckCircle2,
  X,
  Calendar,
  Eye,
  MessageSquare,
  ExternalLink,
  Zap,
  RotateCcw,
} from "lucide-react";
import { BlogPost, ContentStatus } from "../../../lib/types";
import { analyzeSEO } from "../../../lib/seo-engine";

interface Props {
  initialBlogs: BlogPost[];
}

type StatusTab = "all" | "published" | "scheduled" | "draft";

export function BlogsClient({ initialBlogs }: Props) {
  const [query, setQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  // Status counts
  const counts = useMemo(() => {
    const all = initialBlogs.length;
    const published = initialBlogs.filter((b) => b.status === "published").length;
    const scheduled = initialBlogs.filter((b) => b.status === "scheduled").length;
    const drafts = initialBlogs.filter((b) => b.status === "draft").length;
    return { all, published, scheduled, drafts };
  }, [initialBlogs]);

  // Filter articles
  const filtered = useMemo(() => {
    return initialBlogs.filter((b) => {
      const matchesQuery =
        !query ||
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.summary.toLowerCase().includes(query.toLowerCase()) ||
        b.slug.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase());
      const matchesSector = selectedSector === "all" || b.sector === selectedSector;
      const matchesCategory = selectedCategory === "all" || b.categoryId === selectedCategory;
      const matchesStatus =
        statusTab === "all" ||
        (statusTab === "published" && b.status === "published") ||
        (statusTab === "scheduled" && b.status === "scheduled") ||
        (statusTab === "draft" && (b.status === "draft" || b.status === "in_review"));
      return matchesQuery && matchesSector && matchesCategory && matchesStatus;
    });
  }, [initialBlogs, query, selectedSector, selectedCategory, statusTab]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginatedBlogs = filtered.slice((page - 1) * perPage, page * perPage);

  // Scheduled articles info
  const scheduledBlogs = initialBlogs
    .filter((b) => b.status === "scheduled")
    .sort((a, b) => (a.publishedAt || "").localeCompare(b.publishedAt || ""));
  const nextScheduled = scheduledBlogs[0];
  const dueCount = scheduledBlogs.filter(
    (b) => b.publishedAt && new Date(b.publishedAt) <= new Date()
  ).length;

  // Selection handlers
  const toggleSelect = (slug: string) => {
    const next = new Set(selectedIds);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedBlogs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedBlogs.map((b) => b.slug)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Permanently delete ${selectedIds.size} selected article(s)?`)) {
      // In production: call DELETE API for each
      alert(`Deleted ${selectedIds.size} articles (simulated)`);
      clearSelection();
    }
  };

  const handleBulkPublish = () => {
    if (selectedIds.size === 0) return;
    if (
      confirm(
        `Publish ${selectedIds.size} scheduled article(s) immediately to live site?`
      )
    ) {
      alert(`Published ${selectedIds.size} articles (simulated)`);
      clearSelection();
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return "Due now";
    const hours = Math.round(diff / 3600000);
    const days = Math.round(diff / 86400000);
    if (hours < 24) return `In ${Math.max(1, hours)} hr${hours > 1 ? "s" : ""}`;
    return `In ${days} day${days > 1 ? "s" : ""}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.4px",
              marginBottom: "4px",
            }}
          >
            All Articles & Research
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
            }}
          >
            Manage, edit, schedule, or bulk upload content via Excel
            spreadsheets.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href="/dashboard/blogs/import"
            className="btn btn-secondary btn-sm"
          >
            <FileSpreadsheet size={14} /> Bulk Import & Scheduler
          </Link>
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Export to CSV
          </button>
          <Link href="/dashboard/blogs/new" className="btn btn-primary btn-sm">
            <Plus size={14} /> New Article
          </Link>
        </div>
      </div>

      {/* Sticky Filter Toolbar (Status Tabs + Search & Sector Controls) */}
      <div
        className="sticky-filter-bar"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "14px 18px",
        }}
      >
        {/* Status Filter Tabs Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            className={`tab-btn ${statusTab === "all" ? "active" : ""}`}
            onClick={() => { setStatusTab("all"); setPage(1); }}
          >
            All ({counts.all})
          </button>
          <button
            className={`tab-btn ${statusTab === "published" ? "active" : ""}`}
            onClick={() => { setStatusTab("published"); setPage(1); }}
            style={statusTab !== "published" ? { color: "#34d399" } : undefined}
          >
            Published ({counts.published})
          </button>
          <button
            className={`tab-btn ${statusTab === "scheduled" ? "active active-scheduled" : ""}`}
            onClick={() => { setStatusTab("scheduled"); setPage(1); }}
            style={statusTab !== "scheduled" ? { color: "#c084fc" } : undefined}
          >
            <Clock size={13} /> Scheduled ({counts.scheduled})
          </button>
          <button
            className={`tab-btn ${statusTab === "draft" ? "active" : ""}`}
            onClick={() => { setStatusTab("draft"); setPage(1); }}
          >
            Drafts ({counts.drafts})
          </button>

          {dueCount > 0 && (
            <button
              className="btn btn-sm"
              style={{
                background: "#10B981",
                borderColor: "#10B981",
                color: "#fff",
                marginLeft: "auto",
                fontWeight: 600,
              }}
            >
              <Zap size={13} /> Publish {dueCount} Due Now &amp; Sync GSC
            </button>
          )}
        </div>

        {/* Search & Sector Filters Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "12px",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder="Search articles by title, slug, excerpt, or author..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="input-field"
              style={{ paddingLeft: "36px" }}
            />
          </div>

          <select
            value={selectedSector}
            onChange={(e) => { setSelectedSector(e.target.value); setPage(1); }}
            className="input-field"
            style={{ width: "180px" }}
          >
            <option value="all">All Sectors</option>
            <option value="insurance">Insurance</option>
            <option value="real-estate">Real Estate</option>
            <option value="healthcare">Healthcare</option>
            <option value="banking">Banking</option>
            <option value="investments">Investments</option>
          </select>

          <div className="per-page-selector">
            <span>Show</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>All</option>
            </select>
            <span>per page</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bulk-toolbar visible">
          <span className="count">{selectedIds.size} selected</span>
          <button
            className="btn btn-sm btn-secondary"
            onClick={clearSelection}
          >
            <X size={13} /> Clear
          </button>
          {statusTab === "scheduled" && (
            <button
              className="btn btn-sm btn-success"
              onClick={handleBulkPublish}
            >
              <CheckCircle2 size={13} /> Publish Selected Now
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleBulkDelete}
          >
            <Trash2 size={13} /> Delete ({selectedIds.size})
          </button>
        </div>
      )}

      {/* Articles Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th className="col-check">
                <input
                  type="checkbox"
                  checked={
                    paginatedBlogs.length > 0 &&
                    selectedIds.size === paginatedBlogs.length
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Article Title & Excerpt</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th>Comments</th>
              <th>Date</th>
              <th>SEO</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBlogs.length > 0 ? (
              paginatedBlogs.map((blog, idx) => {
                const seoAnalysis = analyzeSEO(blog.seo, blog.body);
                const scoreColor =
                  seoAnalysis.score >= 80
                    ? "var(--accent-emerald)"
                    : seoAnalysis.score >= 50
                    ? "var(--accent-amber)"
                    : "var(--accent-rose)";

                return (
                  <tr key={blog.slug}>
                    <td className="col-check">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(blog.slug)}
                        onChange={() => toggleSelect(blog.slug)}
                      />
                    </td>

                    {/* Title & Slug */}
                    <td style={{ maxWidth: "400px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {blog.status === "scheduled" && (
                          <span
                            style={{
                              background: "#f3e8ff",
                              color: "#7e22ce",
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "1px 6px",
                              borderRadius: "4px",
                              flexShrink: 0,
                            }}
                          >
                            #{(page - 1) * perPage + idx + 1}
                          </span>
                        )}
                        <Link
                          href={`/dashboard/blogs/${blog.slug}`}
                          style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "14px" }}
                        >
                          {blog.title}
                        </Link>
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          marginTop: "3px",
                          fontFamily: "monospace",
                        }}
                      >
                        /articles/{blog.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="category-tag">
                        {blog.sector}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      {blog.status === "scheduled" ? (
                        <>
                          <span className="badge badge-scheduled">
                            <Clock size={11} /> Scheduled
                          </span>
                          {blog.publishedAt && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#c084fc",
                                fontWeight: 600,
                                marginTop: "4px",
                              }}
                            >
                              <Calendar size={10} />{" "}
                              {new Date(blog.publishedAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}{" "}
                              ({formatRelativeTime(blog.publishedAt)})
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <span
                            className={`badge badge-${blog.status}`}
                          >
                            {blog.status === "published"
                              ? "Published"
                              : blog.status === "draft"
                              ? "Draft"
                              : blog.status.replace("_", " ")}
                          </span>
                          {blog.status === "published" && (
                            <div style={{ marginTop: "4px" }}>
                              <span
                                className={`indexed-tag ${blog.indexedAt ? "indexed" : "unindexed"}`}
                              >
                                {blog.indexedAt ? (
                                  <>✅ Indexed</>
                                ) : (
                                  <>⏳ Unindexed</>
                                )}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </td>

                    {/* Views */}
                    <td>
                      <span style={{ fontSize: "13px" }}>
                        {(blog.views || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Comments */}
                    <td>
                      <Link
                        href={`/dashboard/blogs/comments?article=${blog.slug}`}
                        style={{
                          color: "var(--accent-teal)",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        {blog.commentsCount || 0}
                      </Link>
                    </td>

                    {/* Date */}
                    <td
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {new Date(
                        blog.publishedAt || blog.createdAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* SEO Score */}
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: scoreColor,
                          backgroundColor: "var(--bg-main)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          border: `1px solid ${scoreColor}`,
                        }}
                      >
                        <Sparkles size={12} /> {seoAnalysis.score}%
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-row">
                        {blog.status === "scheduled" && (
                          <button
                            className="btn btn-xs btn-secondary"
                            style={{
                              color: "var(--accent-teal)",
                              fontWeight: 600,
                            }}
                            title="Publish Now"
                          >
                            <Zap size={12} /> Publish Now
                          </button>
                        )}
                        {blog.status === "published" && (
                          <>
                            <button
                              className="btn btn-xs btn-secondary"
                              title={
                                blog.indexedAt
                                  ? "Re-Index on Google"
                                  : "Submit to Google Indexing"
                              }
                            >
                              <RotateCcw size={12} />{" "}
                              {blog.indexedAt ? "Re-Index" : "Index"}
                            </button>
                            <a
                              href={`/blog/${blog.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-xs btn-secondary"
                            >
                              View <ExternalLink size={11} />
                            </a>
                          </>
                        )}
                        <Link
                          href={`/dashboard/blogs/${blog.slug}`}
                          className="btn btn-xs btn-secondary"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-xs btn-outline-danger"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <div className="empty-icon">📄</div>
                    <h3>No articles found</h3>
                    <p>
                      {query
                        ? "Try adjusting your search query or filters."
                        : "Create your first article to get started."}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="page-info">
            Showing {(page - 1) * perPage + 1}–
            {Math.min(page * perPage, filtered.length)} of {filtered.length}{" "}
            articles
          </div>
          <div className="page-btns">
            {page > 1 && (
              <button
                className="page-btn"
                onClick={() => setPage(page - 1)}
              >
                ← Prev
              </button>
            )}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`page-btn ${page === pageNum ? "active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            {page < totalPages && (
              <button
                className="page-btn"
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

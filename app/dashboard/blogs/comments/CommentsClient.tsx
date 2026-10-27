"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Trash2, ExternalLink, MessageSquare } from "lucide-react";
import { Comment } from "../../../../lib/types";

const DEMO_COMMENTS: Comment[] = [
  {
    id: "cm_1",
    articleSlug: "irdai-3-year-incontestability-rule-explained",
    articleTitle: "Section 45 Explained: Why Life Insurers Cannot Reject Claims After 3 Years",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    comment: "This is incredibly helpful! My father's insurance claim was rejected after 2.5 years and we didn't know about Section 45. Can you elaborate on the appeal process?",
    approved: false,
    createdAt: "2026-10-26T14:32:00Z",
  },
  {
    id: "cm_2",
    articleSlug: "irdai-3-year-incontestability-rule-explained",
    articleTitle: "Section 45 Explained: Why Life Insurers Cannot Reject Claims After 3 Years",
    name: "Rakesh Gupta",
    email: "rakesh.g@outlook.com",
    comment: "Very well researched article. The IRDAI circular references make this credible. Would love to see a follow-up on term insurance claim rejection patterns.",
    approved: true,
    createdAt: "2026-10-25T09:15:00Z",
  },
  {
    id: "cm_3",
    articleSlug: "rera-builder-delay-compensation-rights",
    articleTitle: "Your Rights Under RERA: Builder Delay Compensation Explained",
    name: "Anjali Verma",
    email: "anjali.v@yahoo.com",
    comment: "Our builder delayed by 3 years and we got compensated after filing through RERA. This article should be mandatory reading for homebuyers.",
    approved: true,
    createdAt: "2026-10-24T16:45:00Z",
  },
  {
    id: "cm_4",
    articleSlug: "rbi-digital-lending-guidelines-2024",
    articleTitle: "RBI Digital Lending Guidelines: What Borrowers Must Know",
    name: "Deepak M",
    email: "deepak.m@proton.me",
    comment: "The information about predatory lending apps is spot on. Several of my colleagues were affected. Please cover UPI fraud patterns next.",
    approved: false,
    createdAt: "2026-10-27T11:20:00Z",
  },
  {
    id: "cm_5",
    articleSlug: "irdai-3-year-incontestability-rule-explained",
    articleTitle: "Section 45 Explained: Why Life Insurers Cannot Reject Claims After 3 Years",
    name: "Suspicious Bot",
    email: "test@spam.net",
    comment: "Buy cheap insurance at www.totallynotascam.com!! Best rates guaranteed!!!",
    approved: false,
    createdAt: "2026-10-27T08:00:00Z",
  },
];

type TabType = "pending" | "approved" | "all";

export function CommentsClient() {
  const [comments, setComments] = useState<Comment[]>(DEMO_COMMENTS);
  const [tab, setTab] = useState<TabType>("pending");

  const counts = useMemo(() => ({
    pending: comments.filter((c) => !c.approved).length,
    approved: comments.filter((c) => c.approved).length,
    all: comments.length,
  }), [comments]);

  const filtered = useMemo(() => {
    if (tab === "pending") return comments.filter((c) => !c.approved);
    if (tab === "approved") return comments.filter((c) => c.approved);
    return comments;
  }, [comments, tab]);

  const handleApprove = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approved: true } : c))
    );
  };

  const handleUnapprove = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, approved: false } : c))
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete comment by "${name}"? This cannot be undone.`)) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.4px", marginBottom: "4px" }}>
          Comments Moderation
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          Approve, reject, or delete user comments across all published articles.
        </p>
      </div>

      {/* Tab Navigation (Sticky Pinned) */}
      <div className="status-tabs sticky-filter-bar" style={{ padding: "10px 16px" }}>
        <button
          className={`tab-btn ${tab === "pending" ? "active" : ""}`}
          onClick={() => setTab("pending")}
        >
          Pending Moderation ({counts.pending})
        </button>
        <button
          className={`tab-btn ${tab === "approved" ? "active" : ""}`}
          onClick={() => setTab("approved")}
          style={tab !== "approved" ? { color: "#34d399" } : undefined}
        >
          Approved ({counts.approved})
        </button>
        <button
          className={`tab-btn ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          All Comments ({counts.all})
        </button>
      </div>

      {/* Comments Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-container" style={{ border: "none" }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Author</th>
                <th style={{ width: "40%" }}>Comment</th>
                <th>Article</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((comm) => (
                  <tr key={comm.id}>
                    {/* Author */}
                    <td>
                      <div style={{ fontWeight: 700, fontSize: "13px" }}>
                        {comm.name}
                      </div>
                      {comm.email && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                          }}
                        >
                          {comm.email}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginTop: "4px",
                        }}
                      >
                        {new Date(comm.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Comment Text */}
                    <td>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: "1.6",
                          color: "var(--text-primary)",
                        }}
                      >
                        {comm.comment}
                      </div>
                    </td>

                    {/* Article Link */}
                    <td>
                      <a
                        href={`/articles/${comm.articleSlug}#comments`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: "13px",
                          color: "var(--accent-teal)",
                          fontWeight: 600,
                        }}
                      >
                        {(comm.articleTitle || comm.articleSlug).substring(0, 40)}...{" "}
                        <ExternalLink size={10} />
                      </a>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span
                        className={`badge ${
                          comm.approved ? "badge-approved" : "badge-pending"
                        }`}
                      >
                        {comm.approved ? "Approved" : "Pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: "right" }}>
                      <div className="action-row">
                        {!comm.approved ? (
                          <button
                            className="btn btn-xs btn-primary"
                            onClick={() => handleApprove(comm.id)}
                          >
                            <CheckCircle2 size={12} /> Approve
                          </button>
                        ) : (
                          <button
                            className="btn btn-xs btn-secondary"
                            onClick={() => handleUnapprove(comm.id)}
                          >
                            <XCircle size={12} /> Unapprove
                          </button>
                        )}
                        <button
                          className="btn btn-xs btn-outline-danger"
                          onClick={() => handleDelete(comm.id, comm.name)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <MessageSquare size={40} style={{ opacity: 0.2, marginBottom: "12px" }} />
                      <h3>No comments found</h3>
                      <p>No comments in this view.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

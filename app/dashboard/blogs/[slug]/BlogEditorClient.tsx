"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  Plus,
  X,
  Save,
  Calendar,
  Eye,
  Image,
  Link2,
  Sparkles,
} from "lucide-react";
import { BlogPost, ContentStatus, SEOMetadata, FAQItem } from "../../../../lib/types";
import { getCurrentUser } from "../../../../lib/auth";
import { SeoInspector } from "../../../../components/SeoInspector";
import { analyzeSEO } from "../../../../lib/seo-engine";

interface Props {
  initialPost: BlogPost | null;
  slug: string;
}

const DEMO_CATEGORIES = [
  { id: "cat_1", name: "Insurance & IRDAI Compliance", slug: "insurance-irdai-compliance" },
  { id: "cat_2", name: "Real Estate & RERA", slug: "real-estate-rera" },
  { id: "cat_3", name: "Healthcare & NABH", slug: "healthcare-nabh" },
  { id: "cat_4", name: "Banking & RBI", slug: "banking-rbi" },
  { id: "cat_5", name: "Fraud Detection & Consumer Alerts", slug: "fraud-detection-consumer-alerts" },
  { id: "cat_6", name: "Investments & SEBI", slug: "investments-sebi" },
];

const DEMO_RELATED_ARTICLES = [
  { slug: "irdai-3-year-incontestability-rule-explained", title: "Section 45 Explained: Why Life Insurers Cannot Reject Claims After 3 Years" },
  { slug: "rera-builder-delay-compensation-rights", title: "Your Rights Under RERA: Builder Delay Compensation Explained" },
  { slug: "rbi-digital-lending-guidelines-2024", title: "RBI Digital Lending Guidelines: What Borrowers Must Know" },
  { slug: "nabh-hospital-accreditation-guide", title: "NABH Hospital Accreditation: What Patients Should Know" },
  { slug: "sebi-mutual-fund-regulations-explained", title: "SEBI Mutual Fund Regulations: Investor Protection Guide" },
];

export function BlogEditorClient({ initialPost, slug }: Props) {
  const router = useRouter();
  const [currentUser] = useState(() => getCurrentUser());
  const isNew = slug === "new";

  const [post, setPost] = useState<BlogPost>(() => {
    if (initialPost) return initialPost;
    return {
      slug: "new-regulatory-guide",
      title: "New Consumer Regulatory Guide & Analysis",
      sector: "insurance",
      readTime: "5 min read",
      summary: "Clear executive summary detailing regulatory safeguards, consumer rights, and circular precedents.",
      directAnswer: "",
      body: "### 1. Regulatory Context\n\nEnter detailed analysis here with citations from statutory records.\n\n### 2. Key Actionable Safeguards\n- Point A\n- Point B\n- Point C",
      status: "draft",
      author: "Research Desk",
      categoryId: "",
      featuredImage: "",
      faqData: [],
      relatedSlugs: [],
      views: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: "",
      seo: {
        title: "New Regulatory Guide | TrustValue Research",
        description: "Clear executive summary detailing regulatory safeguards and circular precedents.",
        focusKeyword: "Regulatory",
        keywords: ["Regulatory", "TrustValue", "Consumer Protection"],
        schemaType: "Article",
      },
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const handleFieldChange = (key: keyof BlogPost, val: any) => {
    setPost({ ...post, [key]: val });
  };

  const handleSeoChange = (key: keyof SEOMetadata, val: any) => {
    setPost({
      ...post,
      seo: { ...post.seo, [key]: val },
    });
  };

  // AI Agent Integrations
  const handleAiAction = async (task: "faq_generator" | "direct_answer" | "seo_optimizer" | "fact_check") => {
    setAiLoading(true);
    setAiNotice(null);
    try {
      const res = await fetch("/api/v1/agents/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "agency-orchestrator",
          taskType: task,
          inputContent: post.body,
          context: post.title,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        if (task === "faq_generator" && json.data.faqs) {
          const formatted = json.data.faqs.map((f: any) => ({ q: f.question, a: f.answer }));
          handleFieldChange("faqData", [...(post.faqData || []), ...formatted]);
          setAiNotice("✨ Generated 3 Schema.org FAQ items into the repeater below!");
        } else if (task === "direct_answer" && json.data.directAnswer) {
          handleFieldChange("directAnswer", json.data.directAnswer);
          setAiNotice("⚡ Direct Quick Answer synthesized for Google Featured Snippets!");
        } else if (task === "seo_optimizer") {
          handleSeoChange("focusKeyword", json.data.focusKeyword || post.seo.focusKeyword);
          handleSeoChange("description", json.data.suggestedDescription || post.seo.description);
          handleSeoChange("keywords", json.data.keywords || post.seo.keywords);
          setAiNotice("🔍 Focus Keyword & Meta Description updated with high-CTR signals!");
        } else if (task === "fact_check") {
          setAiNotice(`🛡️ ${json.data.verdict} (Confidence: ${json.data.confidence}%). Flags: ${json.data.flags?.join("; ")}`);
        }
      }
    } catch {
      setAiNotice("Failed to contact Agency Agent");
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiNotice(null), 6000);
    }
  };

  // FAQ Handlers
  const addFaq = () => {
    handleFieldChange("faqData", [...(post.faqData || []), { q: "", a: "" }]);
  };

  const updateFaq = (idx: number, field: keyof FAQItem, val: string) => {
    const updated = [...(post.faqData || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    handleFieldChange("faqData", updated);
  };

  const removeFaq = (idx: number) => {
    handleFieldChange(
      "faqData",
      (post.faqData || []).filter((_, i) => i !== idx)
    );
  };

  // Related Articles
  const toggleRelated = (relSlug: string) => {
    const current = post.relatedSlugs || [];
    if (current.includes(relSlug)) {
      handleFieldChange("relatedSlugs", current.filter((s) => s !== relSlug));
    } else {
      handleFieldChange("relatedSlugs", [...current, relSlug]);
    }
  };

  const handleSave = async (targetStatus?: ContentStatus) => {
    setIsSaving(true);
    const updatedPost: BlogPost = {
      ...post,
      status: targetStatus || post.status,
      author: post.author || currentUser.name,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isNew) {
        await fetch("/api/v1/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPost),
        });
      } else {
        await fetch(`/api/v1/blogs/${updatedPost.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPost),
        });
      }
    } catch {
      // ignore
    }

    setPost(updatedPost);

    setTimeout(() => {
      setIsSaving(false);
      if (isNew) {
        router.push(`/dashboard/blogs/${updatedPost.slug}`);
      }
    }, 600);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete article "${post.title}"?`)) {
      try {
        await fetch(`/api/v1/blogs/${post.slug}`, { method: "DELETE" });
      } catch {
        // ignore
      }
      router.push("/dashboard/blogs");
    }
  };

  const wordCount = post.body.trim().split(/\s+/).filter(Boolean).length;
  const seoAnalysis = analyzeSEO(post.seo, post.body);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/dashboard/blogs" className="btn btn-secondary" style={{ padding: "8px 12px" }}>
            <ArrowLeft size={16} /> All Articles
          </Link>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.4px" }}>
              {isNew ? "Draft New Research Article" : "Editorial Writing Desk"}
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {wordCount} words &bull; Estimated read time: {Math.ceil(wordCount / 180)} min
            </p>
          </div>
        </div>

        {!isNew && currentUser.role === "superadmin" && (
          <button onClick={handleDelete} className="btn btn-outline-danger" style={{ padding: "8px 14px", fontSize: "13px" }}>
            <Trash2 size={14} /> Delete This Article
          </button>
        )}
      </div>

      {/* Main Editor Layout */}
      <div className="editor-layout">
        {/* Left: Content Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Agency AI Assistant Bar */}
          <div style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(30, 41, 59, 0.7))",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "#c084fc" }}>
                <Sparkles size={16} /> Agency Agents Editorial Copilot (279 AI Agents)
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Autonomous Research &amp; Fact Checking
              </span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button
                type="button"
                onClick={() => handleAiAction("faq_generator")}
                disabled={aiLoading}
                className="btn btn-secondary"
                style={{ fontSize: "12px", padding: "6px 12px", background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.4)", color: "#e2e8f0" }}
              >
                ✨ Auto-Generate FAQs
              </button>
              <button
                type="button"
                onClick={() => handleAiAction("direct_answer")}
                disabled={aiLoading}
                className="btn btn-secondary"
                style={{ fontSize: "12px", padding: "6px 12px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", color: "#e2e8f0" }}
              >
                ⚡ Synthesize Direct Answer
              </button>
              <button
                type="button"
                onClick={() => handleAiAction("seo_optimizer")}
                disabled={aiLoading}
                className="btn btn-secondary"
                style={{ fontSize: "12px", padding: "6px 12px", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#e2e8f0" }}
              >
                🔍 Optimize SEO &amp; Keywords
              </button>
              <button
                type="button"
                onClick={() => handleAiAction("fact_check")}
                disabled={aiLoading}
                className="btn btn-secondary"
                style={{ fontSize: "12px", padding: "6px 12px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", color: "#e2e8f0" }}
              >
                🛡️ Statutory Fact Check
              </button>
            </div>

            {aiNotice && (
              <div style={{
                fontSize: "12px",
                padding: "8px 12px",
                borderRadius: "6px",
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(139, 92, 246, 0.4)",
                color: "#cbd5e1"
              }}>
                {aiNotice}
              </div>
            )}
          </div>

          {/* Article Info Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Question & Article Content</h3>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Question / Article Title *</label>
              <input
                type="text"
                value={post.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="input-field"
                style={{ fontSize: "16px", fontWeight: 600 }}
                placeholder="e.g. Will Section 45 protect my claim after 3 years?"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>URL Slug (SEO Permalinks)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>/articles/</span>
                  <input
                    type="text"
                    value={post.slug}
                    disabled={!isNew}
                    onChange={(e) => handleFieldChange("slug", e.target.value)}
                    className="input-field"
                    style={{ fontFamily: "monospace" }}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Audited Sector</label>
                <select
                  value={post.sector}
                  onChange={(e) => handleFieldChange("sector", e.target.value)}
                  className="input-field"
                >
                  <option value="insurance">Insurance</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="banking">Banking</option>
                  <option value="investments">Investments</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Direct Quick Answer (Featured at the top of the article)</label>
              <textarea
                rows={2}
                value={post.directAnswer || ""}
                onChange={(e) => handleFieldChange("directAnswer", e.target.value)}
                className="input-field"
                placeholder="Provide a concise 1-2 sentence direct answer for visitors & featured snippets..."
                style={{ fontFamily: "inherit" }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Full In-Depth Content & Analysis (HTML supported) *</label>
              <textarea
                rows={18}
                value={post.body}
                onChange={(e) => handleFieldChange("body", e.target.value)}
                className="input-field"
                placeholder="<p>Detailed technical breakdown, specifications, and regulatory analysis...</p>"
                style={{
                  fontFamily: "monospace",
                  lineHeight: "1.6",
                  fontSize: "13px",
                  resize: "vertical",
                }}
              />
              <small>
                HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;table&gt;, &lt;strong&gt; are fully supported.
              </small>
            </div>
          </div>

          {/* FAQ Repeater (Schema.org FAQPage) */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Interactive FAQs (Schema.org FAQPage)</h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  These questions are rendered as accordions and automatically injected into Google FAQPage JSON-LD.
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={addFaq}>
                <Plus size={13} /> Add Question
              </button>
            </div>
            <div>
              {(post.faqData || []).map((faq, idx) => (
                <div key={idx} className="faq-repeater-item">
                  <button
                    type="button"
                    className="faq-remove-btn"
                    onClick={() => removeFaq(idx)}
                    title="Remove FAQ"
                  >
                    ✕
                  </button>
                  <div className="form-group" style={{ marginBottom: "8px" }}>
                    <label style={{ fontWeight: 600, fontSize: "12px" }}>Question</label>
                    <input
                      type="text"
                      className="input-field"
                      value={faq.q}
                      onChange={(e) => updateFaq(idx, "q", e.target.value)}
                      placeholder="e.g. Can insurers reject a claim after 3 years?"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontWeight: 600, fontSize: "12px" }}>Answer</label>
                    <textarea
                      className="input-field"
                      rows={2}
                      value={faq.a}
                      onChange={(e) => updateFaq(idx, "a", e.target.value)}
                      placeholder="Provide a clear, concise answer..."
                      style={{ fontFamily: "inherit" }}
                    />
                  </div>
                </div>
              ))}
              {(!post.faqData || post.faqData.length === 0) && (
                <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                  No FAQs added yet. Click "+ Add Question" to create Schema.org FAQ entries.
                </p>
              )}
            </div>
          </div>

          {/* SEO & SERP Meta Box */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Google Search Snippet Preview</h3>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>SEO Meta Title (recommended 50-60 chars)</label>
              <input
                type="text"
                value={post.seo.title}
                onChange={(e) => handleSeoChange("title", e.target.value)}
                className="input-field"
                placeholder="Will iPhone 17 Support 120Hz? Complete Analysis"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>SEO Meta Description (recommended 140-160 chars)</label>
              <textarea
                rows={2}
                value={post.seo.description}
                onChange={(e) => handleSeoChange("description", e.target.value)}
                className="input-field"
                placeholder="Discover verified details regarding 120Hz display tech..."
                style={{ fontFamily: "inherit" }}
              />
            </div>

            {/* Live SERP Preview */}
            <div className="serp-preview">
              <div className="serp-url">
                trustvalue.ai/articles/{post.slug || "sample-slug"}
              </div>
              <div className="serp-title">
                {post.seo.title || post.title || "Article Title Preview"}
              </div>
              <div className="serp-desc">
                {post.seo.description || "Detailed answers and analysis from TrustValue research..."}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Publishing & Options Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Publishing Options Card */}
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Publishing Options</h3>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Status</label>
              <select
                value={post.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                className="input-field"
              >
                <option value="published">Published (Live + Cached)</option>
                <option value="scheduled">Scheduled (Automated Drip Queue)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="in_review">In Review</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Publish Date & Time</label>
              <input
                type="text"
                value={post.publishedAt || ""}
                onChange={(e) => handleFieldChange("publishedAt", e.target.value)}
                className="input-field"
                placeholder="YYYY-MM-DD HH:MM:SS"
              />
              <small>
                For scheduled posts, this is when the article will automatically go live and ping Google Search Console.
              </small>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Topic Category</label>
              <select
                value={post.categoryId || ""}
                onChange={(e) => handleFieldChange("categoryId", e.target.value)}
                className="input-field"
              >
                <option value="">-- Select Category --</option>
                {DEMO_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Featured Image URL (WebP)</label>
              <input
                type="text"
                value={post.featuredImage || ""}
                onChange={(e) => handleFieldChange("featuredImage", e.target.value)}
                className="input-field"
                placeholder="https://.../image.webp"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Author Attribution</label>
                <input
                  type="text"
                  value={post.author}
                  onChange={(e) => handleFieldChange("author", e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Focus Keyword</label>
                <input
                  type="text"
                  value={post.seo.focusKeyword || ""}
                  onChange={(e) => handleSeoChange("focusKeyword", e.target.value)}
                  placeholder="e.g. Section 45"
                  className="input-field"
                />
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", margin: "8px 0" }} />

            {/* Save Button */}
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px", fontWeight: 600 }}
              onClick={() => handleSave()}
              disabled={isSaving}
            >
              {isSaving ? (
                <>⏳ Saving...</>
              ) : (
                <><Save size={15} /> Save & Sync Cache</>
              )}
            </button>

            {/* Quick Status Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              {post.status !== "draft" && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleSave("draft")}
                >
                  Save as Draft
                </button>
              )}
              {post.status !== "published" && (
                <button
                  className="btn btn-success btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleSave("published")}
                >
                  Publish Now
                </button>
              )}
            </div>

            {!isNew && currentUser.role === "superadmin" && (
              <button
                onClick={handleDelete}
                className="btn btn-outline-danger"
                style={{ width: "100%", padding: "10px", fontWeight: 600 }}
              >
                <Trash2 size={14} /> Delete This Article
              </button>
            )}
          </div>

          {/* SERP Inspector */}
          <SeoInspector
            metadata={post.seo}
            slug={`blog/${post.slug}`}
            bodyText={post.body}
          />

          {/* Related Articles Picker */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>
                <Link2 size={15} /> Internal Linking (Related Q&As)
              </h3>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
              Select 3–5 related questions to link at the bottom and sidebar:
            </p>
            <div className="related-picker">
              {DEMO_RELATED_ARTICLES.filter((a) => a.slug !== post.slug).map((article) => (
                <label key={article.slug}>
                  <input
                    type="checkbox"
                    checked={(post.relatedSlugs || []).includes(article.slug)}
                    onChange={() => toggleRelated(article.slug)}
                    style={{ marginTop: "2px" }}
                  />
                  <span style={{ fontSize: "13px" }}>{article.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

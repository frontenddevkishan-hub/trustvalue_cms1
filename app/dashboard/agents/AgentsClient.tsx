"use client";

import { useState } from "react";
import {
  Bot,
  Sparkles,
  Search,
  CheckCircle2,
  Send,
  HelpCircle,
  FileText,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  Code,
  Compass,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface AgentItem {
  id: string;
  name: string;
  division: "Engineering" | "Research" | "Marketing" | "Design" | "Specialized" | "Strategy";
  role: string;
  mission: string;
  file: string;
  tags: string[];
}

const FEATURED_AGENTS: AgentItem[] = [
  {
    id: "engineering-ai-engineer",
    name: "AI & Machine Learning Engineer",
    division: "Engineering",
    role: "Trust score modeling, sentiment evaluation & review fraud detection",
    mission: "Calculates mathematical trust scores, detects review clustering anomalies, and weights statutory reputation.",
    file: "brain/ai research/agency-agents/engineering/engineering-ai-engineer.md",
    tags: ["TrustScore", "Fraud Detection", "Sentiment Analysis", "ML"],
  },
  {
    id: "engineering-search-relevance-engineer",
    name: "Search Relevance & SERP Engineer",
    division: "Engineering",
    role: "Google BM25 search ranking, direct answer extraction & SERP CTR",
    mission: "Optimizes content structure for Google Featured Snippets, AI Overviews, and maximum search engine discoverability.",
    file: "brain/ai research/agency-agents/engineering/engineering-search-relevance-engineer.md",
    tags: ["BM25", "SERP CTR", "Featured Snippet", "SEO"],
  },
  {
    id: "marketing-content-marketer",
    name: "Regulatory Content Marketer",
    division: "Marketing",
    role: "Consumer engagement, viral hooks, and high-readability research narratives",
    mission: "Transforms dry regulatory circulars and legal acts into accessible, highly engaging consumer guidance playbooks.",
    file: "brain/ai research/agency-agents/marketing/marketing-content-marketer.md",
    tags: ["Content Hooks", "Readability", "Consumer Trust", "Editorial"],
  },
  {
    id: "academic-statistician",
    name: "Quantitative Claim & Statistics Auditor",
    division: "Research",
    role: "Confidence intervals, claim settlement ratios & statistical honesty",
    mission: "Audits brand marketing claims, validates sample sizes, and eliminates deceptive statistical representations.",
    file: "brain/ai research/agency-agents/academic/academic-statistician.md",
    tags: ["Claims Ratios", "Confidence Intervals", "Sampling", "Data Audit"],
  },
  {
    id: "specialized-fact-checker",
    name: "Statutory & Circular Fact-Checker",
    division: "Specialized",
    role: "IRDAI, MahaRERA, RBI, and SEBI circular verification",
    mission: "Cross-references claims and policies against actual gazette notifications and official regulatory master circulars.",
    file: "brain/ai research/agency-agents/specialized/specialized-fact-checker.md",
    tags: ["IRDAI", "MahaRERA", "Statutory Compliance", "Gazette"],
  },
  {
    id: "design-ui-finish-gate-reviewer",
    name: "UI Finish-Gate & Accessibility Reviewer",
    division: "Design",
    role: "Design contract adherence, WCAG 2.1 AA accessibility, and micro-interactions",
    mission: "Validates visual hierarchy, color contrast ratios, screen reader accessibility, and design elegance before shipping.",
    file: "brain/ai research/agency-agents/design/design-ui-finish-gate-reviewer.md",
    tags: ["Design Finish", "Accessibility", "WCAG", "UX Audit"],
  },
];

export function AgentsClient() {
  const [selectedDivision, setSelectedDivision] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeAgent, setActiveAgent] = useState<AgentItem>(FEATURED_AGENTS[0]);
  const [promptText, setPromptText] = useState<string>("");
  const [consulting, setConsulting] = useState<boolean>(false);
  const [consultationResult, setConsultationResult] = useState<any>(null);

  const divisions = ["All", "Engineering", "Research", "Marketing", "Design", "Specialized"];

  const filteredAgents = FEATURED_AGENTS.filter((a) => {
    const matchDiv = selectedDivision === "All" || a.division === selectedDivision;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q));
    return matchDiv && matchSearch;
  });

  const handleConsult = async (presetPrompt?: string) => {
    const prompt = presetPrompt || promptText;
    if (!prompt.trim()) return;

    setConsulting(true);
    setConsultationResult(null);

    try {
      const res = await fetch("/api/v1/agents/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: activeAgent.id,
          taskType: prompt.toLowerCase().includes("faq")
            ? "faq_generator"
            : prompt.toLowerCase().includes("direct answer")
            ? "direct_answer"
            : prompt.toLowerCase().includes("fact")
            ? "fact_check"
            : prompt.toLowerCase().includes("seo")
            ? "seo_optimizer"
            : "custom",
          inputContent: prompt,
          context: "TrustValue Regulatory Research",
        }),
      });

      const data = await res.json();
      setConsultationResult(data);
    } catch (e: any) {
      setConsultationResult({ error: e.message || "Consultation failed" });
    } finally {
      setConsulting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(15,23,42,0.85) 100%)",
        border: "1px solid rgba(139,92,246,0.3)",
        borderRadius: "16px",
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ maxWidth: "700px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "#c084fc",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "8px",
          }}>
            <Sparkles size={14} /> 279 Agency Agents Intelligence Network
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "8px", color: "#f8fafc" }}>
            Agency Specialist Consultation Terminal
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            Harness specialist autonomous agents from <code style={{ color: "#38bdf8" }}>brain/ai research/agency-agents/</code> directly within your editorial workflow to mathematically verify claims, generate structured FAQs, and optimize SEO relevance.
          </p>
        </div>

        <div style={{
          padding: "16px 20px",
          borderRadius: "12px",
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(139,92,246,0.25)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "26px", fontWeight: 800, color: "#c084fc" }}>279</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
            Specialist Agents Active
          </div>
        </div>
      </div>

      {/* Main 2-Column Console */}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px" }}>
        {/* Left: Agents List & Filter */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Search & Division Pills */}
          <div className="card" style={{ padding: "16px" }}>
            <div style={{ position: "relative", marginBottom: "14px" }}>
              <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                type="text"
                placeholder="Search 279 agents by name, role or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 36px",
                  borderRadius: "8px",
                  background: "var(--bg-main)",
                  border: "1px solid var(--border-subtle)",
                  color: "#f8fafc",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {divisions.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDivision(d)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: selectedDivision === d ? "#7c3aed" : "var(--bg-main)",
                    color: selectedDivision === d ? "#ffffff" : "var(--text-secondary)",
                    border: selectedDivision === d ? "1px solid #8b5cf6" : "1px solid var(--border-subtle)",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Agents List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "600px", overflowY: "auto" }}>
            {filteredAgents.map((agent) => {
              const isSelected = activeAgent.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => {
                    setActiveAgent(agent);
                    setConsultationResult(null);
                  }}
                  style={{
                    padding: "16px",
                    borderRadius: "10px",
                    background: isSelected ? "rgba(124, 58, 237, 0.12)" : "var(--bg-surface)",
                    border: isSelected ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(139, 92, 246, 0.2)",
                      color: "#c084fc",
                    }}>
                      {agent.division}
                    </span>
                    <Bot size={16} color={isSelected ? "#c084fc" : "#64748b"} />
                  </div>

                  <strong style={{ display: "block", fontSize: "14px", color: isSelected ? "#f8fafc" : "#e2e8f0", marginBottom: "4px" }}>
                    {agent.name}
                  </strong>
                  <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {agent.role}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {agent.tags.map((t) => (
                      <span key={t} style={{ fontSize: "10px", padding: "1px 5px", borderRadius: "3px", background: "var(--bg-main)", color: "#94a3b8" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Agent Terminal & Consultation Console */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Agent Spec Header Card */}
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff"
                }}>
                  <Bot size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "#f8fafc" }}>
                    {activeAgent.name}
                  </h3>
                  <div style={{ fontSize: "12px", color: "#c084fc", marginTop: "2px" }}>
                    Division: {activeAgent.division} &bull; <code style={{ color: "#94a3b8" }}>{activeAgent.file}</code>
                  </div>
                </div>
              </div>

              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.1)",
                padding: "4px 10px",
                borderRadius: "999px",
                fontWeight: 600
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }}></span>
                Ready for Dispatch
              </span>
            </div>

            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 16px 0" }}>
              {activeAgent.mission}
            </p>

            {/* Quick Action Presets */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                Quick Prompt Accelerators:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <button
                  onClick={() => handleConsult("Generate 3 Schema.org FAQ items for Life Insurance Section 45")}
                  className="btn btn-secondary"
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  ✨ Auto-Generate Schema FAQs
                </button>
                <button
                  onClick={() => handleConsult("Extract concise Direct Answer for Google Featured Snippet under 40 words")}
                  className="btn btn-secondary"
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  ⚡ Extract Direct Answer
                </button>
                <button
                  onClick={() => handleConsult("Fact check IRDAI 36-month incontestability statute and penalty provisions")}
                  className="btn btn-secondary"
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  🛡️ Statutory Fact Check
                </button>
                <button
                  onClick={() => handleConsult("Analyze focus keyword density and Google SERP CTR readiness")}
                  className="btn btn-secondary"
                  style={{ fontSize: "12px", padding: "6px 12px" }}
                >
                  🔍 Optimize SEO & Keywords
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Input Terminal */}
          <div className="card" style={{ padding: "20px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#f8fafc", margin: "0 0 10px 0" }}>
              Custom Consultation Query
            </h4>
            <div style={{ display: "flex", gap: "10px" }}>
              <textarea
                rows={3}
                placeholder={`Ask ${activeAgent.name} to audit, optimize, or generate structured editorial data...`}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  background: "var(--bg-main)",
                  border: "1px solid var(--border-subtle)",
                  color: "#f8fafc",
                  fontSize: "13px",
                  outline: "none",
                  resize: "vertical"
                }}
              />
              <button
                onClick={() => handleConsult()}
                disabled={consulting || !promptText.trim()}
                className="btn btn-primary"
                style={{
                  padding: "0 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: consulting || !promptText.trim() ? 0.6 : 1,
                  cursor: consulting || !promptText.trim() ? "not-allowed" : "pointer"
                }}
              >
                <Send size={16} />
                {consulting ? "Consulting..." : "Run"}
              </button>
            </div>
          </div>

          {/* Consultation Result Display */}
          {consultationResult && (
            <div className="card" style={{
              padding: "24px",
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(139, 92, 246, 0.4)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={18} color="#c084fc" />
                  <h4 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "#f8fafc" }}>
                    Agent Output Ledger: {consultationResult.agentId}
                  </h4>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {consultationResult.timestamp}
                </span>
              </div>

              <pre style={{
                background: "var(--bg-main)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                fontSize: "12px",
                color: "#a7f3d0",
                overflowX: "auto",
                lineHeight: 1.5,
              }}>
                {JSON.stringify(consultationResult.data || consultationResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

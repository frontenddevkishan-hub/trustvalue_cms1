"use client";

import { useState } from "react";
import { ContentStatus, CMSUser } from "../lib/types";
import { hasPermission } from "../lib/auth";
import { Send, CheckCircle, RefreshCw, Save, Clock, AlertCircle } from "lucide-react";

interface PublishBarProps {
  status: ContentStatus;
  currentUser: CMSUser;
  onSaveDraft: () => Promise<void> | void;
  onSubmitReview?: () => Promise<void> | void;
  onPublish: () => Promise<void> | void;
  isSaving?: boolean;
  lastSavedAt?: string;
}

export function PublishBar({
  status,
  currentUser,
  onSaveDraft,
  onSubmitReview,
  onPublish,
  isSaving = false,
  lastSavedAt,
}: PublishBarProps) {
  const canPublish = hasPermission(currentUser.role, "canPublish");
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handlePublishClick = async () => {
    await onPublish();
    setSyncToast("Frontend edge cache revalidation dispatched!");
    setTimeout(() => setSyncToast(null), 4000);
  };

  return (
    <div style={{
      position: "sticky",
      bottom: "20px",
      zIndex: 40,
      backgroundColor: "var(--bg-surface)",
      border: "1px solid var(--border-strong)",
      borderRadius: "12px",
      padding: "14px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
    }}>
      {/* Status Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Current Workflow State:</span>
          <span className={`badge badge-${status}`}>
            {status.replace("_", " ")}
          </span>
        </div>

        {lastSavedAt && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
            <Clock size={13} />
            <span>Last modified: {new Date(lastSavedAt).toLocaleTimeString()}</span>
          </div>
        )}

        {syncToast && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--accent-emerald)",
            backgroundColor: "rgba(16,185,129,0.15)",
            padding: "4px 10px",
            borderRadius: "6px",
          }}>
            <CheckCircle size={14} />
            <span>{syncToast}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          className="btn btn-secondary"
        >
          <Save size={15} />
          {isSaving ? "Saving..." : "Save Draft"}
        </button>

        {!canPublish && onSubmitReview && (
          <button
            onClick={onSubmitReview}
            className="btn btn-primary"
          >
            <Send size={15} />
            Submit for Review
          </button>
        )}

        {canPublish && (
          <button
            onClick={handlePublishClick}
            disabled={isSaving}
            className="btn btn-success"
          >
            <RefreshCw size={15} className={isSaving ? "animate-spin" : ""} />
            Publish &amp; Revalidate Frontend
          </button>
        )}
      </div>
    </div>
  );
}

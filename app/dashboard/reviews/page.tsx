import { EntityScaffoldClient } from "../../../components/EntityScaffoldClient";

export const metadata = {
  title: "Consumer Reviews — TrustValue CMS",
};

const SAMPLE_REVIEWS = [
  { id: "r1", title: "Claim settled under 48 hours for bypass surgery", sector: "insurance", status: "audited", metrics: "Verified Policyholder ID", updatedAt: "2026-04-15" },
  { id: "r2", title: "Delayed possession interest compensated per RERA order", sector: "real-estate", status: "audited", metrics: "Legal Order Attached", updatedAt: "2026-04-11" },
  { id: "r3", title: "Foreclosure charges refunded after ombudsman escalation", sector: "banking", status: "audited", metrics: "Banking Ombudsman Ref #8921", updatedAt: "2026-04-03" },
];

export default function ReviewsPage() {
  return (
    <EntityScaffoldClient
      title="Consumer Reviews & Disputes"
      subtitle="Moderated consumer experiences, verified claim repudiation complaints, and mediation threads."
      entityType="Review"
      items={SAMPLE_REVIEWS}
    />
  );
}

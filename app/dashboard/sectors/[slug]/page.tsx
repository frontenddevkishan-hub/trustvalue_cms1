import { notFound } from "next/navigation";
import { getSectorBySlug } from "../../../../lib/storage";
import { SectorConfig } from "../../../../lib/types";
import { SectorEditorClient } from "./SectorEditorClient";

type Props = { params: Promise<{ slug: string }> };

export default async function SectorEditorPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "new") {
    const blankSector: SectorConfig = {
      slug: "new-sector",
      name: "New Sector",
      icon: "🌐",
      description: "Audited benchmarks, customer grievances, and regulatory compliance ratings.",
      watch: "Verify regulatory licensing numbers and mandatory statutory disclosures.",
      nav: { providers: "Providers", categories: "Categories" },
      labels: {
        provider: "Provider",
        providers: "Providers",
        offering: "Plan",
        offerings: "Plans",
        variant: "Variant",
        levels: ["Segment", "Category"],
      },
      maxCategoryDepth: 2,
      attributes: [
        { key: "regulatory_score", label: "Regulatory Compliance", type: "percent", comparable: true, filterable: true },
        { key: "turnaround_sla", label: "Turnaround SLA", type: "text", comparable: true, filterable: false, unit: "days" },
      ],
      categories: [{ slug: "general", name: "General Category" }],
      seo: {
        title: "New Sector Ratings & Reviews | TrustValue Directory",
        description: "Compare audited providers and consumer trust scores in this sector.",
        focusKeyword: "Sector",
        keywords: ["TrustValue", "Audit", "Consumer Ratings"],
        schemaType: "WebPage",
      },
    };
    return <SectorEditorClient initialSector={blankSector} isNew={true} />;
  }

  const sector = getSectorBySlug(slug);
  if (!sector) notFound();

  return <SectorEditorClient initialSector={sector} isNew={false} />;
}

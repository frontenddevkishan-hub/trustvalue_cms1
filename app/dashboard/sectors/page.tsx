import { listSectors, listProviders, listOfferings } from "../../../lib/storage";
import { SectorsClient } from "./SectorsClient";

export const metadata = {
  title: "Sectors Taxonomy — TrustValue CMS",
};

export default function SectorsPage() {
  const sectors = listSectors();
  const providers = listProviders();
  const offerings = listOfferings();

  // Attach relational metrics to each sector
  const enrichedSectors = sectors.map((s) => {
    const sProviders = providers.filter((p) => p.sectors && s.slug in p.sectors);
    const sOfferings = offerings.filter((o) => o.sector === s.slug);
    const sCategoriesCount = (s.categories || []).length;

    return {
      ...s,
      providersCount: sProviders.length,
      offeringsCount: sOfferings.length,
      categoriesCount: sCategoriesCount,
    };
  });

  return <SectorsClient initialSectors={enrichedSectors} />;
}

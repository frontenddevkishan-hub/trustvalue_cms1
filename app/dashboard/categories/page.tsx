import { listSectorCategories, listSectors } from "../../../lib/storage";
import { SectorCategoriesClient } from "./SectorCategoriesClient";

export const metadata = {
  title: "Sector Categories Taxonomy — TrustValue CMS",
};

export default function CategoriesPage() {
  const categories = listSectorCategories();
  const sectors = listSectors().map((s) => ({
    slug: s.slug,
    name: s.name,
    categories: (s.categories || []).map((c) => ({ slug: c.slug, name: c.name })),
  }));

  return <SectorCategoriesClient initialCategories={categories} availableSectors={sectors} />;
}

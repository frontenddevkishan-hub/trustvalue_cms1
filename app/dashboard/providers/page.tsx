import { listProviders, listOfferings, listSectors } from "../../../lib/storage";
import { ProvidersClient } from "./ProvidersClient";

export const metadata = {
  title: "Providers & Brands — TrustValue CMS",
};

export default function ProvidersPage() {
  const providers = listProviders();
  const offerings = listOfferings();
  const sectors = listSectors().map((s) => ({ slug: s.slug, name: s.name }));

  // Attach offering count to each provider
  const enrichedProviders = providers.map((p) => {
    const pOfferings = offerings.filter((o) => o.provider === p.slug);
    return {
      ...p,
      offeringsCount: pOfferings.length,
      activeSectors: Object.keys(p.sectors || {}),
    };
  });

  return <ProvidersClient initialProviders={enrichedProviders} availableSectors={sectors} />;
}

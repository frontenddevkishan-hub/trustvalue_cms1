import { listOfferings, listProviders, listSectors } from "../../../lib/storage";
import { OfferingsClient } from "./OfferingsClient";

export const metadata = {
  title: "Products & Plans — TrustValue CMS",
};

export default function OfferingsPage() {
  const offerings = listOfferings();
  const providers = listProviders();
  const sectors = listSectors();

  // Attach provider name to offerings
  const enrichedOfferings = offerings.map((o) => {
    const prov = providers.find((p) => p.slug === o.provider);
    return {
      ...o,
      providerName: prov ? prov.name : o.provider,
    };
  });

  const availableSectors = sectors.map((s) => ({
    slug: s.slug,
    name: s.name,
    categories: (s.categories || []).map((c) => ({
      slug: c.slug,
      name: c.name,
      children: (c.children || []).map((ch: any) => ({ slug: `${c.slug}/${ch.slug}`, name: `${c.name} > ${ch.name}` })),
    })),
  }));

  const availableProviders = providers.map((p) => ({
    slug: p.slug,
    name: p.name,
    activeSectors: Object.keys(p.sectors || {}),
  }));

  return (
    <OfferingsClient
      initialOfferings={enrichedOfferings}
      availableSectors={availableSectors}
      availableProviders={availableProviders}
    />
  );
}

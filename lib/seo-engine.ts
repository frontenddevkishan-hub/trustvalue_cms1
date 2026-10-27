import { SEOMetadata, SEOCheckResult } from "./types";

export function analyzeSEO(meta: Partial<SEOMetadata>, bodyText = ""): SEOCheckResult {
  const title = (meta.title || "").trim();
  const desc = (meta.description || "").trim();
  const keyword = (meta.focusKeyword || "").trim().toLowerCase();

  const suggestions: string[] = [];
  let score = 100;

  // Title checks
  let titleStatus: "good" | "warn" | "bad" = "good";
  let titleScore = 25;
  if (title.length === 0) {
    titleStatus = "bad";
    titleScore = 0;
    suggestions.push("Title is required for search engines.");
  } else if (title.length < 30) {
    titleStatus = "warn";
    titleScore = 12;
    suggestions.push(`Title is short (${title.length} chars). Ideal length is 50-60 characters.`);
  } else if (title.length > 65) {
    titleStatus = "warn";
    titleScore = 15;
    suggestions.push(`Title is too long (${title.length} chars) and will truncate on Google results.`);
  }

  // Description checks
  let descStatus: "good" | "warn" | "bad" = "good";
  let descScore = 25;
  if (desc.length === 0) {
    descStatus = "bad";
    descScore = 0;
    suggestions.push("Meta description is missing.");
  } else if (desc.length < 80) {
    descStatus = "warn";
    descScore = 12;
    suggestions.push(`Meta description is short (${desc.length} chars). Target 130-160 characters.`);
  } else if (desc.length > 165) {
    descStatus = "warn";
    descScore = 18;
    suggestions.push(`Meta description is ${desc.length} chars. Snippet may be cut off.`);
  }

  // Focus Keyword checks
  let keywordInTitle = false;
  let keywordInDesc = false;
  let keywordDensity = 0;

  if (keyword) {
    keywordInTitle = title.toLowerCase().includes(keyword);
    keywordInDesc = desc.toLowerCase().includes(keyword);

    if (!keywordInTitle) {
      score -= 20;
      suggestions.push(`Focus keyword "${keyword}" is missing from the title.`);
    }
    if (!keywordInDesc) {
      score -= 15;
      suggestions.push(`Focus keyword "${keyword}" is missing from the meta description.`);
    }

    if (bodyText) {
      const words = bodyText.toLowerCase().split(/\s+/).filter(Boolean);
      const matches = words.filter((w) => w.includes(keyword)).length;
      keywordDensity = words.length > 0 ? Number(((matches / words.length) * 100).toFixed(2)) : 0;
      if (keywordDensity < 0.5) {
        suggestions.push(`Keyword density is low (${keywordDensity}%). Consider weaving the focus term more naturally into the body.`);
      }
    }
  } else {
    score -= 25;
    suggestions.push("Specify a focus keyword to evaluate search intent alignment.");
  }

  // Deduct from overall score
  score = Math.max(10, Math.min(100, titleScore + descScore + (keywordInTitle ? 25 : 0) + (keywordInDesc ? 25 : 0)));

  return {
    score,
    titleLength: {
      score: titleScore,
      text: `${title.length} / 60 chars`,
      status: titleStatus,
    },
    descLength: {
      score: descScore,
      text: `${desc.length} / 160 chars`,
      status: descStatus,
    },
    keywordInTitle,
    keywordInDesc,
    keywordDensity,
    suggestions,
  };
}

export function generateSchemaJsonLd(type: string, title: string, description: string, url: string, dateModified: string) {
  if (type === "Article") {
    return {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": title,
      "description": description,
      "url": url,
      "dateModified": dateModified,
      "publisher": {
        "@type": "Organization",
        "name": "TrustValue.ai",
        "url": "https://trustvalue.ai",
      },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
  };
}

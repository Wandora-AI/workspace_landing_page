// Known hosts whose favicon lives on a different domain (or whose own
// favicon is generic), mapped to the domain with the recognizable mark.
const FAVICON_OVERRIDES = {
  "wa.me": "whatsapp.com",
  "go.xero.com": "xero.com",
  "hk-souq-storefront-uat.up.railway.app": "hksouq.com",
  "hk-souq-backend-uat.up.railway.app": "hksouq.com",
};

function parseHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export function getDisplayHost(url) {
  return parseHost(url).replace(/^www\./, "");
}

// Two-level public suffixes we actually encounter (e.g. business.hsbc.com.hk)
const TWO_LEVEL_TLDS = new Set(["com.hk", "co.uk", "com.au", "co.jp", "com.sa"]);

function apexDomain(host) {
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join(".");
  const keep = TWO_LEVEL_TLDS.has(lastTwo) ? 3 : 2;
  return parts.slice(-keep).join(".");
}

function faviconServiceUrl(domain, size) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

/**
 * Ordered favicon URLs to try: Google for the exact host, then the apex
 * domain (deep subdomains like products.hksouq.com often have no icon of
 * their own), then DuckDuckGo's icon service, which covers some domains
 * Google only has tiny icons for (e.g. whatsapp.com).
 */
export function getFaviconCandidates(url, size = 64) {
  const host = parseHost(url);
  if (!host) return [];
  const primary = FAVICON_OVERRIDES[host] || host;
  const apex = apexDomain(primary);
  const domains = primary === apex ? [primary] : [primary, apex];
  return [
    ...domains.map((domain) => faviconServiceUrl(domain, size)),
    `https://icons.duckduckgo.com/ip3/${apex}.ico`,
  ];
}

export function getEnvBadge(application) {
  const name = application.name || "";
  const host = parseHost(application.url || "");
  if (/^\s*uat\b/i.test(name) || /(^|[^a-z])uat([^a-z]|$)/i.test(host)) {
    return "UAT";
  }
  return null;
}

export function filterApplications(applications, query) {
  const tokens = (query || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return applications;
  return applications.filter((app) => {
    const haystack = [app.name, app.description, app.url, app.category]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });
}

export function filterGroupedCategories(groupedCategories, query) {
  const tokens = (query || "").trim();
  if (!tokens) return groupedCategories;
  return groupedCategories
    .map(([category, apps]) => [category, filterApplications(apps, query)])
    .filter(([, apps]) => apps.length > 0);
}

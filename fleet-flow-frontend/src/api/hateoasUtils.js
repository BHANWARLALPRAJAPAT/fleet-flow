/**
 * Utility helpers for Spring Data REST (HATEOAS) responses.
 *
 * Spring Data REST does NOT include `id` in the response body —
 * it's embedded in `_links.self.href`.  These helpers normalize
 * the data so the rest of the frontend can treat it like regular JSON.
 */

/** Extract the numeric ID from a HATEOAS self-link URL. */
export function extractId(entity) {
  const href = entity?._links?.self?.href;
  if (!href) return entity?.id ?? null;
  const id = href.split("/").pop();
  return isNaN(id) ? id : Number(id);
}

/**
 * Walk an `_embedded` array and inject `id` from each item's self-link.
 * Returns a plain array.
 */
export function normalizeList(data, key) {
  const items = data?._embedded?.[key] || [];
  return items.map((item) => ({
    ...item,
    id: extractId(item),
  }));
}

/**
 * Given a HATEOAS entity with association links (e.g. `/maintenanceLogs/1/vehicle`),
 * resolve the linked entity's ID by following the link and extracting its self-href.
 *
 * Returns a map:  parentId → resolvedId
 *
 * Usage:
 *   const map = await resolveAssociationIds(logs, 'vehicle');
 *   // map = { 1: 5, 2: 3, ... }  means log #1 → vehicle #5, etc.
 */
export async function resolveAssociationIds(entities, assocName, apiFn) {
  const map = {};
  const promises = entities.map(async (entity) => {
    const parentId = extractId(entity);
    const href = entity?._links?.[assocName]?.href;
    if (!href || !parentId) return;
    try {
      const res = await apiFn(href);
      map[parentId] = extractId(res);
    } catch {
      // silently skip unresolvable links
    }
  });
  await Promise.all(promises);
  return map;
}

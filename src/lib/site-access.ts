export function isSameSite(
  userSiteId: string | null | undefined,
  resourceSiteId: string | null | undefined
): boolean {
  if (!userSiteId) return false;
  if (!resourceSiteId) return true;
  return userSiteId === resourceSiteId;
}

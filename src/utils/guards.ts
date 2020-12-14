/**
 * Default permission level members have for organization repositories:
 * \* `read` - can pull, but not push to or administer this repository.
 * \* `write` - can pull and push, but not administer this repository.
 * \* `admin` - can pull, push, and administer this repository.
 * \* `none` - no permissions granted by default.
 */
type DefaultRepositoryPermission = 'read' | 'write' | 'admin' | 'none';
export interface AppsCreateInstallationAccessTokenResponse {
  type: string;
  tokenType: string;
  token: string;
  installationId: number;
  permissions: {
    actions: DefaultRepositoryPermission;
    administration: DefaultRepositoryPermission;
    checks: DefaultRepositoryPermission;
    contents: DefaultRepositoryPermission;
    issues: DefaultRepositoryPermission;
    metadata: DefaultRepositoryPermission;
    pull_requests: DefaultRepositoryPermission;
    statuses: DefaultRepositoryPermission;
  };
  createdAt: string;
  expiresAt: string;
  repositorySelection: 'all' | 'selected';
}
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object';
};
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isAppsCreateInstallationAccessTokenResponse = (
  response: unknown
): response is AppsCreateInstallationAccessTokenResponse => {
  return isObject(response) && typeof response?.token === 'string';
};

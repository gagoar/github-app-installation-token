import { AppsCreateInstallationAccessTokenResponseData } from '@octokit/types';

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value && typeof value === 'object';
};
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isAppsCreateInstallationAccessTokenResponseData = (
  response: unknown
): response is AppsCreateInstallationAccessTokenResponseData => {
  return isObject(response) && response.token && typeof response.token === 'string';
};

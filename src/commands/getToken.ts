import ora from 'ora';
import { Octokit } from '@octokit/rest';
import { RequestRequestOptions } from '@octokit/types';
import { createAppAuth } from '@octokit/auth-app';
import NodeRSA from 'node-rsa';

import { SUCCESS_SYMBOL } from '../utils/constants';
import { logger } from '../utils/debug';
import {
  AppsCreateInstallationAccessTokenResponse,
  isAppsCreateInstallationAccessTokenResponse,
  isError,
} from '../utils/guards';
import { readContent } from '../utils/readFile';
import { Command } from 'commander';

const debug = logger('generate');
// just left the async signature to make it easier in the future
interface GetTokenInput {
  appId: number;
  installationId: number;
  privateKey: string;
  baseUrl?: string;
}
type RequestOptions = RequestRequestOptions & Required<{ rawResponse: true }>;
type PlainRequest = RequestRequestOptions & { rawResponse?: false };

export async function getToken(
  { appId, installationId, privateKey }: GetTokenInput,
  requestOptions: RequestOptions
): Promise<AppsCreateInstallationAccessTokenResponse>;
export async function getToken(
  { appId, installationId, privateKey }: GetTokenInput,
  requestOptions?: PlainRequest
): Promise<Pick<AppsCreateInstallationAccessTokenResponse, 'token'>>;
export async function getToken(
  { appId, installationId, privateKey, baseUrl }: GetTokenInput,
  requestOptions?: PlainRequest | RequestOptions
): Promise<Pick<AppsCreateInstallationAccessTokenResponse, 'token'> | AppsCreateInstallationAccessTokenResponse> {
  const key = new NodeRSA(privateKey);

  let request: Request;

  if (requestOptions?.rawResponse) {
    const { rawResponse: _rawResponse, ...rest } = requestOptions;
    request = rest as Request;
  } else {
    request = requestOptions as Request;
  }

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      id: appId,
      privateKey: key.exportKey('pkcs8-private-pem'),
    },
    baseUrl,
    request,
  });

  const response = await octokit.auth({
    type: 'installation',
    installationId,
  });

  if (!isAppsCreateInstallationAccessTokenResponse(response)) {
    debug(`response is missing the token, we got ${response}`);
    throw new Error('Something went wrong on the token retrieval, enable debug to inspect further');
  }

  return requestOptions?.rawResponse ? response : { token: response.token };
}

type Input = Omit<Command & GetTokenInput, 'privateKey'> & {
  privateKeyLocation?: string;
  privateKey?: string;
  rawResponse?: boolean;
};

const isValidInput = (input: Input): boolean => {
  return !!(input.privateKey || input.privateKeyLocation);
};

export const command = async (input: Input): Promise<void> => {
  debug('input:', input);

  const loader = ora('Retrieving token...').start();

  try {
    let privateKey: string;

    const { privateKeyLocation, installationId, appId, rawResponse } = input;

    if (!isValidInput(input)) {
      loader.fail('Input is not valid, either privateKey or privateKeyLocation should be provided');
      process.exit(1);
    }

    if (!input.privateKey && privateKeyLocation) {
      privateKey = await readContent(privateKeyLocation);
    } else {
      privateKey = input.privateKey as string;
    }

    const response = await getToken({ privateKey, installationId, appId }, { rawResponse: true });

    loader.stopAndPersist({
      text: `The token is: ${response.token} and expires ${response.expiresAt}`,
      symbol: SUCCESS_SYMBOL,
    });

    console.log(rawResponse ? response : response.token);
  } catch (e: unknown) {
    if (isError(e)) {
      loader.fail(`We encountered an error: ${e.message}`);
    }
    process.exit(1);
  }
};

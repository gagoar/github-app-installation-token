import ora from 'ora';
import { Octokit } from '@octokit/rest';
import { request as Request } from '@octokit/request';
import { RequestRequestOptions } from '@octokit/types';
import { createAppAuth } from '@octokit/auth-app';

import { SUCCESS_SYMBOL } from '../utils/constants';
import { logger } from '../utils/debug';
import { isAppsCreateInstallationAccessTokenResponseData } from '../utils/guards';
import { readContent } from '../utils/readFile';

const debug = logger('generate');
// just left the async signature to make it easier in the future
interface GetTokenInput {
  appId: number;
  installationId: number;
  privateKey: string;
}

export const getToken = async (
  { appId, installationId, privateKey }: GetTokenInput,
  request: RequestRequestOptions = Request
): Promise<{ token: string }> => {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      id: appId,
      privateKey,
    },
    request,
  });

  const response = await octokit.auth({
    type: 'installation',
    installationId,
  });

  if (!isAppsCreateInstallationAccessTokenResponseData(response)) {
    throw new Error(`Something went wrong on the token retrieval, we got instead: ${JSON.stringify(response)}`);
  }
  const { token } = response;

  return { token };
};

type Input = Omit<GetTokenInput, 'privateKey'> & { privateKeyLocation?: string; privateKey?: string };

const isValidInput = (input: Input): boolean => {
  return !!(input.privateKey || input.privateKeyLocation);
};
export const command = async (input: Input): Promise<void> => {
  debug('input:', input);

  const loader = ora('Retrieving token...').start();

  try {
    let privateKey: string;

    const { privateKeyLocation, installationId, appId } = input;

    if (!isValidInput(input)) {
      loader.fail('Input is not valid, either privateKey or privateKeyLocation should be provided');
      process.exit(1);
    }

    if (!input.privateKey && privateKeyLocation) {
      privateKey = await readContent(privateKeyLocation);
    } else {
      privateKey = input.privateKey as string;
    }

    const { token } = await getToken({ privateKey, installationId, appId });

    loader.stopAndPersist({ text: `The token is: ${token}`, symbol: SUCCESS_SYMBOL });

    console.log(token);
  } catch (e) {
    loader.fail(`We encountered an error: ${e}`);
    process.exit(1);
  }
};

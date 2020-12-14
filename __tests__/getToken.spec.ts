import { mockProcessExit } from 'jest-mock-process';
import { readFileSync } from 'fs';
import { stopAndPersist, fail } from '../__mocks__/ora';
import { mockConsole, unMockConsole } from './helper';
import nock from 'nock';

import { getToken, getTokenCommand } from '../src/index';

const GITHUB_URL = 'https://api.github.com';

describe('getToken', () => {
  let consoleLogMock: jest.Mock;
  beforeAll(() => {
    consoleLogMock = mockConsole('log');
  });

  afterAll(() => {
    unMockConsole('log');
  });
  beforeEach(() => {
    consoleLogMock.mockReset();
    stopAndPersist.mockReset();
    fail.mockReset();
  });

  const APP_ID = 1;
  const KEY_LOCATION = '__mocks__/private.key';

  const PRIVATE_KEY = readFileSync(KEY_LOCATION).toString();

  const getAccessTokensURL = (installationID: number) => `/app/installations/${installationID}/access_tokens`;
  const installationID = 1234;
  // The response object has to be in snake_case because is how the API returns fields, octokit will camelCase every field
  const response = {
    type: 'token',
    token_type: 'installation',
    token: 'secret-installation-token-1234',
    installation_id: 12400204,
    permissions: {
      actions: 'write',
      administration: 'admin',
      checks: 'write',
      contents: 'write',
      issues: 'write',
      metadata: 'read',
      pull_requests: 'write',
      statuses: 'admin',
    },
    created_at: new Date('2020-12-14').toDateString(),
    expires_at: new Date('2020-12-15').toDateString(),
    repository_selection: 'all',
  };
  it('It tries to get the token, but it gets a malformed response from Github', async () => {
    const { token, ...responseWithoutToken } = response;
    const github = nock(GITHUB_URL).post(getAccessTokensURL(installationID)).reply(201, responseWithoutToken);

    try {
      await getToken({
        appId: APP_ID,
        installationId: installationID,
        privateKey: PRIVATE_KEY,
      });
    } catch (e) {
      expect(e.message).toMatchInlineSnapshot(
        '"Something went wrong on the token retrieval, enable debug to inspect further"'
      );
    }

    expect(github.isDone()).toBe(true);
  });
  it('Retrieves the token', async () => {
    const github = nock(GITHUB_URL).post(getAccessTokensURL(123456)).reply(201, response);

    const { token } = await getToken({
      appId: APP_ID,
      installationId: 123456,
      privateKey: PRIVATE_KEY,
    });

    expect(token).toMatchInlineSnapshot('"secret-installation-token-1234"');
    expect(github.isDone()).toBe(true);
  });

  it('fails when invoking the command', async () => {
    const mockExit = mockProcessExit();
    const github = nock(GITHUB_URL)
      .post(getAccessTokensURL(installationID))
      .replyWithError('failed with some server error');

    await getTokenCommand({
      appId: APP_ID,
      installationId: installationID,
      privateKey: PRIVATE_KEY,
    });

    expect(mockExit).toHaveBeenCalled();
    expect(fail).toHaveBeenCalledTimes(1);
    expect(github.isDone()).toBe(true);
  });
  it('invokes getToken via command', async () => {
    const github = nock(GITHUB_URL).post(getAccessTokensURL(installationID)).reply(201, response);

    const mockExit = mockProcessExit();
    await getTokenCommand({
      appId: APP_ID,
      installationId: installationID,
      privateKey: PRIVATE_KEY,
    });

    expect(consoleLogMock.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "secret-installation-token-1234",
        ],
      ]
    `);
    expect(mockExit).not.toHaveBeenCalled();
    expect(stopAndPersist).toHaveBeenCalledTimes(1);
    expect(github.isDone()).toBe(true);
  });

  it('invokes getToken via command providing a private.key location(with raw Response)', async () => {
    const github = nock(GITHUB_URL).post(getAccessTokensURL(installationID)).reply(201, response);

    const mockExit = mockProcessExit();
    await getTokenCommand({
      appId: APP_ID,
      installationId: installationID,
      privateKeyLocation: KEY_LOCATION,
      rawResponse: true,
    });

    expect(mockExit).not.toHaveBeenCalled();
    expect(stopAndPersist).toHaveBeenCalledTimes(1);
    expect(stopAndPersist.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "symbol": "💫",
            "text": "The token is: secret-installation-token-1234 and expires Tue Dec 15 2020",
          },
        ],
      ]
    `);
    expect(github.isDone()).toBe(true);
  });
  it('invokes getToken via command providing a private.key location', async () => {
    const github = nock(GITHUB_URL).post(getAccessTokensURL(installationID)).reply(201, response);

    const mockExit = mockProcessExit();
    await getTokenCommand({
      appId: APP_ID,
      installationId: installationID,
      privateKeyLocation: KEY_LOCATION,
    });

    expect(mockExit).not.toHaveBeenCalled();
    expect(stopAndPersist).toHaveBeenCalledTimes(1);
    expect(stopAndPersist.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "symbol": "💫",
            "text": "The token is: secret-installation-token-1234 and expires Tue Dec 15 2020",
          },
        ],
      ]
    `);
    expect(github.isDone()).toBe(true);
  });

  it('invokes getToken via command not providing a private.key or private.keyLocation', async () => {
    const mockExit = mockProcessExit();
    await getTokenCommand({
      appId: APP_ID,
      installationId: installationID,
    });

    expect(mockExit).toHaveBeenCalled();
    expect(fail.mock.calls[0][0]).toMatchInlineSnapshot(
      '"Input is not valid, either privateKey or privateKeyLocation should be provided"'
    );
  });
});

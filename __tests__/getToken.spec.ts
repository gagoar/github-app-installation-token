import { mockProcessExit } from 'jest-mock-process';
import { readFileSync } from 'fs';
import { stopAndPersist, fail } from '../__mocks__/ora';
import nock from 'nock';

import { getToken, getTokenCommand } from '../';
const GITHUB_URL = 'https://api.github.com';

describe('getToken', () => {
  beforeEach(() => {
    stopAndPersist.mockReset();
    fail.mockReset();
  });

  const APP_ID = 1;
  const KEY_LOCATION = '__mocks__/private.key';

  const PRIVATE_KEY = readFileSync(KEY_LOCATION).toString();

  const getAccessTokensURL = (installationID: number) => `/app/installations/${installationID}/access_tokens`;
  const installationID = 1234;
  const response = {
    token: `secret-installation-token-${installationID}`,
    expires_at: '1970-01-01T01:00:00.000Z',
    permissions: {
      metadata: 'read',
    },
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
    const github = nock(GITHUB_URL).post(getAccessTokensURL(installationID)).reply(201, response);

    const { token } = await getToken({
      appId: APP_ID,
      installationId: installationID,
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

    expect(mockExit).not.toHaveBeenCalled();
    expect(stopAndPersist).toHaveBeenCalledTimes(1);
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
            "text": "The token is: secret-installation-token-1234",
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

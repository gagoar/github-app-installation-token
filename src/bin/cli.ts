#! /usr/bin/env node
import program from 'commander';

import packageJSON from '../../package.json';
import { getTokenCommand } from '../commands';

program.name(packageJSON.name).description(packageJSON.description).version(packageJSON.version);

program
  .requiredOption('--appId <appID>', 'Github App ID')
  .requiredOption(
    '--installationId <installationId>',
    'for more information https://developer.github.com/v3/apps/#list-installations-for-the-authenticated-app'
  )
  .option(
    '--privateKey [privateKey]',
    'for more information https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#generating-a-private-key'
  )
  .option(
    '--privateKeyLocation [path/to/the/private.key]',
    'path to the key location, for more information https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#generating-a-private-key '
  )

  .action(getTokenCommand);

program.parse(process.argv);

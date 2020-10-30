#! /usr/bin/env node
import program from 'commander';

import { greetCommand } from '../commands';
import packageJSON from '../../package.json';

program.name(packageJSON.name).version(packageJSON.version).description(packageJSON.description);

program.command('greet <input>').description('it greets you').action(greetCommand);

program.parse(process.argv);

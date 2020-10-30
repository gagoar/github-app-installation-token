import ora from 'ora';
import { SUCCESS_SYMBOL } from '../utils/constants';
import { logger } from '../utils/debug';

const debug = logger('generate');

interface Greet {
  input: string;
}
// just left the async signature to make it easier in the future
export const greet = async ({ input }: Greet): Promise<string> => `Greetings ${input}`;

export const command = async (input: string): Promise<void> => {
  debug('input:', input);
  const loader = ora('loading...').start();

  try {
    const greeting = await greet({ input });

    loader.stopAndPersist({ text: `we found greetings: ${greeting}`, symbol: SUCCESS_SYMBOL });
  } catch (e) {
    loader.fail(`We encountered an error: ${e}`);
  }
};

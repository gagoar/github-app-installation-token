import { greet } from '../index';

describe('Greet', () => {
  it('should output a greeting', async () => {
    expect(await greet({ input: 'Bob' })).toMatchInlineSnapshot('"Greetings Bob"');
  });
});

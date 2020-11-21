const ORIGINALS = {
  log: global.console.log,
  error: global.console.error,
};

type METHODS = 'log' | 'error';
export const mockConsole = (method: METHODS): jest.Mock => {
  const handler = jest.fn();
  global.console[method] = handler;
  return handler;
};
export const unMockConsole = (method: METHODS): void => {
  global.console[method] = ORIGINALS[method];
};

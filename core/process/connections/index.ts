import type { ConnectionLike } from './createConnection';

export type { ConnectionLike };
export { default as createConnection } from './createConnection';

export const ConnectionRegistry = new Map<string, ConnectionLike>();

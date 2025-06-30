const isDev = import.meta.env ? import.meta.env.DEV : process.env.NODE_ENV !== 'production';

export const log = (...args) => {
  if (isDev) console.log('[LOG]', ...args);
};
export const warn = (...args) => {
  if (isDev) console.warn('[WARN]', ...args);
};
export const error = (...args) => {
  if (isDev) console.error('[ERROR]', ...args);
}; 
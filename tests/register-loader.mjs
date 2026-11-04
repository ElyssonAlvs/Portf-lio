/**
 * Registers ESM loader hook for Node.js test environment.
 */
import { register } from 'node:module';
register('./json-loader.mjs', import.meta.url);

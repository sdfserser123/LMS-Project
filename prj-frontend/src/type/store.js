/**
 * @typedef {import('./user').User} User
 */

/**
 * @typedef {Object} AuthState
 * @property {string|null} accessToken
 * @property {User|null} user
 * @property {boolean} loading
 * @property {(username: string, password: string) => Promise<void>} signIn
 */

export {};

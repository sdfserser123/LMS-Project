/**
 * @typedef {import('./user').User} User
 */

/**
 * @property {() => Promise<void>} clearState
 * @typedef {Object} AuthState
 * @property {string|null} accessToken
 * @property {User|null} user
 * @property {boolean} loading
 * @property {(username: string, password: string) => Promise<void>} logIn
 * @property {() => Promise<void>} logOut
 */

export {};

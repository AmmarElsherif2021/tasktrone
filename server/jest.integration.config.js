/** Integration tests hit a real Postgres (server/docker-compose.yml) — kept separate
 * from the default `npm test` run so PRs stay fast and don't need a database. */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  setupFiles: ['reflect-metadata'],
  testMatch: ['<rootDir>/tests/integration/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
}

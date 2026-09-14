module.exports = {
  // Client (React) – use the legacy .eslintrc.json
  'client/src/**/*.{js,jsx,ts,tsx}': (filenames) => {
    return `npx eslint --fix --config client/.eslintrc.json ${filenames.join(' ')}`;
  },

  // Server (NestJS) – use the new flat config (eslint.config.mjs)
  // Includes src/, tests/, and any .ts/.js files
  'server/**/*.{ts,js}': (filenames) => {
    return `npx eslint --fix --config server/eslint.config.mjs ${filenames.join(' ')}`;
  },

  // Other files (exclude huge package-lock.json)
  '**/*.{md,css,html}': (filenames) => {
    const filtered = filenames.filter(f => !f.includes('package-lock.json'));
    if (filtered.length === 0) return [];
    return `npx prettier --write ${filtered.join(' ')}`;
  }
};

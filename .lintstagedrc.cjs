module.exports = {
  // Client (React) – use the legacy .eslintrc.json
  'client/src/**/*.{js,jsx,ts,tsx}': (filenames) => {
    return `npx eslint --fix --config client/.eslintrc.json ${filenames.join(' ')}`;
  },

  // Server (NestJS) – uses the legacy .eslintrc.js (no flat config exists yet)
  // Includes src/, tests/, and any .ts/.js files
  'server/**/*.{ts,js}': (filenames) => {
    return `npx eslint --fix --config server/.eslintrc.js ${filenames.join(' ')}`;
  },

  // Other files (exclude huge package-lock.json)
  '**/*.{md,css,html}': (filenames) => {
    const filtered = filenames.filter(f => !f.includes('package-lock.json'));
    if (filtered.length === 0) return [];
    return `npx prettier --write ${filtered.join(' ')}`;
  }
};

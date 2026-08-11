module.exports = {
  // Client (React) – run ESLint from root with full paths
  'client/src/**/*.{js,jsx,ts,tsx}': (filenames) => {
    return `npx eslint --fix ${filenames.join(' ')}`;
  },

  // Server (NestJS) – same, from root
  'server/{src,tests}/**/*.{ts,js}': (filenames) => {
    return `npx eslint --fix ${filenames.join(' ')}`;
  },

  // Other files (exclude huge package-lock.json)
  '**/*.{md,css,html}': (filenames) => {
    const filtered = filenames.filter(f => !f.includes('package-lock.json'));
    if (filtered.length === 0) return [];
    return `npx prettier --write ${filtered.join(' ')}`;
  }
};
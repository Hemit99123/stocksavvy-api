module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transforms TypeScript files using ts-jest
    '^.+\\.js$': 'babel-jest', // Transforms JS files using Babel
  },
  transformIgnorePatterns: [
    '/node_modules/(?!your-package-to-transform|other-package-to-transform).*/', // Add package names if you need to transpile from node_modules
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Recognizes .ts files
};

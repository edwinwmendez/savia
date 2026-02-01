/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  setupFilesAfterEnv: ['./jest.setup.js'],

  transformIgnorePatterns: [
    'node_modules/(?!(' +
      'jest-)?react-native' +
      '|@react-native(-community)?' +
      '|expo(nent)?' +
      '|@expo(nent)?/.*' +
      '|@expo-google-fonts/.*' +
      '|react-navigation' +
      '|@react-navigation/.*' +
      '|@unimodules/.*' +
      '|unimodules' +
      '|sentry-expo' +
      '|native-base' +
      '|react-native-svg' +
      '|react-native-safe-area-context' +
      '|react-native-screens' +
      '|@react-native-async-storage/async-storage' +
      '|lucide-react-native' +
      '|firebase' +
      '|@firebase/.*' +
      ')',
  ],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/shared/types/**',
    '!src/shared/theme/**',
    '!src/shared/config/constants.ts',
  ],
};

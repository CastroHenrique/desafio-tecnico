module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["ts", "js"],
  roots: ["./", "./src/"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["jest-extended"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  globalSetup: "./tests/global-setup.ts",
};

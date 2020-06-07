module.exports = {
  "roots": [
    "./src"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|js)",
    "**/?(*.)+test.+(ts|js)"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
}
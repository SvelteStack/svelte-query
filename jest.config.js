module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  transform: {
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        "preprocess": true
      }
    ],
    "^.+\\.([t|j]s)$": [
      "esbuild-jest"
    ]
  },
  moduleFileExtensions: [
    "js",
    "ts",
    "svelte"
  ]
}
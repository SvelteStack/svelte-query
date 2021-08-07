module.exports = {
  testEnvironment: "jsdom",
  "transform": {
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
  "moduleFileExtensions": [
    "js",
    "ts",
    "svelte"
  ]
}
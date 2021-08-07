module.exports = {
  testEnvironment: "jsdom",
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        'preprocess': true
      }
    ],
    '^.+\\.ts$': [
      'ts-jest',
      {
        'tsConfig': 'tsconfig.test.json'
      }
    ]
  },
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  moduleDirectories: ['node_modules', 'src']
}
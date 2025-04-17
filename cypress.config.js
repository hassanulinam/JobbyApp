const {defineConfig} = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/index.js',
    screenshotsFolder: 'cypress/snapshots/actual',
    trashAssetsBeforeRuns: true,
    setupNodeEvents(on, config) {
      // Add task for logging comparison metrics
      on('task', {
        log({message}) {
          console.log('\x1b[36m%s\x1b[0m', '=== Image Comparison Results ===')
          console.log(message)
          console.log('\x1b[36m%s\x1b[0m', '===============================')
          return null
        },
      })

      // Add custom snapshot comparison configuration
      const getCompareSnapshotsPlugin = require('cypress-image-snapshot/plugin')
      getCompareSnapshotsPlugin(on, config)
    },
  },
  env: {
    failOnSnapshotDiff: true,
    updateSnapshots: false,
  },
})

/* global Cypress */
import {addMatchImageSnapshotCommand} from 'cypress-image-snapshot/command'

// Custom command to log image comparison results
Cypress.Commands.add('logImageComparison', (testName, matchingPercentage) => {
  cy.task('log', {
    message: `
============================
🖼️  ${testName}
----------------------------
Matching: ${matchingPercentage}%
Difference: ${(100 - matchingPercentage).toFixed(2)}%
============================
`,
  })
})

addMatchImageSnapshotCommand({
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
  customDiffConfig: {
    threshold: 0.05,
  },
  capture: 'viewport',
  customSnapshotsDir: 'cypress/snapshots/base',
  customDiffDir: 'cypress/snapshots/diff',
  updateSnapshots: Cypress.env('updateSnapshots'),
  onCompare({diffRatio, diffPixelCount, diffPercentage}) {
    const matchingPercentage = (100 - (diffPercentage || 0)).toFixed(2)
    cy.logImageComparison(Cypress.currentTest.title, matchingPercentage)
  },
})

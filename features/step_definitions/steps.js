
'use strict'

const {defineStep} = require('cucumber')

// Import step implementations.
const _ = require('./implementations')

defineStep('I am on the {string} page', _.visitPage)

defineStep('I should see {string}', _.shouldSeeText)

defineStep('I should not see {string}', _.shouldNotSeeText)

defineStep('I wait for {float} seconds', {timeout: 10000}, _.wait)

defineStep('I type {string} in {string}', _.typeInput)

defineStep('I press {string}', _.pressButton)

defineStep('I click {string}', _.clickLink)

defineStep('I should be on the {string} page', _.shouldBeOnPage)


'use strict'

const {defineStep} = require('cucumber')

// Import step implementations.
const _ = require('./implementations')

defineStep('I am on the {string} page', _.visitPage)

defineStep('I should see {string}', _.shouldSeeText)

defineStep('I wait for {float} seconds', {timeout: 10000}, _.wait)

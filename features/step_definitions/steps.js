
'use strict'

const {defineStep} = require('cucumber')

// Import step implementations.
const _ = require('./implementations')

defineStep('I am on the {string} page', _.visitPage)

defineStep('{string} should be displayed', _.shouldSeeText)

defineStep('{string} should not be displayed', _.shouldNotSeeText)

defineStep('a {string} error be displayed', _.shouldSeeError)

defineStep('I wait for {float} seconds', {timeout: 10000}, _.wait)

defineStep('I type {string} in {string}', _.typeInput)

defineStep('I press {string}', _.pressButton)

defineStep('I click {string}', _.clickLink)

defineStep('he should be on the {word} page', _.shouldBeOnPage)

defineStep('the user {word} has an account', {timeout: 15000}, _.newAccount)

defineStep('he logs in', {timeout: 10000}, _.loginAsUser)

defineStep('the admin logs in', {timeout: 10000}, _.loginAsAdmin)

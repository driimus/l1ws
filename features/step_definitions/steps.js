
'use strict'

const {defineStep} = require('cucumber')

// Import step implementations.
const _ = require('./implementations')

defineStep('I/he am/is on the {string} page', {timeout: 10000}, _.visitPage)
defineStep('I/he visit(s) the {string} page', {timeout: 10000}, _.visitPage)

defineStep('{string} should be displayed', _.shouldSeeText)

defineStep('{string} should not be displayed', _.shouldNotSeeText)

defineStep('a {string} error should be displayed', _.shouldSeeError)

defineStep('I/he wait(s) for {float} seconds', {timeout: 10000}, _.wait)

defineStep('I/he type(s) {string} in (the) {string} (field)', _.typeInput)

defineStep('I/he update(s) the {string}( field)', _.replaceInput)
, {timeout: 10000}

defineStep('I/he press(es) {word}', {timeout: 15000}, _.pressButton)

defineStep('I/he press(es) {string}', {timeout: 15000}, _.pressButton)

defineStep('I/he check(s) {string}', _.pressCheckbox)

defineStep('I/he click(s) {string}', _.clickLink)

defineStep('I/he should be on the {string} page', {timeout: 10000}, _.shouldBeOnPage)
defineStep('I/he am/is taken to the {string} page', {timeout: 10000}, _.shouldBeOnPage)

defineStep('{string} should be checked', _.shouldBeChecked)

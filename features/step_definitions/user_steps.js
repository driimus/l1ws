
'use strict'

const {defineStep} = require('cucumber')

// Import step implementations.
const _ = require('./user_actions')

defineStep('the user {word} has an account', {timeout: 15000}, _.newAccount)

defineStep('I/he log(s) in', {timeout: 10000}, _.loginAsUser)

defineStep('I/he enter(s) the wrong {word}', {timeout: 10000}, _.fillLoginFormWith)

defineStep('the admin logs in', {timeout: 10000}, _.loginAsAdmin)

defineStep('I/he try/tries to sign up', {timeout: 10000}, _.fillRegisterForm)

defineStep('I/he try/tries to sign up with an existent {word}', {timeout: 10000}, _.fillRegisterFormWith)

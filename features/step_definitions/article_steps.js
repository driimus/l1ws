
'use strict'

const {defineStep} = require('cucumber')

// Import step implementations.
const _ = require('./article_actions')

// TO-DO
defineStep('{int} {word} article(s)', {timeout: 15000}, _.newArticlesByAdmin)

defineStep('a {word} article titled {string}', {timeout: 10000}, _.newArticleByAdmin)

defineStep('a {word} article titled {string} posted by {word}', {timeout: 40000}, _.newArticleByUser)

defineStep('{int} article(s) should be listed', {timeout: 10000}, _.shouldSeeArticles)

defineStep('the latest article gets approved', {timeout: 15000}, _.approveLatest)

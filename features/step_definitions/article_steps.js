
'use strict'

const {defineStep} = require('cucumber')

// Import step implementations.
const _ = require('./article_actions')

defineStep('{int} {word} article(s)', {timeout: 15000}, _.newArticlesByAdmin)

defineStep('I/he submit(s) an article titled {string}', {timeout: 20000}, _.newArticle)

defineStep('I/he try/tries to edit the article', {timeout: 10000}, _.goToEdit)

defineStep('I/he visit(s) the article', {timeout: 10000}, _.goToArticle)

defineStep('I/he rate(s) the article {int} stars', {timeout: 10000}, _.rateArticle)

defineStep('I/he edit(s) the {string}', {timeout: 15000}, _.editArticle)

defineStep('a(n) {word} article titled {string}', {timeout: 10000}, _.newArticleByAdmin)

defineStep('a(n) {word} article titled {string} posted by {word}', {timeout: 40000}, _.newArticleByUser)

defineStep('{int} article(s) should be listed', {timeout: 10000}, _.shouldSeeArticles)

defineStep('the latest article gets approved', {timeout: 15000}, _.approveLatest)

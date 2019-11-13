
'use strict'

const {isEmail} = require('../utils')

const noRecipientsErr = Error('no valid email recipients found')
const noArticlesErr = Error('no articles to send via newsletter')

/**
 * Filters out the list of recipients.
 *
 * @async
 * @param {string|Array} recipients - List of newsletter recipients.
 *
 * @returns {string|Array} List of valid newsletter recipients.
 */
const filteredRecipients = async recipients => {
	if(Array.isArray(recipients) === false) throw noRecipientsErr
	// Filter out invalid recipient addresses.
	recipients = recipients.filter(email => isEmail(email))
	if(recipients.length === 0) throw noRecipientsErr
	return recipients
}

const isString = str => typeof str === 'string' && str.length !== 0

/**
 * Filters out the list of artciles.
 *
 * @async
 * @param {string|Array} artciles - List of newsletter artciles.
 *
 * @returns {string|Array} List of valid newsletter artciles.
 */
const filteredArticles = async articles => {
	try {
		if (Array.isArray(articles) === false || articles.length === 0) throw noArticlesErr
		articles = articles.filter(article => isString(article.headline) && isString(article.summary))
		if(articles.length === 0) throw noArticlesErr
		return articles
	} catch(err) {
		throw err
	}
}

/**
 * Sends a filled out newsletter template to a target user.
 *
 * @async
 * @param {string|Array} recipients - List of newsletter recipients.
 * @param {object|Array} articles - Summarized articles.
 * @param {string} articles[].headline - The title of an article.
 * @param {string} articles[].thumbnail - The URL to an article's thumbnail.
 * @param {string} articles[].summary - The summary of an article.
 *
 * @returns {number} Value of the individual rating or NaN if not found.
 */
const send = async function(recipients, articles) {
	try {
		recipients = await filteredRecipients(recipients)
		articles = await filteredArticles(articles)
		const mail = {
			from: '"340CT Coursework" <local@news.com>',
			to: recipients.join(', '),
			subject: 'Don\'t miss out!',
			html: this.template({articles})
		}
		await this.transporter.sendMail(mail)
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Newsletter => Newsletter.prototype.send = send

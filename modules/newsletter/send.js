
'use strict'

/**
 * Sends a filled out newsletter template to a target user.
 *
 * @async
 * @param {string|Array} recipients - List of newsletter recipients.
 * @param {object|Array} articles - Summarized articles.
 * @param {string} articles[].headline - The title of an article.
 * @param {string} articles[].thumbnail - The URL to an article's thumbnail.
 * @param {string} articles[].summary - The summary of an article.
 * @returns {number} Value of the individual rating or NaN if not found.
 */
const send = async function(recipients, articles) {
	if(typeof recipients !== 'object' || recipients.length === 0) throw new Error('no valid email recipients found')
	const mail = {
		from: '"340CT Coursework" <local@news.com>',
		to: recipients.join(', '),
		subject: 'Don\'t miss out!',
		html: this.template({articles})
	}
	await this.transporter.sendMail(mail)
	return true
}

module.exports = Newsletter => Newsletter.prototype.send = send

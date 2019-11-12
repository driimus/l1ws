
'use strict'

/**
 * Retrieves the email address of users subscribed to the newsletter.
 *
 * @async
 * @returns {string[]} The list of email addresses for subscribed users.
 */
const getMailingList = async function() {
	const sql = 'SELECT email FROM users WHERE is_subscribed'
	const {rows: recipients} = await this.db.query(sql)
	if (recipients.length === 0) throw new Error('no subscriber emails found')
	return recipients.map(user => user.email)
}

module.exports = User => User.prototype.getMailingList = getMailingList

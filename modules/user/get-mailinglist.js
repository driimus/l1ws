
'use strict'

/**
 * Retrieves the email address of an user account.
 *
 * @param {number} id - Unique ID of the target account.
 * @async
 * @returns {string} The account's email address.
 */
const getMailingList = async function() {
	const sql = 'SELECT email FROM users WHERE is_subscribed'
	const {rows: recipients} = await this.db.query(sql)
	return recipients.map(user => user.email)
}

module.exports = User => User.prototype.getMailingList = getMailingList

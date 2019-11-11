
'use strict'

/**
 * Retrieves the email address of an user account.
 *
 * @param {number} id - Unique ID of the target account.
 * @async
 * @returns {string} The account's email address.
 */
const getEmail = async function(id) {
	const sql = 'SELECT email FROM users WHERE id=$1'
	const {rows: [result]} = await this.db.query(sql, [id])
	return result.email
}

module.exports = User => User.prototype.getEmail = getEmail

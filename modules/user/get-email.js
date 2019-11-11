
'use strict'

/**
 * Retrieves the email address of an user account.
 *
 * @param {number} id - Unique ID of the target account.
 * @async
 * @returns {string} The account's email address.
 */
const getEmail = async function(id) {
	const sql = 'SELECT id,email FROM users WHERE id=$1'
	const {rows: [result]} = await this.db.query(sql, [id])
	if (result === undefined) throw new Error(`user with ID "${id}" not found`)
	return result.email
}

module.exports = User => User.prototype.getEmail = getEmail

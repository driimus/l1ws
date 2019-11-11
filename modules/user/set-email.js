
'use strict'

/**
 * Updates the email address of an user account.
 *
 * @param {number} id - Unique ID of the target account.
 * @param {string} newEmail - Updated e-mail address.
 * @async
 * @returns {boolean} Whether the email was successfully changed.
 */
const setEmail = async function(id, newEmail) {
	const sql = 'UPDATE users SET email=$2 WHERE id=$1'
	await this.db.query(sql, [id, newEmail])
	return true
}

module.exports = User => User.prototype.setEmail = setEmail

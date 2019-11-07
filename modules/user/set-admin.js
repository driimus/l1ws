
'use strict'

/**
 * Updates the status of an user account.
 *
 * @param {string} admin - Username of the request author.
 * @param {string} username - Identifier of the target account.
 * @param {boolean} toAdmin - New value for admin status.
 * @async
 * @returns {boolean} Whether the status was successfully changed.
 */
const setAdmin = async function(admin, username, toAdmin=true) {
	const sql = 'UPDATE users SET is_admin=$2 WHERE username=$1'
	await this.db.query(sql, [username, toAdmin])
	return true
}

module.exports = User => User.prototype.setAdmin = setAdmin

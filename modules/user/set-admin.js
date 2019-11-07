
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
	try {
		// Check that the request was made by an admin.
		const byAdmin = await this.isAdmin(admin)
		if (!byAdmin) throw new Error(`user "${admin}" is not an admin`)
		// Update user status.
		const sql = 'UPDATE users SET is_admin=$2 WHERE username=$1'
		await this.db.query(sql, [username, toAdmin])
		return true
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.setAdmin = setAdmin

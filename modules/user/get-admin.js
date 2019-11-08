
'use strict'

/**
 * Confirms status of an admin account.
 *
 * @param {string} username - Identifier of the admin.
 * @async
 * @returns {boolean} If the username corresponds to an admin.
 */
const getAdmin = async function(username) {
	const byAdmin = await this.isAdmin(username)
	return byAdmin
}

module.exports = User => User.prototype.getAdmin = getAdmin

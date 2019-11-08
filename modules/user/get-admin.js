
'use strict'

/**
 * Confirms status of an admin account.
 *
 * @param {string} username - Identifier of the admin.
 * @async
 * @returns {boolean} If the username corresponds to an admin.
 */
const getAdmin = async function(username) {
	try {
		const byAdmin = await this.isAdmin(username)
		if (byAdmin === false) throw new Error(`user "${username}" is not an admin`)
		return byAdmin
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.getAdmin = getAdmin


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
		const isAdmin = await this.isAdmin(username)
		if (isAdmin === false) throw new Error(`user "${username}" is not an admin`)
		return isAdmin
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.getAdmin = getAdmin

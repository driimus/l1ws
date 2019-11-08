
'use strict'

const isBool = async flag => {
	if (typeof flag !== 'boolean') throw new Error(`invalid toAdmin value: "${flag}"`)
	return true
}

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
		await isBool(toAdmin)
		if(username.length === 0) throw new Error('missing target username')
		// Check that the request was made by an admin.
		const byAdmin = await this.isAdmin(admin)
		if (byAdmin === false) throw new Error(`user "${admin}" is not an admin`)
		// Update user status.
		const sql = 'UPDATE users SET is_admin=$2 WHERE username=$1'
		const {rowCount: updates} = await this.db.query(sql, [username, toAdmin])
		if (updates === 0) throw new Error(`target username "${username}" not found`)
		return true
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.setAdmin = setAdmin

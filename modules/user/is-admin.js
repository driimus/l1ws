
'use strict'

/**
 * Checks whether the user corresponds to an admin account.
 * @memberof User.prototype
 *
 * @async
 * @param {string} username - Identifier of the user.
 * @returns {boolean} Whether the account belongs to an admin.
 */
const isAdmin = async function(username) {
	try {
		// Guests are not admins
		if (username === undefined || username === '') return false
		const sql = 'SELECT id,is_admin FROM users where username=$1'
		const { rows: [res] } = await this.db.query(sql, [username])
		if(res === undefined) throw new Error(`username "${username}" not found`)
		return res.is_admin
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.isAdmin = isAdmin

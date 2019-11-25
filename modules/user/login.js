
'use strict'

const bcrypt = require('bcrypt-promise')

/**
 * Authenticates an existing user.
 * @memberof User.prototype
 *
 * @async
 * @param {string} username - Identifier of the user.
 * @param {string} password - The plaintext password to be checked.
 * @returns {number} ID of the user that logged in.
 */
const login = async function(username, password) {
	try {
		const sql = 'SELECT id,password FROM users WHERE username=$1 LIMIT 1'
		const { rows: [res] } = await this.db.query(sql, [username])
		if(res === undefined) throw new Error(`username "${username}" not found`)
		// Encrypt the submitted password and check that it matches.
		const valid = await bcrypt.compare(password, res.password)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)
		return res.id
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.login = login

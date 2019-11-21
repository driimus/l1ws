
'use strict'

const bcrypt = require('bcrypt-promise')

const {saltRounds} = require('../../config')[process.env.NODE_ENV]

/**
 * Creates a new user with the given credentials.
 *
 * @async
 * @param {string} username - Identifier of the user.
 * @param {string} password - The plaintext password.
 * @param {string} email - The user's email address.
 * @returns {number} The new account's unique identifier.
 */
const register = async function(username, password, email) {
	try {
		await this.isAvailable('username', username)
		await this.isAvailable('email', email)
		if(password.length === 0) throw new Error('missing password')
		// Save username and encrypted password.
		password = await bcrypt.hash(password, saltRounds)
		const sql = 'INSERT INTO users(username, password, email) VALUES($1, $2, $3) RETURNING id'
		const { rows: [user] } = await this.db.query(sql, [username, password, email])
		return user.id
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.register = register

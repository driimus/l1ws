
'use strict'

const bcrypt = require('bcrypt-promise')

const {saltRounds} = require('../../config')[process.env.NODE_ENV]
const {isEmail} = require('../utils')

/**
 * Creates a new user with the given credentials.
 *
 * @param {string} username - Identifier of the user.
 * @param {string} password - The plaintext password.
 * @async
 * @returns {boolean} Whether the operation was successful.
 */
const register = async function(username, password, email) {
	try {
		email = isEmail(email) === true ? email : null
		if(username.length === 0) throw new Error('missing username')
		if(password.length === 0) throw new Error('missing password')
		// Check that the username is not taken.
		let sql = 'SELECT id FROM users WHERE username=$1 LIMIT 1'
		const { rows: {length: exists} } = await this.db.query(sql, [username])
		if(exists !== 0) throw new Error(`username "${username}" already in use`)
		// Save username and encrypted password.
		password = await bcrypt.hash(password, saltRounds)
		sql = 'INSERT INTO users(username, password, email) VALUES($1, $2, $3)'
		await this.db.query(sql, [username, password, email])
		return true
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.register = register

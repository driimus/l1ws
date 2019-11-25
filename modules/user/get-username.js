
'use strict'

const {isId} = require('../utils')

/**
 * Retrieves the username of an user account.
 * @memberof User.prototype
 *
 * @async
 * @param {number} id - Unique ID of the target account.
 * @returns {string} The account's username.
 */
const getUsername = async function(id) {
	try {
		id = await isId(id, 'user')
		const sql = 'SELECT username FROM users WHERE id=$1'
		const {rows: [user]} = await this.db.query(sql, [id])
		if (user === undefined) throw new Error(`user with ID "${id}" not found`)
		return user.username
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.getUsername = getUsername


'use strict'

const {isId} = require('../utils')

/**
 * Retrieves the email address of an user account.
 *
 * @param {number} id - Unique ID of the target account.
 * @async
 * @returns {string} The account's email address.
 */
const getEmail = async function(id) {
	try {
		await isId(id, 'user')
		const sql = 'SELECT id,email FROM users WHERE id=$1'
		const {rows: [user]} = await this.db.query(sql, [id])
		if (user === undefined) throw new Error(`user with ID "${id}" not found`)
		return user.email
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.getEmail = getEmail

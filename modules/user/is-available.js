
'use strict'

const fields = ['username','email']

/**
 * Checks whether the username is not already taken.
 *
 * @param {string} username - Identifier of the user.
 * @async
 */
const isAvailable = async function(field, value) {
	if(fields.includes(field) === false) throw new Error(`invalid field "${field}"`)
	// Check that the username is not taken.
	const sql = `SELECT id FROM users WHERE ${field}=$1 LIMIT 1`
	const { rows: {length: exists} } = await this.db.query(sql, [value])
	if(exists !== 0) throw new Error(`${field} "${value}" already in use`)
	return true
}

module.exports = User => User.prototype.isAvailable = isAvailable

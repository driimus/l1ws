
'use strict'

const {isEmail, isId} = require('../utils')

// User arrtibutes for which availability checks are enabled.
const FIELDS = {
	username: value => {
		// Usernames must be a non-null string.
		if(typeof value !== 'string' || value.length === 0) throw new Error('missing username')
	},
	email: value => {
		if(isEmail(value) === false) throw new Error('invalid email address format')
	}
}
/**
 * Checks whether the value is available for a given user attribute.
 *
 * @async
 * @param {string} field - Name of the user attribute.
 * @param value - Value to be searched for.
 */
const isAvailable = async function(field, value, id) {
	if(id) id = await isId(id, 'user')
	if(Object.keys(FIELDS).includes(field) === false) throw new Error(`invalid field "${field}"`)
	// Validate the given value.
	FIELDS[field](value)
	// Check that the username is not taken.
	const sql = `SELECT id FROM users WHERE ${field}=$1 LIMIT 1`
	const { rows: [res] } = await this.db.query(sql, [value])
	if(res && res.id !== id) throw new Error(`${field} "${value}" already in use`)
	return true
}

module.exports = User => User.prototype.isAvailable = isAvailable

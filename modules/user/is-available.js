
'use strict'

const {isEmail} = require('../utils')

// User arrtibutes for which availability checks are enabled.
const FIELDS = {
	username: value => {
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
 * @param {string} [username, email] field - Name of the user attribute.
 * @param {string} value - Value to be searched for.
 */
const isAvailable = async function(field, value) {
	if(Object.keys(FIELDS).includes(field) === false) throw new Error(`invalid field "${field}"`)
	// if(value.length === 0) throw new Error(`missing ${field}`)
	FIELDS[field](value)
	// Check that the username is not taken.
	const sql = `SELECT id FROM users WHERE ${field}=$1 LIMIT 1`
	const { rows: {length: exists} } = await this.db.query(sql, [value])
	if(exists !== 0) throw new Error(`${field} "${value}" already in use`)
	return true
}

module.exports = User => User.prototype.isAvailable = isAvailable

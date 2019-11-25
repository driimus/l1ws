
'use strict'

const {isId} = require('../utils')

/**
 * Updates the email address of an user account.
 * @memberof User.prototype
 *
 * @async
 * @param {number} id - Unique ID of the target account.
 * @param {string} newEmail - Updated e-mail address.
 * @returns {boolean} Whether the email was successfully changed.
 */
const setEmail = async function(id, newEmail) {
	try {
		id = await isId(id, 'user')	//Check that the user ID is valid.
		// Updated email address must have a valid email format.
		await this.isAvailable('email', newEmail, id)
		const sql = 'UPDATE users SET email=$2 WHERE id=$1'
		const {rowCount: updates} = await this.db.query(sql, [id, newEmail])
		if (updates === 0) throw new Error(`user with ID "${id}" not found`)
		return true
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.setEmail = setEmail

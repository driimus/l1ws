
'use strict'

/**
 * Updates the email address of an user account.
 *
 * @param {number} id - Unique ID of the target account.
 * @param {string} newEmail - Updated e-mail address.
 * @async
 * @returns {boolean} Whether the email was successfully changed.
 */
const setEmail = async function(id, newEmail) {
	try {
		const sql = 'UPDATE users SET email=$2 WHERE id=$1'
		const {rowCount: updates} = await this.db.query(sql, [id, newEmail])
		if (updates === 0) throw new Error(`user with ID "${id}" not found`)
		return true
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.setEmail = setEmail

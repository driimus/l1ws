
'use strict'

const {isId} = require('../utils')

/**
 * Updates the newsletter subscription status of an user account.
 * @async
 * @param {number} id - Unique ID of the target account.
 * @param {boolean} newStatus - New subscription status.
 * @returns {boolean} Whether the status was successfully changed.
 */
const setSubscription = async function(id, newStatus) {
	try {
		await isId(id, 'user')	//Check that the user ID is valid.
		const sql = 'UPDATE users SET is_subscribed=$2 WHERE id=$1'
		const {rowCount: updates} = await this.db.query(sql, [id, newStatus])
		if (updates === 0) throw new Error(`user with ID "${id}" not found`)
		return true
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.setSubscription = setSubscription

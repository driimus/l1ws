
'use strict'

/**
 * Updates the newsletter subscription status of an user account.
 * @async
 * @param {number} id - Unique ID of the target account.
 * @param {boolean} newStatus - New subscription status.
 * @returns {boolean} Whether the status was successfully changed.
 */
const setSubscription = async function(id, newStatus) {
	const sql = 'UPDATE users SET is_subscribed=$2 WHERE id=$1'
	await this.db.query(sql, [id, newStatus])
	return true
}

module.exports = User => User.prototype.setSubscription = setSubscription

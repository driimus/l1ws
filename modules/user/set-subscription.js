
'use strict'

/**
 * Updates the email address of an user account.
 *
 * @param {number} id - Unique ID of the target account.
 * @param {string} newEmail - Updated e-mail address.
 * @async
 * @returns {boolean} Whether the email was successfully changed.
 */
const setSubscription = async function(id, newStatus) {
	const sql = 'UPDATE users SET is_subscribed=$2 WHERE id=$1'
	await this.db.query(sql, [id, newStatus])
	return true
}

module.exports = User => User.prototype.setSubscription = setSubscription

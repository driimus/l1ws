
'use strict'

/**
 * Retrieves the subscription status of an user account.
 *
 * @async
 * @param {number} id - Unique ID of the target account.
 * @returns {boolean} The account's subscription status.
 */
const getSubscription = async function(id) {
	const sql = 'SELECT is_subscribed FROM users WHERE id=$1'
	const {rows: [user]} = await this.db.query(sql, [id])
	return user.is_subscribed
}

module.exports = User => User.prototype.getSubscription = getSubscription


'use strict'

/**
 * Retrieves the subscription status of an user account.
 *
 * @async
 * @param {number} id - Unique ID of the target account.
 * @returns {boolean} The account's subscription status.
 */
const getSubscription = async function(id) {
	try {
		const sql = 'SELECT is_subscribed FROM users WHERE id=$1'
		const {rows: [user]} = await this.db.query(sql, [id])
		// Every record must have a status.
		if (user === undefined) throw new Error(`user with ID "${id}" not found`)
		return user.is_subscribed
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.getSubscription = getSubscription

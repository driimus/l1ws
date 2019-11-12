
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
	throw new Error('fn not implemented')
}

module.exports = User => User.prototype.setSubscription = setSubscription

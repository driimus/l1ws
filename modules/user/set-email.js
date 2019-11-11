
'use strict'


/**
 * Updates the status of an user account.
 *
 * @param {string} admin - Username of the request author.
 * @param {string} username - Identifier of the target account.
 * @param {boolean} toAdmin - New value for admin status.
 * @async
 * @returns {boolean} Whether the status was successfully changed.
 */
const setEmail = async function(userId, newEmail) {
	throw new Error('fn not implemented')
}

module.exports = User => User.prototype.setEmail = setEmail

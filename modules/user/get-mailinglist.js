
'use strict'

/**
 * Retrieves the email address of an user account.
 *
 * @param {number} id - Unique ID of the target account.
 * @async
 * @returns {string} The account's email address.
 */
const getMailingList = async function() {
	throw new Error('fn not implemented')
}

module.exports = User => User.prototype.getMailingList = getMailingList

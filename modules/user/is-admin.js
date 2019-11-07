
'use strict'

/**
 * Checks whether the user corresponds to an admin account.
 *
 * @param {string} username - Identifier of the user.
 * @async
 */
const isAdmin = async function(username) {
	try {
		throw new Error('function not implmented')
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.isAdmin = isAdmin


'use strict'

/**
 * Retrieves the path to an user's avatar image.
 *
 * @async
 * @param {number} id - Unique ID of the target user.
 * @returns {string} Path to the avatar image.
 */
async function getAvatar(id) {
	const sql = 'SELECT avatar FROM users WHERE id=$1'
	const {rows: [user]} = await this.db.query(sql, [id])
	return user.avatar
}

module.exports = User => User.prototype.getAvatar = getAvatar

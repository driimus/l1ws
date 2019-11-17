
'use strict'

const {isId} = require('../utils')

/**
 * Retrieves the path to an user's avatar image.
 *
 * @async
 * @param {number} id - Unique ID of the target user.
 * @returns {string} Path to the avatar image.
 */
async function getAvatar(id) {
	try {
		await isId(id, 'user')
		const sql = 'SELECT avatar FROM users WHERE id=$1'
		const {rows: [user]} = await this.db.query(sql, [id])
		if (user === undefined) throw new Error(`user with ID "${id}" not found`)
		return user.avatar
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.getAvatar = getAvatar

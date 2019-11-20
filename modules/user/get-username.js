
'use strict'

const getUsername = async function(id) {
	const sql = 'SELECT username FROM users WHERE id=$1'
	const {rows: [user]} = await this.db.query(sql, [id])
	if (user === undefined) throw new Error(`user with ID "${id}" not found`)
	return user.username
}

module.exports = User => User.prototype.getUsername = getUsername

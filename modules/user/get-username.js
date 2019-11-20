
'use strict'

const getUsername = async function(id) {
	const sql = 'SELECT username FROM users WHERE id=$1'
	const {rows: [user]} = await this.db.query(sql, [id])
	return user.username
}

module.exports = User => User.prototype.getUsername = getUsername

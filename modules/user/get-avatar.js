
'use strict'

const getAvatar = async function(id) {
	const sql = 'SELECT avatar FROM users WHERE id=$1'
	const {rows: [user]} = await this.db.query(sql, [id])
	return user.avatar
}

module.exports = User => User.prototype.getAvatar = getAvatar

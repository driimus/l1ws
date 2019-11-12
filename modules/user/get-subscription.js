
'use strict'

const getSubscription = async function(id) {
	const sql = 'SELECT is_subscribed FROM users WHERE id=$1'
	const {rows: [{is_subscribed: subscribed}]} = await this.db.query(sql, [id])
	return subscribed
}

module.exports = User => User.prototype.getSubscription = getSubscription

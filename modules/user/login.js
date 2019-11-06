
'use strict'

const bcrypt = require('bcrypt-promise')

const login = async function(username, password) {
	try {
		const sql = 'SELECT id,password FROM users WHERE username=$1 LIMIT 1'
		const { rows: [res] } = await this.db.query(sql, [username])
		if(res === undefined) throw new Error(`username "${username}" not found`)
		const valid = await bcrypt.compare(password, res.password)
		if(valid === false) throw new Error(`invalid password for account "${username}"`)
		return res.id
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.login = login

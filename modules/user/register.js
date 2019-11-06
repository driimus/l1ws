
'use strict'

const bcrypt = require('bcrypt-promise')

const {saltRounds} = require('../../config')[process.env.NODE_ENV]

const register = async function(username, password) {
	try {
		if(username.length === 0) throw new Error('missing username')
		if(password.length === 0) throw new Error('missing password')
		let sql = 'SELECT id FROM users WHERE username=$1 LIMIT 1'
		const { rows: {length: exists} } = await this.db.query(sql, [username])
		if(exists !== 0) throw new Error(`username "${username}" already in use`)
		password = await bcrypt.hash(password, saltRounds)
		sql = 'INSERT INTO users(username, password) VALUES($1, $2)'
		await this.db.query(sql, [username, password])
		return true
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.register = register

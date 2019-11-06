
'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')

const db = require('../db')

const {saltRounds} = require('../config')[process.env.NODE_ENV]

module.exports = class User {

	constructor() {
		return (async() => {
			this.db = new db()
			const sql = `CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				username TEXT NOT NULL,
				password TEXT NOT NULL
			)`
			await this.db.query(sql)
			return this
		})()
	}

	async register(username, password) {
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

	async uploadPicture(username, image) {
		try {
			if(image.type.split('/')[0] !== 'image') throw new Error('invalid image MIME type')
			const extension = mime.extension(image.type)
			await fs.copy(image.path, `public/avatars/${username}.${extension}`)
		} catch(err) {
			throw err
		}
	}

	async login(username, password) {
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

}

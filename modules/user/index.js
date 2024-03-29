
'use strict'

const db = require('../../db')

// Barebones user schema.
const schema = `CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL,
	password TEXT NOT NULL)`,
	// User schema upgrades.
	upgrade = `ALTER TABLE users
	ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
	ADD COLUMN IF NOT EXISTS email TEXT,
	ADD COLUMN IF NOT EXISTS is_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
	ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '/avatars/avatar.png'`

/** Class representing an user. */
class User {

	/**
	 * Create a database connection and initialise a new table if needed.
	 */
	constructor() {
		return (async() => {
			this.db = new db()
			await this.db.query(schema)
			await this.db.query(upgrade)
			return this
		})()
	}

}

// Extend base class with custom functions.
require('./register')(User)
require('./login')(User)
require('./is-admin')(User)
require('./is-available')(User)
require('./get-admin')(User)
require('./get-avatar')(User)
require('./get-email')(User)
require('./get-mailinglist')(User)
require('./get-subscription')(User)
require('./get-username')(User)
require('./set-admin')(User)
require('./set-avatar')(User)
require('./set-email')(User)
require('./set-subscription')(User)

module.exports = User

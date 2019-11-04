
'use strict'

const defaultPort = 5432

module.exports = {
	development: {
		user: process.env.DB_USER || 'petrec',
		host: process.env.DB_HOST || 'localhost',
		database: process.env.DB_DATABASE || 'cwnews',
		password: process.env.DB_PASSWORD || 'secretpassword',
		port: process.env.DB_PORT || defaultPort
	},
	production: {
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		database: process.env.DB_DATABASE,
		password: process.env.DB_PASSWORD,
		port: process.env.DB_PORT
	},
	test: {
		user: 'petest',
		host: 'localhost',
		database: 'cwtests',
		password: 'secretpassword'
	}
}

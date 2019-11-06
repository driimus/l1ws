
'use strict'

// Default port for PgSQL clusters.
const defaultPort = 5432

module.exports = {
	development: {
		// Custom development database credentials.
		user: process.env.DB_USER || 'petrec',
		host: process.env.DB_HOST || 'localhost',
		database: process.env.DB_DATABASE || 'cwnews',
		password: process.env.DB_PASSWORD || 'secretpassword',
		port: process.env.DB_PORT || defaultPort
	},
	production: {
		// Amazon RDS connection details.
		user: process.env.RDS_USERNAME,
		host: process.env.RDS_HOSTNAME,
		database: process.env.RDS_DB_NAME,
		password: process.env.RDS_PASSWORD,
		port: process.env.RDS_PORT
	},
	test: {
		// Local test database credentials.
		user: 'petest',
		host: 'localhost',
		database: 'cwtests',
		password: 'secretpassword'
	}
}

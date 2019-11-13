
'use strict'

module.exports = {
	development: {
		saltRounds: 5,
		transporter: {
			service: 'SendGrid',
			auth: {
				user: process.env.SENDGRID_USER,
				pass: process.env.SENDGRID_PASS
			}
		}
	},
	production: {
		saltRounds: 10,
		transporter: {
			service: 'SendGrid',
			auth: {
				user: process.env.SENDGRID_USER,
				pass: process.env.SENDGRID_PASS
			}
		}
	},
	test: {
		saltRounds: 1,
		transporter: {
			host: 'smtp.ethereal.email',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'tristian98@ethereal.email',	// testing account username
				pass: 'Mdb3P4AXBMWC7fYP7q'			// testing account password
			}
		}
	}
}

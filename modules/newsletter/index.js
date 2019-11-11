
'use strict'

const nodemailer = require('nodemailer')

class Newsletter {

	constructor() {
		return (() => {
			this.transporter = nodemailer.createTransport()
			return this
		})()
	}

}

// Extend base class with custom functions.
require('./send')(Newsletter)

module.exports = Newsletter

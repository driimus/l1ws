
'use strict'

const nodemailer = require('nodemailer')

// Import nodemailer settings for current environment.
const {transporter: settings} = require('../../config')[process.env.NODE_ENV]

class Newsletter {

	constructor() {
		return (() => {
			this.transporter = nodemailer.createTransport(settings)
			return this
		})()
	}

}

// Extend base class with custom functions.
require('./send')(Newsletter)

module.exports = Newsletter

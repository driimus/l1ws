
'use strict'

const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs-extra')
const path = require('path')

// Import nodemailer settings for current environment.
const {transporter: settings} = require('../../config')[process.env.NODE_ENV],
	// Preload the template file.
	templateFile = fs.readFileSync(path.join(__dirname,'../../views/newsletter.handlebars'), 'utf8'),
	template = handlebars.compile(templateFile)

/** Class representing a newsletter. */
class Newsletter {

	/**
	 * Create a mail transporter and assign pre-compiled HTML template.
	 */
	constructor() {
		return (() => {
			this.transporter = nodemailer.createTransport(settings)
			this.template = template
			return this
		})()
	}

}

// Extend base class with custom functions.
require('./send')(Newsletter)
require('./get-timeleft')(Newsletter)

module.exports = Newsletter

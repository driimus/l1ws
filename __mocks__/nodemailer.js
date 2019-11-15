
'use strict'

const nodemailer = jest.requireActual('nodemailer')

const addressparser = require('../node_modules/nodemailer/lib/addressparser')

const mockmailer = jest.genMockFromModule('nodemailer')

let transport, sentMail = []

const __resetMock = () => {
	transport = null, sentMail = []
}

function createTransport(options) {
	// Use the real module's transporter.
	transport = nodemailer.createTransport(options)
	return {sendMail}
}

// Use modified versions of the real module's.
const Mail = {

	/**
	 * Normalizes an email address
	 *
	 * @param {Array} address An array of address objects
	 * @return {String} address string
	 */
	_normalizeAddress: address => {
		address = (address || '').toString().trim()

		const lastAt = address.lastIndexOf('@')
		if (lastAt < 0) {
			// Bare username
			return address
		}
		const user = address.substr(0, lastAt)
		const domain = address.substr(lastAt + 1)

		// Usernames are not touched and are kept as is even if these include unicode
		return `${user }@${ domain.toLowerCase()}`
	},
	/**
	 * Parses addresses. Takes in a single address or an array or an
	 * array of address arrays (eg. To: [[first group], [second group],...])
	 *
	 * @param {Mixed} addresses Addresses to be parsed
	 * @return {Array} An array of address objects
	 */
	_parseAddresses: addresses => [].concat.apply([],
		[].concat(addresses).map(address => {
			// eslint-disable-line prefer-spread
			if (address && address.address) {
				address.address = Mail._normalizeAddress(address.address)
				address.name = address.name || ''
				return [address]
			}
			return addressparser(address)
		})
	),

	_parseContent: data => {
		['html', 'text', 'watchHtml', 'amp'].forEach(key => {
			if (data[key] && data[key].content) {
				if (typeof data[key].content === 'string') {
					data[key] = data[key].content
				} else if (Buffer.isBuffer(data[key].content)) {
					data[key] = data[key].content.toString()
				}
			}
		})
		return data
	}

}

const sendMail = (email, callback) => {
	// support either callback or promise api
	const isPromise = !callback && typeof Promise === 'function'

	try {
		// Parse the email object.
		email.to = Mail._parseAddresses(email.to)
		email = Mail._parseContent(email)
		// Cache the sent email.
		sentMail.push(email)
		// return success
		return isPromise ? Promise.resolve('Mock mail sent') : callback(null, 'Mock mail sent')
	} catch(err) {
		// return the error
		return isPromise ? Promise.reject(err) : callback(err)
	}
}

mockmailer.__resetMock = __resetMock
mockmailer.createTransport = createTransport

module.exports = mockmailer

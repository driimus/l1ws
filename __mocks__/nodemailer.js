
'use strict'

const nodemailer = jest.requireActual('nodemailer')

const mockmailer = jest.genMockFromModule('nodemailer')

let transport, sentMail = []

const __resetMock = () => {
	transport = null, sentMail = []
}

function createTransport(options) {
	transport = nodemailer.createTransport(options)
	return {sendMail}
}

const sendMail = (email, callback) => {
	// support either callback or promise api
	const isPromise = !callback && typeof Promise === 'function'

	try {
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

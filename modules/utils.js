/**
 * Utilities module.
 * @module utils
 */

'use strict'

const {readdirSync, lstatSync} = require('fs')
const path = require('path')

const models = readdirSync(__dirname).filter(
	file => lstatSync(path.join(__dirname, file)).isDirectory())

const isModel = async model => {
	if (models.includes(model) === false)
		throw new Error(`model "${model}" does not exist`)
	return true
}

/**
 * Checks that a given value is an integer.
 *
 * @async
 * @param {number} id - The value to be validated.
 * @param {string} model - The identifier's corresponding model.
 * @returns {number} The parsed value.
 */
const isId = async(id, model) => {
	try {
		id = await isInt(id, model)
		await isModel(model)
		return id
	} catch(err) {
		if(err.message === `model "${model}" does not exist`) throw err
		throw new Error(`invalid ${model} ID`)
	}
}

const isInt = async(value, model) => {
	const int = parseInt(value)
	if (Number.isInteger(int) === false) throw new Error(`${model} value "${value}" is not a number`)
	if (int < 1) throw new Error(`number "${value}" is not positive`)
	return int
}

// Regexp that matches valid email addresses.
const emailPattern = new RegExp('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]' +
	'{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

/** Validate email address format.
 * @param {string} email - The address to test against.
 * @return {boolean} Whether the address is an email.
 */
const isEmail = email => emailPattern.test(email)

module.exports = {isId, isInt, isEmail}

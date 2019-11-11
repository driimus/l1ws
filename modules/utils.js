
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


module.exports = {isId, isInt}

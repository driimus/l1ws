
'use strict'

const isId = async(id, model) => {
	try {
		id = await isInt(id, model)
		await isModel(model)
		return id
	} catch(err) {
		throw new Error(`invalid ${model} ID`)
	}
}

const isInt = async(value, model) => {
	const int = parseInt(value)
	if (Number.isInteger(int) === false) throw new Error(`${model} value "${value}" is not a number`)
	if (int < 1) throw new Error(`number "${value}" is not positive`)
	return int
}

const isModel = async model => {
	throw new Error('function not implemented')
}

module.exports = {isId, isInt}

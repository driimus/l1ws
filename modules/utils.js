
'use strict'

const isId = async(id, model) => {
	try {
		id = await isInt(id, model)
		return id
	} catch(err) {
		throw new Error(`invalid ${model} ID`)
	}
}

const isInt = async(value, model) => {
	const int = parseInt(value)
	if (Number.isInteger(int) === false) throw new Error(`${model} value "${value}" is not a number`)
	return int
}

module.exports = {isId, isInt}

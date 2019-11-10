
'use strict'

const isId = async id => {
	id = parseInt(id)
	if (isNaN(id)) throw new Error('invalid article ID')
	return id
}

const isInt = async(value, model) => {
	const int = parseInt(value)
	if (Number.isInteger(int) === false) throw new Error(`${model} value "${value}" is not a number`)
	return int
}

module.exports = {isId, isInt}

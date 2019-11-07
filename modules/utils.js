
'use strict'

const isId = async id => {
	id = parseInt(id)
	if (isNaN(id)) throw new Error('invalid article ID')
	return id
}

module.exports = isId

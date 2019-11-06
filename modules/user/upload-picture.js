
'use strict'

const fs = require('fs-extra')
const mime = require('mime-types')

const uploadPicture = async function(username, image) {
	try {
		if(image.type.split('/')[0] !== 'image') throw new Error('invalid image MIME type')
		const extension = mime.extension(image.type)
		await fs.copy(image.path, `public/avatars/${username}.${extension}`)
	} catch(err) {
		throw err
	}
}

module.exports = User => User.prototype.uploadPicture = uploadPicture

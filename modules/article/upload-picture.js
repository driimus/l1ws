
'use strict'

const fs = require('fs-extra')
const mime = require('mime-types')
const path = require('path')

/**
 * Saves a new article thumbnail to the filesystem.
 *
 * @param {object} img - The submitted image.
 * @async
 * @returns {string} Relative path to the public uploaded image.
 */
const uploadPicture = async img => {
	try {
		if(img.type.split('/')[0] !== 'image') throw new Error('invalid image MIME type')
		const extension = mime.extension(img.type)
		const picPath = `uploads/${path.basename(img.path)}.${extension}`
		await fs.copy(img.path, `public/${picPath}`)
		return picPath
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.uploadPicture = uploadPicture


'use strict'

const fs = require('fs-extra')
const mime = require('mime-types')
const path = require('path')

const uploadPicture = async(img) => {
	const extension = mime.extension(img.type)
	const picPath = `public/uploads/${path.basename(img.path)}.${extension}`
	await fs.copy(img.path, picPath)
	return picPath
}

module.exports = Article => Article.prototype.uploadPicture = uploadPicture

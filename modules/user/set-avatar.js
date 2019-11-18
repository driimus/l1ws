
'use strict'

const fs = require('fs-extra')
const mime = require('mime-types')

/**
 * Saves a new profile picture for the user.
 *
 * @param {string} username - User the picture will be linked to.
 * @param {object} image - The submitted profile picture.
 * @async
 * @returns {string} Relative path to the public uploaded image.
 */
const uploadPicture = async function(username, image) {
	try {
		if(image.type.split('/')[0] !== 'image') throw new Error('invalid image MIME type')
		const extension = mime.extension(image.type)
		const newPath = `public/avatars/${username}.${extension}`
		await fs.copy(image.path, newPath)
		return newPath
	} catch(err) {
		throw err
	}
}

const setAvatar = async function(username, image) {
	const path = await uploadPicture(username, image)
	const sql = 'UPDATE users SET avatar=$2 WHERE username=$1'
	await this.db.query(sql, [username, path])
	return true
}

module.exports = User => User.prototype.setAvatar = setAvatar

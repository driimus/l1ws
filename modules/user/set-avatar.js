
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
const uploadPicture = async(username, image) => {
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

/**
 * Checks that an account with the given username exists.
 *
 * @async
 * @param {object} user - The module handing the check.
 * @param {string} username - Target username.
 * @returns {boolean} If an account with the given username exists.
 */
const userExsits = async(user, username) => {
	try {
		await user.isAvailable('username', username)
		throw new Error(`username "${username}" not found`)
	} catch(err) {
		if(err.message === `username "${username}" already in use`) return true
		// Throw any invalid username error.
		throw err
	}
}

/**
 * Updates the user's avatar.
 *
 * @async
 * @param {string} username - User the picture will be linked to.
 * @param {object} image - The submitted profile picture.
 * @returns {boolean} If the image was successfully updated.
 */
const setAvatar = async function(username, image) {
	// Username must be in use.
	await userExsits(this, username)
	const path = await uploadPicture(username, image)
	const sql = 'UPDATE users SET avatar=$2 WHERE username=$1'
	await this.db.query(sql, [username, path])
	return true
}

module.exports = User => User.prototype.setAvatar = setAvatar

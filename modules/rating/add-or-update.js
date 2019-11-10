
'use strict'

/**
 * Creates or updates an individual article rating.
 *
 * @param {number} userId - The ID of the user giving the rating.
 * @param {number} articleId - The ID of the rated article.
 * @param {number} value - The updated rating value on a scale of 1 to 5.
 * @async
 * @returns {boolean} If the process was successful.
 */
const addOrUpdate = async function(userId, articleId, value) {
	throw new Error('function not implemented')
}

module.exports = Rating => Rating.prototype.addOrUpdate = addOrUpdate

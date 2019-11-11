
'use strict'

/**
 * Retrieves an individual article rating.
 *
 * @async
 * @param {number} userId - The ID of the rating's author.
 * @param {number} articleId - The ID of the rated article.
 * @returns {number} Value of the individual rating.
 */
const get = async function(userId, articleId) {
	throw new Error('function not implemented')
}

module.exports = Rating => Rating.prototype.get = get

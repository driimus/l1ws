
'use strict'

/**
 * Retrieves the average of an article's ratings.
 *
 * @async
 * @param {number} articleId - The ID of the target article.
 * @returns {number} Arithmetic mean of the article's ratings.
 */
const mean = async function(articleId) {
	throw new Error('function not implemented')
}

module.exports = Rating => Rating.prototype.mean = mean

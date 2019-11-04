
'use strict'

/**
 * Retrieves all the stored articles in reverse chronological order.
 *
 * @param {number} articleId - The ID of the requested article.
 * @async
 */
const get = async function(articleId) {
	throw new Error('function not implemented')
}

module.exports = Article => Article.prototype.get = get


'use strict'

/**
 * Updates an existing article submission.
 *
 * @param {number} userId - The ID of the update's requester.
 * @param {number} articleId - The ID of the original article.
 * @param {object} newArticle - The updated article object.
 * @async
 * @returns {boolean} If the process was successful.
 */
const update = async function(userId, articleId, newArticle) {
	throw new Error('function not implemented')
}

module.exports = Article => Article.prototype.update = update

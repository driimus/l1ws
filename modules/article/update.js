
'use strict'

const {isId} = require('../utils')

/**
 * Compares two article objects for equality.
 *
 * @private
 * @async
 * @param {object} article - The current article object.
 * @param {object} newArticle - The updated article object.
 * @returns {boolean} Whether the new article is different.
 */
const wasModified = async(article, newArticle) =>
	Object.keys(article).some((attr) => newArticle[attr] !== article[attr])

/**
 * Updates an existing article submission.
 * @memberof Article.prototype
 *
 * @async
 * @param {number} userId - The ID of the update's requester.
 * @param {number} articleId - The ID of the original article.
 * @param {object} newArticle - The updated article object.
 * @returns {boolean} Whether the process was successful.
 */
const update = async function(userId, articleId, newArticle) {
	try {
		await isId(articleId, 'article')		// Validate given ID.
		const article = await this.get(articleId)
		// Skip if no changes were made.
		const modified = await wasModified(article.data, newArticle)
		if(modified === false) return false
		// Check that the request is made by the author.
		await this.byAuthor(userId, article.author_id)
		await this.isValid(newArticle)
		const sql = 'UPDATE article SET (data, created_at, status) = ($2, now(), \'pending\') WHERE id=$1'
		await this.db.query(sql, [articleId, newArticle])
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.update = update

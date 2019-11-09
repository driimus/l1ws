
'use strict'

const isId = require('../utils')

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
 * Compares two user IDs for equality.
 *
 * @private
 * @async
 * @param {number} thisId - The ID to compare.
 * @param {number} thatId - The ID to compare against.
 * @returns {boolean} If the two IDs match.
 */
const byAuthor = async(thisId, thatId) => {
	// Convert to number and compare.
	if(+thisId !== +thatId) throw new Error(`user with ID "${thisId}" is not the author`)
	return true
}

/**
 * Updates an existing article submission.
 *
 * @param {number} userId - The ID of the update's requester.
 * @param {number} articleId - The ID of the original article.
 * @param {object} newArticle - The updated article object.
 * @async
 * @returns {boolean} Whether the process was successful.
 */
const update = async function(userId, articleId, newArticle) {
	try {
		await isId(articleId)		// Validate given ID.
		const article = await this.get(articleId)
		// Skip if no changes were made.
		const modified = await wasModified(article.data, newArticle)
		if(modified === false) return false
		// Check that the request is made by the author.
		await byAuthor(userId, article.author_id)
		await this.isValid(newArticle)
		const sql = 'UPDATE article SET (data, created_at, status) = ($2, now(), \'pending\') WHERE id=$1'
		await this.db.query(sql, [articleId, newArticle])
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.update = update
module.exports = Article => Article.prototype.byAuthor = byAuthor


'use strict'

const isId = require('../utils')

/**
 * Compares two article objects for equality.
 *
 * @private
 * @param {object} article - The current article object.
 * @param {object} newArticle - The updated article object.
 * @returns {boolean} Whether the new article is different.
 */
const modified = (article, newArticle) =>
	Object.keys(article).some((attr) => newArticle[attr] !== article[attr])

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
		const {data: article} = await this.get(articleId)
		// Skip if no changes were made.
		if(modified(article, newArticle) === false) return false
		const sql = 'UPDATE article SET (data, created_at, status) = ($2, now(), \'pending\') WHERE id=$1'
		const {rowCount: updates} = await this.db.query(sql, [articleId, newArticle])
		if(updates === 0) throw new Error(`article with ID "${articleId}" not found`)
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.update = update

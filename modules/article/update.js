
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
	const sql = 'UPDATE article SET (data, created_at, status) = ($2, now(), \'pending\') WHERE id=$1'
	await this.db.query(sql, [articleId, newArticle])
	return true
}

module.exports = Article => Article.prototype.update = update

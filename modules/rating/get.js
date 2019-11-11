
'use strict'

/**
 * Retrieves an individual article rating.
 *
 * @async
 * @param {number} userId - The ID of the rating's author.
 * @param {number} articleId - The ID of the rated article.
 * @returns {number} Value of the individual rating or NaN if not found.
 */
const get = async function(userId, articleId) {
	const sql = 'SELECT value FROM rating WHERE author_id=$1 AND article_id=$2'
	const {rows: [rating]} = await this.db.query(sql, [userId, articleId])
	return rating === undefined ? NaN : rating.value
}

module.exports = Rating => Rating.prototype.get = get

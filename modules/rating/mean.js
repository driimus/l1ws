
'use strict'

/**
 * Retrieves the average of an article's ratings.
 *
 * @async
 * @param {number} articleId - The ID of the target article.
 * @returns {number} Arithmetic mean of the article's ratings.
 */
const mean = async function(articleId) {
	const sql = 'SELECT AVG(value) FROM rating WHERE article_id=$1'
	const {rows: [{avg: rating}]} = await this.db.query(sql, [articleId])
	// Return result rounded up to 2 decimals.
	return +parseFloat(rating).toFixed(2)
}

module.exports = Rating => Rating.prototype.mean = mean

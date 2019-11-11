
'use strict'

const {isId} = require('../utils')

// Floating point precision for the arithmetic mean.
const precision = 2

/**
 * Retrieves the average of an article's ratings.
 *
 * @async
 * @param {number} articleId - The ID of the target article.
 * @returns {number} Arithmetic mean of the article's ratings.
 */
const mean = async function(articleId) {
	try {
		await isId(articleId, 'article')
		const sql = 'SELECT AVG(value) FROM rating WHERE article_id=$1'
		const { rows: [{avg: rating}] } = await this.db.query(sql, [articleId])
		// Round up the average to fixed decimals.
		return +parseFloat(rating).toFixed(precision)
	} catch(err) {
		throw err
	}
}

module.exports = Rating => Rating.prototype.mean = mean


'use strict'

/**
 * Creates or updates an individual article rating.
 *
 * @param {number} userId - The ID of the user giving the rating.
 * @param {number} articleId - The ID of the rated article.
 * @param {number} value - The updated rating value on a scale of 1 to 5.
 * @async
 * @returns {boolean} If the process was successful.
 */
const addOrUpdate = async function(userId, articleId, value) {
	const sql = 'INSERT INTO rating (author_id, article_id, value) VALUES ($1, $2, $3)'
	await this.db.query(sql, [userId, articleId, value])
	return true
}

module.exports = Rating => Rating.prototype.addOrUpdate = addOrUpdate

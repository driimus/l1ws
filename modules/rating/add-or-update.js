
'use strict'

const utils = require('../utils')

// Accepted rating value thresholds.
const min = 1, max = 5

const isValid = async rating => {
	rating = await utils.isInt(rating, 'rating')
	if(rating < min || rating > max) throw new Error(`invalid rating value: ${rating}`)
	return true
}

/**
 * Creates or updates an individual article rating.
 *
 * @async
 * @param {number} userId - The ID of the user giving the rating.
 * @param {number} articleId - The ID of the rated article.
 * @param {number} rating - The updated rating value on a scale of 1 to 5.
 * @returns {boolean} If the process was successful.
 */
const addOrUpdate = async function(userId, articleId, rating) {
	try {
		await utils.isId(userId, 'user')
		await utils.isId(articleId, 'article')
		await isValid(rating)
		const sql = `INSERT INTO rating (author_id, article_id, value) VALUES ($1, $2, $3)
			ON CONFLICT ON CONSTRAINT unique_rating DO UPDATE SET value=$3
		`
		await this.db.query(sql, [userId, articleId, rating])
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Rating => Rating.prototype.addOrUpdate = addOrUpdate

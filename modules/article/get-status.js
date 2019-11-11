
'use strict'

const {isId} = require('../utils')

/**
 * Retrieves the status of an article submission.
 *
 * @param {number} id - The ID of the requested article.
 * @async
 * @returns {string} Current submission status (approved/pending).
 */
const getStatus = async function(id) {
	try {
		await isId(id, 'article')	// Validate given ID first.
		const sql = 'SELECT status FROM article WHERE id=$1'
		const { rows: [article] } = await this.db.query(sql, [id])
		if(article === undefined) throw new Error(`article with ID "${id}" not found`)
		return article.status
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.getStatus = getStatus


'use strict'

/**
 * Retrieves the status of an article submission.
 *
 * @param {number} id - The ID of the requested article.
 * @async
 * @returns {string} Current submission status (approved/pending).
 */
const getStatus = async function(id) {
	const sql = 'SELECT status FROM article WHERE id=$1'
	const {rows: [{status}] } = await this.db.query(sql, [id])
	return status
}

module.exports = Article => Article.prototype.getStatus = getStatus

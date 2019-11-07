
'use strict'

/**
 * Updates the status of an article submission.
 *
 * @param {number} id - The ID of the requested article.
 * @param {string} newStatus - New submission status.
 * @async
 * @returns {string} Whether the update was performed successfully.
 */
const setStatus = async function(id, newStatus) {
	const sql = 'UPDATE article SET status=$2 WHERE id=$1'
	await this.db.query(sql, [id, newStatus])
	return true
}

module.exports = Article => Article.prototype.setStatus = setStatus

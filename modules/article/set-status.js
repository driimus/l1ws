
'use strict'

const {isId} = require('../utils')

/**
 * Updates the status of an article submission.
 * @memberof Article.prototype
 *
 * @async
 * @param {number} id - The ID of the requested article.
 * @param {string} newStatus - New submission status.
 * @returns {string} Whether the update was performed successfully.
 */
const setStatus = async function(id, newStatus) {
	try {
		// Validate given ID first.
		await isId(id, 'article')
		if (!['pending', 'approved', 'rejected'].includes(newStatus))
			throw new Error(`new status "${newStatus}" is not allowed`)
		const sql = 'UPDATE article SET status=$2 WHERE id=$1'
		const {rowCount} = await this.db.query(sql, [id, newStatus])
		// Check if no record was updated.
		if(rowCount === 0) throw new Error(`article with ID "${id}" not found`)
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.setStatus = setStatus


'use strict'

const {isId} = require('../utils')

/**
 * Retrieves a single article submission.
 *
 * @async
 * @param {number} id - The ID of the requested article.
 * @param {boolean} showHidden - Flag for filtering articles by status.
 * @returns {object} Article with a matching id but no search indices.
 */
const get = async function(id, showHidden=false) {
	try {
		if (typeof showHidden !== 'boolean') throw new Error(`invalid showHidden value: "${showHidden}"`)
		await isId(id, 'article') 	// Validate given ID.
		const sql = `SELECT id, author_id, created_at, status, data
			FROM article WHERE id=$1
			${showHidden === false ? 'AND status=\'approved\'' : ''}
		`
		// Get first result.
		const { rows: [article] } = await this.db.query(sql, [id])
		if(article === undefined) throw new Error(`article with ID "${id}" not found`)
		return article
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.get = get

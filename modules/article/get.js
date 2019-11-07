
'use strict'

/**
 * Retrieves all the stored articles in reverse chronological order.
 *
 * @param {number} id - The ID of the requested article.
 * @param {boolean} showHidden - Flag for filtering articles by status.
 * @async
 * @returns {object} Article with a matching id.
 */
const get = async function(id, showHidden=false) {
	try {
		// Check that Article ID is numeric.
		if (isNaN(id)) throw new Error('invalid article ID')
		const sql = `SELECT * FROM article WHERE id=$1
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

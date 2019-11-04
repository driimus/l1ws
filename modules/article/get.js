
'use strict'

/**
 * Retrieves all the stored articles in reverse chronological order.
 *
 * @param {number} id - The ID of the requested article.
 * @async
 */
const get = async function(id) {
	try {
		// Check that Article ID is numeric.
		if (isNaN(id)) throw new Error('invalid article ID')
		const sql = 'SELECT * FROM article WHERE id=$1'
		const {rows: [article]} = await this.db.query(sql, [id])
		if(article === undefined) throw new Error(`article with ID "${id}" not found`)
		return article
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.get = get

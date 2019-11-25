
'use strict'

/**
 * Retrieves all the articles in reverse chronological order.
 * @memberof Article.prototype
 *
 * @async
 * @param {boolean} showHidden - Flag for filtering articles by status.
 * @returns {Array} List of the requested articles (without search indices) as objects.
 */
const getAll = async function(showHidden=false) {
	try {
		// TO-DO: implement pagination
		if (typeof showHidden !== 'boolean') throw new Error(`invalid showHidden value: "${showHidden}"`)
		const sql = `SELECT id, author_id, created_at, status, data FROM article
			${showHidden === false ? 'WHERE status=\'approved\'' : ''}
			ORDER BY created_at DESC
		`
		const {rows: articles} = await this.db.query(sql)
		if(articles.length === 0) throw new Error('found no published articles')
		return articles
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.getAll = getAll

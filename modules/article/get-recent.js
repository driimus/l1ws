
'use strict'

/**
 * Retrieves a summary of the articles published over the last 24 hours.
 * @memberof Article.prototype
 *
 * @async
 * @returns {object[]} List of the latest publications' summaries as objects.
 */
const getRecent = async function() {
	try {
		const sql = `SELECT data->'headline' as headline, data->'summary' as summary
			FROM article
			WHERE created_at > now() - interval '24 hours' AND status='approved'
		`
		const {rows: articles} = await this.db.query(sql)
		if (articles.length === 0) throw new Error('no articles published in the last day')
		return articles
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.getRecent = getRecent

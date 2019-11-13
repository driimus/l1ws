
'use strict'

const find = async function(keyphrase, showHidden=false) {
	keyphrase = keyphrase.split(' ').join(' & ')
	const sql = `SELECT * FROM article
		WHERE searchable_indices @@ to_tsquery($1)
		${showHidden === false ? 'AND status=\'approved\'' : ''}
	`
	const {rows: articles} = await this.db.query(sql, [keyphrase])
	if(articles.length === 0) throw new Error('the search generated no results')
	return articles
}

module.exports = Article => Article.prototype.find = find

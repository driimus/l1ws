
'use strict'

const find = async function(keyphrase, showHidden=false) {
	keyphrase = keyphrase.split(' ').join(' & ')
	const sql = 'SELECT * FROM article WHERE searchable_indices @@ to_tsquery($1)'
	const {rows: articles} = await this.db.query(sql, [keyphrase])
	return articles
}

module.exports = Article => Article.prototype.find = find

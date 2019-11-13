
'use strict'

const formatted = {
	keyphrase: phrase => {
		if (typeof phrase !== 'string' || phrase.length === 0) throw new Error('missing search keyphrase')
		// Format the keyphrase into a valid Postgres value.
		return phrase.split(' ').join(' & ')
	},
	showHidden: flag => flag === false ? 'AND status=\'approved\'' : ''
}

const find = async function(keyphrase, showHidden=false) {
	try {
		keyphrase = formatted.keyphrase(keyphrase)
		showHidden = formatted.showHidden(showHidden)
		const sql = `SELECT * FROM article
			WHERE searchable_indices @@ to_tsquery($1) ${showHidden}
		`
		const {rows: articles} = await this.db.query(sql, [keyphrase])
		if(articles.length === 0) throw new Error('the search generated no results')
		return articles
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.find = find

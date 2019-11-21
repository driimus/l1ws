
'use strict'

// Helper for validating and parsing the search function's parameters.
const parsed = {
	keyphrase: phrase => {
		if (typeof phrase !== 'string' || phrase.length === 0) throw new Error('missing search keyphrase')
		// Format the keyphrase into a valid Postgres value.
		return phrase.split(' ').join(' & ')
	},
	showHidden: flag => {
		if (typeof flag !== 'boolean') throw new Error(`invalid showHidden value: "${flag}"`)
		// Return the hidden article filter as SQL.
		return flag === false ? 'AND status=\'approved\'' : ''
	}
}

/**
 * Retrieves all the articles with data containing the keyphrase.
 *
 * @async
 * @param {string} keyphrase - Phrase containing all the desired words.
 * @param {boolean} showHidden - Flag for filtering articles by status.
 * @returns {object[]} Articles with matching content.
 */
const find = async function(keyphrase, showHidden=false) {
	try {
		// Parse and validate arguments for query compatibility.
		keyphrase = parsed.keyphrase(keyphrase)
		showHidden = parsed.showHidden(showHidden)
		// Search indexed list of article words.
		const sql = `SELECT id, author_id, created_at, status, data FROM article
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

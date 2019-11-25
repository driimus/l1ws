
'use strict'

/**
 * Checks whether an Article object has all the required fields.
 * @memberof Article.prototype
 *
 * @async
 * @param {object} article - The article object to check.
 * @returns {boolean} Whether the article is valid or not.
 */
const isValid = async(article) => {
	try {
		// List of required article fields.
		const required = ['headline', 'summary', 'thumbnail', 'content']
		required.forEach(section => {
			const missing = !article.hasOwnProperty(section) || article[section] === undefined
			// Field must exist and not be empty.
			if( missing || article[section].length === 0) throw new Error(`missing article ${section}`)
		})
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.isValid = isValid

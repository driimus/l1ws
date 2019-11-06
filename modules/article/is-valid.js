
'use strict'

/**
 * Checks whether an Article object has all the required fields.
 *
 * @param {object} article - The article object to check.
 * @async
 * @returns {boolean} Whether the article is valid or not.
 */
const isValid = async(article) => {
	try {
		// List of required article fields.
		const required = ['headline', 'summary', 'thumbnail', 'content']
		required.forEach(section => {
			// Field must exist and not be empty.
			if(!article.hasOwnProperty(section) || article[section].length === 0)
				throw new Error(`missing article ${section}`)
		})
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.isValid = isValid

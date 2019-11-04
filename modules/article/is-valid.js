
'use strict'

const isValid = async(article) => {
	try {
		const required = ['headline', 'summary', 'thumbnail', 'content']
		required.forEach(section => {
			if(!article.hasOwnProperty(section) || article[section].length === 0)
				throw new Error(`missing article ${section}`)
		})
		return true
	} catch(err) {
		throw err
	}
}
module.exports = Article => Article.prototype.isValid = isValid

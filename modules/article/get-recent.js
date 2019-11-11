
'use strict'

/**
 * Retrieves all the articles in reverse chronological order.
 *
 * @param {boolean} showHidden - Flag for filtering articles by status.
 * @async
 * @returns {Array} List of the requested articles as objects.
 */
const getRecent = async function(showHidden=false) {
	throw new Error('fn not implemented')
}

module.exports = Article => Article.prototype.getRecent = getRecent

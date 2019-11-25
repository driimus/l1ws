
'use strict'

/**
 * Compares two user IDs for equality.
 * @memberof Article.prototype
 *
 * @async
 * @param {number} thisId - The ID to compare.
 * @param {number} thatId - The ID to compare against.
 * @returns {boolean} If the two IDs match.
 */
const byAuthor = async(thisId, thatId) => {
	// Convert to number and compare.
	if(+thisId !== +thatId) throw new Error(`user with ID "${thisId}" is not the author`)
	return true
}

module.exports = Article => Article.prototype.byAuthor = byAuthor

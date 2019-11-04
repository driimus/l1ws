
'use strict'

const getAll = async function() {
	// TO-DO: implement pagination
	const sql = 'SELECT * FROM article ORDER BY created_at DESC'
	const {rows} = await this.db.query(sql)
	return rows
}

module.exports = Article => Article.prototype.getAll = getAll


'use strict'

const db = require('../../db')

// Database schema holding the artilce table.
const schema = {
	development: 'public',
	production: 'public',
	test: 'pg_temp'
}

/** Class representing an article. */
class Article {

	/**
	 * Create a database connection and initialise a new table if needed.
	 */
	constructor() {
		return (async() => {
			this.db = new db()
			await this.db.query(Article.schema)
			await this.db.query(Article.upgrades)
			await this.db.query(Article.trigger(schema[process.env.NODE_ENV]))
			return this
		})()
	}

}

/* Barebones article schema.
 * @memberof Article
 * @static
 */
Article.schema = `CREATE TABLE IF NOT EXISTS article (
	id SERIAL PRIMARY KEY,
	author_id INTEGER,
	data JSON NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now());`

/* Article schema upgrades.
 * @memberof Article
 * @static
 */
Article.upgrades = `ALTER TABLE article
	ADD COLUMN IF NOT EXISTS searchable_indices TSVECTOR,
	ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'
		CHECK (status in ('pending','approved','rejected'));
	UPDATE article SET searchable_indices = to_tsvector(\'english\', data)
		WHERE searchable_indices IS NULL;
	CREATE INDEX IF NOT EXISTS searchable_idx ON article USING GIN(searchable_indices);`

/* Trigger that updates searchable indices for new and edited articles.
 * @memberof Article
 * @static
 */
Article.trigger = schema => `CREATE OR REPLACE FUNCTION ${schema}.indices_update_trigger()
	RETURNS TRIGGER AS $$
	BEGIN
		NEW.searchable_indices := to_tsvector('english', NEW.data);
		RETURN NEW;
	END;
	$$ LANGUAGE plpgsql;
	DROP TRIGGER IF EXISTS tsvectorupdate ON article;
	CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
	ON article FOR EACH ROW EXECUTE PROCEDURE ${schema}.indices_update_trigger();`

// Extend base class with custom functions.
require('./add')(Article)
require('./find')(Article)
require('./get')(Article)
require('./get-all')(Article)
require('./get-recent')(Article)
require('./get-status')(Article)
require('./set-status')(Article)
require('./is-valid')(Article)
require('./upload-picture')(Article)
require('./update')(Article)
require('./by-author')(Article)

module.exports = Article

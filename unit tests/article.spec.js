
'use strict'

const Articles = require('../modules/article')

beforeEach(async done => {
	this.article = await new Articles()
	done()
})

afterEach(async done => {
	this.article.db.end()
	done()
})

describe('add()', () => {

	test('add a valid article', async done => {
		expect.assertions(1)
		const uId = 1
		const added = await this.article.add(uId, {
			headline: 'Test article title',
			summary: 'Test article summary that is reasonably short',
			thumbnail: 'mockdir/fixtures/some.png',
			content: `Test article body. All the multi-line content
			goes here, with no minimum character count.`
		})
		expect(added).toBe(true)
		done()
	})

})

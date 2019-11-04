
'use strict'

const Articles = require('../modules/article')

const dummy = {
	headline: 'Test article title',
	summary: 'Test article summary that is reasonably short',
	thumbnail: 'mockdir/fixtures/some.png',
	content: `Test article body. All the multi-line content
	goes here, with no minimum character count.`
}

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
		const added = await this.article.add(1, dummy)
		expect(added).toBe(true)
		done()
	})

	test('error if missing userId', async done => {
		expect.assertions(1)
		const uId = undefined
		await expect( this.article.add(uId, dummy) )
			.rejects.toEqual( Error(`missing user ID ${uId}`) )
		done()
	})

	test('error if blank article headline', async done => {
		expect.assertions(1)
		// Article object with no headline.
		const {summary, thumbnail, content} = dummy
		await expect( this.article.add(1, {summary, thumbnail, content, headline: ''}) )
			.rejects.toEqual( Error('missing article headline') )
		done()
	})

	test('error if blank article summary', async done => {
		expect.assertions(1)
		// Article object with no summary.
		const { headline, thumbnail, content } = dummy
		await expect( this.article.add(1, {headline, thumbnail, content, summary: ''}) )
			.rejects.toEqual( Error('missing article summary') )
		done()
	})

	test('error if blank article thumbnail', async done => {
		expect.assertions(1)
		// Article object with no summary.
		const { headline, summary, content } = dummy
		await expect( this.article.add(1, {headline, summary, content, thumbnail: ''}) )
			.rejects.toEqual( Error('missing article thumbnail') )
		done()
	})

	test('error if blank article content', async done => {
		expect.assertions(1)
		// Article object with no content.
		const { headline, summary, thumbnail } = dummy
		await expect( this.article.add(1, {headline, summary, thumbnail, content: ''}) )
			.rejects.toEqual( Error('missing article content') )
		done()
	})

})

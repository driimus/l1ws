
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

	test('error if missing userId', async done => {
		expect.assertions(1)
		const dummy = {
			headline: 'Test article title',
			summary: 'Test article summary that is reasonably short',
			thumbnail: 'mockdir/fixtures/some.png',
			content: `Test article body. All the multi-line content
			goes here, with no minimum character count.`
		}
		const uId = undefined
		await expect( this.article.add(uId, dummy) )
			.rejects.toEqual( Error(`missing user ID ${uId}`) )
		done()
	})

	test('error if blank article headline', async done => {
		expect.assertions(1)
		const dummy = {
			// no headline
			summary: 'Test article summary that is reasonably short',
			thumbnail: 'mockdir/fixtures/some.png',
			content: `Test article body. All the multi-line content
			goes here, with no minimum character count.`
		}
		await expect( this.article.add(1, dummy) )
			.rejects.toEqual( Error('missing article headline') )
		done()
	})

})

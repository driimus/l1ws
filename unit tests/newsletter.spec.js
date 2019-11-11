'use strict'

const Newsletters = require('../modules/newsletter')

// valid article template to be used
const dummy = {
	headline: 'Test article title',
	summary: 'Test article summary that is reasonably short'
}

beforeEach(async done => {
	this.newsletter = await new Newsletters()
	done()
})

describe('send()', () => {

	test('send newsletter to recipients', async done => {
		expect.assertions(1)
		const recipients = ['this@test.com', 'test@test.com']
		const sent = await this.newsletter.send(recipients, [dummy])
		expect(sent).toBe(true)
		done()
	})

	test('no newsletter recipients', async done => {
		expect.assertions(2)
		const recipients = 'not recipients'
		await expect( this.newsletter.send(recipients, [dummy]) )
			.rejects.toEqual( Error('no valid email recipients found') )
		await expect( this.newsletter.send([], [dummy]) )
			.rejects.toEqual( Error('no valid email recipients found') )
		done()
	})

	test('send newsletter with some valid recipients', async done => {
		expect.assertions(1)
		const recipients = ['this@test.com', 2]
		const sent = await this.newsletter.send(recipients, [dummy])
		expect(sent).toBe(true)
		done()
	})

	test('send newsletter with some valid articles', async done => {
		expect.assertions(1)
		const recipients = ['this@test.com', 2]
		const {headline: invalidArticle} = dummy
		const sent = await this.newsletter.send(recipients, [dummy, {invalidArticle}])
		expect(sent).toBe(true)
		done()
	})

	test('send newsletter with invalid recipients', async done => {
		expect.assertions(1)
		const recipients = [1, 2]
		await expect( this.newsletter.send(recipients, [dummy]) )
			.rejects.toEqual( Error('no valid email recipients found') )
		done()
	})

	test('no newsletter articles', async done => {
		expect.assertions(1)
		const recipients = ['this@test.com', 2]
		await expect( this.newsletter.send(recipients, []) )
			.rejects.toEqual( Error('no articles to send via newsletter') )
		done()
	})

	test('no valid newsletter articles', async done => {
		expect.assertions(1)
		const recipients = ['this@test.com', 2]
		const {headline: invalidArticle} = dummy
		await expect( this.newsletter.send(recipients, [{invalidArticle}]) )
			.rejects.toEqual( Error('no articles to send via newsletter') )
		done()
	})

	test('articles is not an array', async done => {
		expect.assertions(1)
		const recipients = ['this@test.com', 2]
		await expect( this.newsletter.send(recipients, 'not array') )
			.rejects.toEqual( Error('no articles to send via newsletter') )
		done()
	})

})

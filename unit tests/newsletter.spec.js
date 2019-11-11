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

})

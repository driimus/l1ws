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

afterEach(async done => {
	this.newsletter.db.end()
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

})

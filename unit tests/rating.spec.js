
'use strict'

const Rating = require('../modules/rating')

beforeEach(async done => {
	this.rating = await new Rating()
	done()
})

afterEach(async done => {
	this.rating.db.end()
	done()
})

describe('addOrUpdate()', () => {

	test('create a new article rating', async done => {
		expect.assertions(1)
		const created = await this.rating.addOrUpdate(1, 1, 5)
		expect(created).toBe(true)
		done()
	})

	test('update an existing article rating', async done => {
		expect.assertions(1)
		await this.rating.addOrUpdate(1, 1, 5)
		// Change the rating to 1.
		const updated = await this.rating.addOrUpdate(1, 1, 1)
		expect(updated).toBe(true)
		done()
	})

})

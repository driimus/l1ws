
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
		const result = await this.rating.addOrUpdate(1, 1, 5)
		expect(result).toBe(true)
		done()
	})

})

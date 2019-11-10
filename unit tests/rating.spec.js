
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

	test('invalid article rating value', async done => {
		expect.assertions(1)
		const value = 50
		await expect( this.rating.addOrUpdate(1, 1, value) )
			.rejects.toEqual( Error(`invalid rating value: ${value}`) )
		done()
	})

	test('non-numeric rating value', async done => {
		expect.assertions(1)
		const value = 'a'
		await expect( this.rating.addOrUpdate(1, 1, value) )
			.rejects.toEqual( Error('rating value "a" is not a number') )
		done()
	})

	test('error if invalid user ID', async done => {
		expect.assertions(1)
		await expect( this.rating.addOrUpdate('horse', 1, 5) )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

})

'use strict'

const utils = require('../modules/utils')

describe('isId()', () => {

	test('convert an inexistent model ID', async done => {
		expect.assertions(1)
		await expect( utils.isId(1, 'movies') )
			.rejects.toEqual( Error('model "movies" does not exist') )
		done()
	})

	test('convert a valid article ID', async done => {
		expect.assertions(1)
		const id = '3'
		const isValid = await utils.isId(id, 'article')
		expect(isValid).toBe(3)
		done()
	})

	test('convert a valid user ID', async done => {
		expect.assertions(1)
		const id = '3'
		const isValid = await utils.isId(id, 'user')
		expect(isValid).toBe(3)
		done()
	})

	test('convert a valid rating ID', async done => {
		expect.assertions(1)
		const id = '3'
		const isValid = await utils.isId(id, 'rating')
		expect(isValid).toBe(3)
		done()
	})

	test('error if missing ID', async done => {
		expect.assertions(1)
		const id = undefined
		await expect( utils.isId(id, 'user') )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

	test('error if ID is non-numeric', async done => {
		expect.assertions(1)
		const id = 'horse'
		await expect( utils.isId(id, 'article') )
			.rejects.toEqual( Error('invalid article ID') )
		done()
	})

	test('error if ID is negative', async done => {
		expect.assertions(1)
		const id = -5
		await expect( utils.isId(id, 'article') )
			.rejects.toEqual( Error('invalid article ID') )
		done()
	})

	test('error if ID is null', async done => {
		expect.assertions(1)
		const id = 0
		await expect( utils.isId(id, 'article') )
			.rejects.toEqual( Error('invalid article ID') )
		done()
	})

})

describe('isInt()', () => {

	test('convert a valid article ID', async done => {
		expect.assertions(1)
		const id = '3'
		const isValid = await utils.isInt(id, 'article')
		expect(isValid).toBe(3)
		done()
	})

	test('convert a valid float article ID', async done => {
		expect.assertions(1)
		const id = 3.54363
		const isValid = await utils.isInt(id, 'article')
		expect(isValid).toBe(3)
		done()
	})

	test('error if missing ID', async done => {
		expect.assertions(1)
		const id = undefined
		await expect( utils.isInt(id, 'user ID') )
			.rejects.toEqual( Error('user ID value "undefined" is not a number') )
		done()
	})

	test('error if ID is non-numeric', async done => {
		expect.assertions(1)
		const id = 'horse'
		await expect( utils.isInt(id, 'article ID') )
			.rejects.toEqual( Error('article ID value "horse" is not a number') )
		done()
	})

	test('error if ID is negative', async done => {
		expect.assertions(1)
		const id = -5
		await expect( utils.isInt(id, 'article ID') )
			.rejects.toEqual( Error('number "-5" is not positive') )
		done()
	})

	test('error if ID is null', async done => {
		expect.assertions(1)
		const id = 0
		await expect( utils.isInt(id, 'rating') )
			.rejects.toEqual( Error('number "0" is not positive') )
		done()
	})

})

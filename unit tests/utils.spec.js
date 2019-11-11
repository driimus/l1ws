'use strict'

const utils = require('../modules/utils')

describe('isId()', () => {

	test('convert a valid article ID', async done => {
		const id = '3'
		const isValid = await utils.isId(id, 'article')
		expect(isValid).toBe(3)
		done()
	})

	test('error if missing ID', async done => {
		const id = undefined
		await expect( utils.isId(id, 'user') )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

	test('error if ID is non-numeric', async done => {
		const id = 'horse'
		await expect( utils.isId(id, 'article') )
			.rejects.toEqual( Error('invalid article ID') )
		done()
	})

})

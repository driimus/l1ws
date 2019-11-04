
'use strict'

const Accounts = require('../modules/user.js')

beforeEach(async done => {
	this.account = await new Accounts()
	done()
})

afterEach(async done => {
	this.account.db.end()
	done()
})

describe('register()', () => {

	test('register a valid account', async done => {
		expect.assertions(1)
		const register = await this.account.register('doej', 'password')
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const [user, pass] = ['doej', 'password']
		await this.account.register(user, pass)
		await expect( this.account.register(user, pass) )
			.rejects.toEqual( Error(`username "${user}" already in use`) )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		await expect( this.account.register('', 'password') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		await expect( this.account.register('doej', '') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

})

describe('uploadPicture()', () => {
	// this would have to be done by mocking the file system
	// perhaps using mock-fs?
})

describe('login()', () => {

	test('log in with valid credentials', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password')
		const uId = await this.account.login('doej', 'password')
		expect(uId).toBe(1)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password')
		await expect( this.account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password')
		await expect( this.account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})


'use strict'


const Accounts = require('../modules/user.js')

const mock = require('mock-fs')
const fs = require('fs')

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
	test('upload a valid PNG picture', async done => {
		expect.assertions(1)
		const [user, pass] = ['doej', 'password']
		const exp = `public/avatars/${user}.png`
		await this.account.register(user, pass)
		const image = {path: 'mockdir/fixtures/some.png', type: 'image/png'}
		await mock({
			'mockdir': {
				'fixtures': {
					'some.png': Buffer.from([1, 1, 2, 3, 5, 8, 13])
				}
			}
		})
		await this.account.uploadPicture(user, image)
		expect(fs.existsSync(exp)).toBe(true)
		await mock.restore()
		done()
	})

	test('error if file is not an image', async done => {
		expect.assertions(1)
		const [user, pass] = ['doej', 'password']
		await this.account.register(user, pass)
		const soundFile = {path: 'mockdir/fixtures/some', type: 'audio/x-wav'}
		await mock({
			'mockdir': {
				'fixtures': {
					'some.wav': Buffer.from([1, 1, 2, 3, 5, 8, 13])
				}
			}
		})
		await expect( this.account.uploadPicture(user, soundFile) )
			.rejects.toEqual( Error('invalid image MIME type') )
		await mock.restore()
		done()
	})

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

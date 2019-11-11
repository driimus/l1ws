
'use strict'


const Accounts = require('../modules/user')

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

describe('isAdmin()', () => {

	test('account has admin status', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password')
		// Manually promote user to admin.
		await this.account.db.query('update users set is_admin=true where username=\'doej\'')
		const isAdmin = await this.account.isAdmin('doej')
		expect(isAdmin).toBe(true)
		done()
	})

	test('normal user is not an admin', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password')
		const admin = await this.account.isAdmin('doej')
		expect(admin).toBe(false)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const user = 'doej'
		await expect( this.account.isAdmin(user) )
			.rejects.toEqual( Error(`username "${user}" not found`) )
		done()
	})

	test('guest is not an admin', async done => {
		expect.assertions(1)
		const admin = await this.account.isAdmin()
		expect(admin).toBe(false)
		done()
	})

})

describe('getAdmin()', () => {

	test('account has admin status', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password')
		// Manually promote user to admin.
		await this.account.db.query('update users set is_admin=true where username=\'doej\'')
		const isAdmin = await this.account.getAdmin('doej')
		expect(isAdmin).toBe(true)
		done()
	})

	test('error if account is not admin', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password')
		await expect( this.account.getAdmin('doej') )
			.rejects.toEqual( Error('user "doej" is not an admin') )
		done()
	})

})

describe('setAdmin()', () => {

	test('flag user as admin by admin', async done => {
		expect.assertions(1)
		// Add dummy admin.
		const dummy = 'INSERT INTO users(username,password,is_admin) values(\'doej\',\'pass\',true)'
		await this.account.db.query(dummy)
		// Promote user to admin from admin account.
		await this.account.register('roej', 'password')
		const flagged = await this.account.setAdmin('doej', 'roej', true)
		expect(flagged).toBe(true)
		done()
	})

	test('error if flag is done by user', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password')
		await this.account.register('roej', 'password')
		await expect( this.account.setAdmin('doej', 'roej', true) )
			.rejects.toEqual( Error('user "doej" is not an admin') )
		done()
	})

	test('error if blank target username', async done => {
		expect.assertions(1)
		// Add dummy admin.
		const dummy = 'INSERT INTO users(username,password,is_admin) values(\'doej\',\'pass\',true)'
		await this.account.db.query(dummy)
		// Try to promote blank username.
		await expect( this.account.setAdmin('doej', '') )
			.rejects.toEqual( Error('missing target username') )
		done()
	})

	test('error if invalid user status', async done => {
		expect.assertions(1)
		// Add dummy admin.
		const dummy = 'INSERT INTO users(username,password,is_admin) values(\'doej\',\'pass\',true)'
		await this.account.db.query(dummy)
		// Try to promote username to invalid status.
		await expect( this.account.setAdmin('doej', 'roej', 'rocket scientist') )
			.rejects.toEqual( Error('invalid toAdmin value: "rocket scientist"') )
		done()
	})

	test('error if inexistent username', async done => {
		expect.assertions(1)
		// Add dummy admin.
		const dummy = 'INSERT INTO users(username,password,is_admin) values(\'doej\',\'pass\',true)'
		await this.account.db.query(dummy)
		// Try to promote inexistent user.
		await expect( this.account.setAdmin('doej', 'roej') )
			.rejects.toEqual( Error('target username "roej" not found') )
		done()
	})

})

describe('setEmail()', () => {

	test('set valid user email', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password')
		const updated = await this.account.setEmail(1, 'this@test.com')
		expect(updated).toBe(true)
		done()
	})

	test('error if user does not exist', async done => {
		expect.assertions(1)
		await expect( this.account.setEmail(1, 'this@test.com') )
			.rejects.toEqual( Error('user with ID "1" not found') )
		done()
	})

	test('error if invalid user id', async done => {
		expect.assertions(1)
		await expect( this.account.setEmail('horse', 'this@test.com') )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

})

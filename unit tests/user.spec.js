
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
		const id = await this.account.register('doej', 'password', 'doej@test.com')
		expect(id).toBe(1)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const [user, pass] = ['doej', 'password']
		await this.account.register(user, pass, 'doej@test.com')
		await expect( this.account.register(user, pass, 'roej@test.com') )
			.rejects.toEqual( Error(`username "${user}" already in use`) )
		done()
	})

	test('register a duplicate email', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'secretpass', 'doej@test.com')
		await expect( this.account.register('resterino', 'secretpass', 'doej@test.com') )
			.rejects.toEqual( Error('email "doej@test.com" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		await expect( this.account.register('', 'password', 'doej@test.com') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		await expect( this.account.register('doej', '', 'doej@test.com') )
			.rejects.toEqual( Error('missing password') )
		done()
	})

})

describe('isAvailable()', () => {

	test('available account username', async done => {
		expect.assertions(1)
		const available = await this.account.isAvailable('username', 'doej')
		expect(available).toBe(true)
		done()
	})

	test('duplicate account username', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await expect( this.account.isAvailable('username', 'doej') )
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('available account email', async done => {
		expect.assertions(1)
		const available = await this.account.isAvailable('email', 'doej@test.com')
		expect(available).toBe(true)
		done()
	})

	test('available own account email', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		const available = await this.account.isAvailable('email', 'doej@test.com', 1)
		expect(available).toBe(true)
		done()
	})

	test('duplicate email address', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await expect( this.account.isAvailable('email', 'doej@test.com') )
			.rejects.toEqual( Error('email "doej@test.com" already in use') )
		done()
	})

	test('invalid field', async done => {
		expect.assertions(1)
		// try to check an invalid attribute
		await expect( this.account.isAvailable('*', 'doej@test.com') )
			.rejects.toEqual( Error('invalid field "*"') )
		done()
	})

	test('error if missing username', async done => {
		expect.assertions(1)
		// try to check an invalid attribute
		await expect( this.account.isAvailable('username', '') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if invalid email', async done => {
		expect.assertions(1)
		// try to check an invalid attribute
		await expect( this.account.isAvailable('email', '') )
			.rejects.toEqual( Error('invalid email address format') )
		done()
	})

	test('error if invalid user id', async done => {
		expect.assertions(1)
		await expect( this.account.isAvailable('email', 'doej@test.com', 'not an iD') )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

})

describe('setAvatar()', () => {
	test('upload a valid PNG picture', async done => {
		expect.assertions(2)
		const [user, pass] = ['doej', 'password']
		const exp = `public/avatars/${user}.png`
		await this.account.register(user, pass, 'doej@test.com')
		const image = {path: 'mockdir/fixtures/some.png', type: 'image/png'}
		await mock({
			'mockdir': {
				'fixtures': {
					'some.png': Buffer.from([1, 1, 2, 3, 5, 8, 13])
				}
			}
		})
		const updated = await this.account.setAvatar(user, image)
		expect(updated).toBe(true)
		expect(fs.existsSync(exp)).toBe(true)
		await mock.restore()
		done()
	})

	test('error if file is not an image', async done => {
		expect.assertions(1)
		const [user, pass] = ['doej', 'password']
		await this.account.register(user, pass, 'doej@test.com')
		const soundFile = {path: 'mockdir/fixtures/some', type: 'audio/x-wav'}
		await mock({
			'mockdir': {
				'fixtures': {
					'some.wav': Buffer.from([1, 1, 2, 3, 5, 8, 13])
				}
			}
		})
		await expect( this.account.setAvatar(user, soundFile) )
			.rejects.toEqual( Error('invalid image MIME type') )
		await mock.restore()
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		await expect( this.account.setAvatar('roej', 'some/random/file.png') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

})

describe('login()', () => {

	test('log in with valid credentials', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		const uId = await this.account.login('doej', 'password')
		expect(uId).toBe(1)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await expect( this.account.login('roej', 'password') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await expect( this.account.login('doej', 'bad') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})

})

describe('isAdmin()', () => {

	test('account has admin status', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		// Manually promote user to admin.
		await this.account.db.query('update users set is_admin=true where username=\'doej\'')
		const isAdmin = await this.account.isAdmin('doej')
		expect(isAdmin).toBe(true)
		done()
	})

	test('normal user is not an admin', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
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
		await this.account.register('doej', 'password', 'doej@test.com')
		// Manually promote user to admin.
		await this.account.db.query('update users set is_admin=true where username=\'doej\'')
		const isAdmin = await this.account.getAdmin('doej')
		expect(isAdmin).toBe(true)
		done()
	})

	test('error if account is not admin', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
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
		await this.account.register('roej', 'password', 'roej@test.com')
		const flagged = await this.account.setAdmin('doej', 'roej', true)
		expect(flagged).toBe(true)
		done()
	})

	test('error if flag is done by user', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await this.account.register('roej', 'password', 'roej@test.com')
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
		await this.account.register('doej', 'password', 'doej@test.com')
		const updated = await this.account.setEmail(1, 'this@test.com')
		expect(updated).toBe(true)
		done()
	})

	test('set same user email', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		const updated = await this.account.setEmail(1, 'doej@test.com')
		expect(updated).toBe(true)
		done()
	})

	test('error if address is invalid', async done => {
		expect.assertions(1)
		await expect( this.account.setEmail(1, 'not@valid@mail.:addr') )
			.rejects.toEqual( Error('invalid email address format') )
		done()
	})

	test('error if missing email address', async done => {
		expect.assertions(1)
		await expect( this.account.setEmail(1, '') )
			.rejects.toEqual( Error('invalid email address format') )
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

describe('getEmail()', () => {

	test('get valid user email', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await this.account.db.query('UPDATE users SET email=\'this@test.com\' where username=\'doej\'')
		const email = await this.account.getEmail(1)
		expect(email).toBe('this@test.com')
		done()
	})

	test('error if user does not exist', async done => {
		expect.assertions(1)
		await expect( this.account.getEmail(1) )
			.rejects.toEqual( Error('user with ID "1" not found') )
		done()
	})

	test('error if invalid user id', async done => {
		expect.assertions(1)
		await expect( this.account.getEmail('horse') )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

})

describe('setSubscription()', () => {

	test('subscribe user to emails', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		const subscribed = await this.account.setSubscription(1, true)
		expect(subscribed).toBe(true)
		done()
	})

	test('unsubscribe user from emails', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		// new status is false by default
		const subscribed = await this.account.setSubscription(1)
		expect(subscribed).toBe(true)
		done()
	})

	test('error if user does not exist', async done => {
		expect.assertions(1)
		await expect( this.account.setSubscription(1, true) )
			.rejects.toEqual( Error('user with ID "1" not found') )
		done()
	})

	test('error if invalid user id', async done => {
		expect.assertions(1)
		await expect( this.account.setSubscription('horse', true) )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

	test('error if status is not boolean', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await expect( this.account.setSubscription(1, 'such boolean') )
			.rejects.toEqual( Error('invalid status value: "such boolean"') )
		done()
	})

})

describe('getSubscription()', () => {

	test('get subscribed user status', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await this.account.setSubscription(1, true)
		const status = await this.account.getSubscription(1)
		expect(status).toBe(true)
		done()
	})

	test('get default user status', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		const status = await this.account.getSubscription(1)
		expect(status).toBe(false)
		done()
	})

	test('get unsubscribed user status', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await this.account.setSubscription(1, false)
		const status = await this.account.getSubscription(1)
		expect(status).toBe(false)
		done()
	})

	test('error if user does not exist', async done => {
		expect.assertions(1)
		await expect( this.account.getSubscription(1) )
			.rejects.toEqual( Error('user with ID "1" not found') )
		done()
	})

	test('error if invalid user id', async done => {
		expect.assertions(1)
		await expect( this.account.getSubscription('horse') )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

})

describe('getMailingList()', () => {

	test('get list of newsletter recipients', async done => {
		expect.assertions(2)
		// Add a subscribed and unsubscribed user.
		await this.account.register('doej', 'password', 'doej@test.com')
		await this.account.setEmail(1, 'valid@test.com')
		await this.account.setSubscription(1, true)
		await this.account.register('roej', 'password', 'roej@test.com')
		const recipients = await this.account.getMailingList()
		expect(recipients.length).toBe(1)
		expect(recipients[0]).toBe('valid@test.com')
		done()
	})

	test('error if no users are subscribed', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'roej@test.com')
		await this.account.setEmail(1, 'valid@test.com')
		await expect( this.account.getMailingList() )
			.rejects.toEqual( Error('no subscriber emails found'))
		done()
	})

})

describe('getAvatar()', () => {

	test('get default user avatar', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		const avi = await this.account.getAvatar(1)
		expect(avi).toBe('/avatars/avatar.png')
		done()
	})

	test('get custom user avatar', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		await this.account.db.query('UPDATE users set avatar=\'/avatars/doej.png\' WHERE id=1')
		const avi = await this.account.getAvatar(1)
		expect(avi).toBe('/avatars/doej.png')
		done()
	})

	test('error if user does not exist', async done => {
		expect.assertions(1)
		await expect( this.account.getAvatar(1) )
			.rejects.toEqual( Error('user with ID "1" not found') )
		done()
	})

	test('error if invalid user id', async done => {
		expect.assertions(1)
		await expect( this.account.getAvatar('horse') )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

})

describe('getUsername()', () => {

	test('get valid account username', async done => {
		expect.assertions(1)
		await this.account.register('doej', 'password', 'doej@test.com')
		const uname = await this.account.getUsername(1)
		expect(uname).toBe('doej')
		done()
	})

	test('error if user does not exist', async done => {
		expect.assertions(1)
		await expect( this.account.getUsername(1) )
			.rejects.toEqual( Error('user with ID "1" not found') )
		done()
	})

	test('error if invalid user id', async done => {
		expect.assertions(1)
		await expect( this.account.getUsername('horse') )
			.rejects.toEqual( Error('invalid user ID') )
		done()
	})

})

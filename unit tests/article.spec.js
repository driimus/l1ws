
'use strict'

const mock = require('mock-fs')
const fs = require('fs')

const Articles = require('../modules/article')

const dummy = {
	headline: 'Test article title',
	summary: 'Test article summary that is reasonably short',
	thumbnail: 'mockdir/fixtures/some.png',
	content: `Test article body. All the multi-line content
	goes here, with no minimum character count.`
}

beforeEach(async done => {
	this.article = await new Articles()
	done()
})

afterEach(async done => {
	this.article.db.end()
	done()
})

describe('add()', () => {

	test('add a valid article', async done => {
		expect.assertions(1)
		const added = await this.article.add(1, dummy)
		expect(added).toBe(true)
		done()
	})

	test('error if missing userId', async done => {
		expect.assertions(1)
		const uId = undefined
		await expect( this.article.add(uId, dummy) )
			.rejects.toEqual( Error(`missing user ID ${uId}`) )
		done()
	})

	test('error if blank article headline', async done => {
		expect.assertions(1)
		// Article object with no headline.
		const {summary, thumbnail, content} = dummy
		await expect( this.article.add(1, {summary, thumbnail, content, headline: ''}) )
			.rejects.toEqual( Error('missing article headline') )
		done()
	})

	test('error if blank article summary', async done => {
		expect.assertions(1)
		// Article object with no summary.
		const { headline, thumbnail, content } = dummy
		await expect( this.article.add(1, {headline, thumbnail, content, summary: ''}) )
			.rejects.toEqual( Error('missing article summary') )
		done()
	})

	test('error if blank article thumbnail', async done => {
		expect.assertions(1)
		// Article object with no summary.
		const { headline, summary, content } = dummy
		await expect( this.article.add(1, {headline, summary, content, thumbnail: ''}) )
			.rejects.toEqual( Error('missing article thumbnail') )
		done()
	})

	test('error if blank article content', async done => {
		expect.assertions(1)
		// Article object with no content.
		const { headline, summary, thumbnail } = dummy
		await expect( this.article.add(1, {headline, summary, thumbnail, content: ''}) )
			.rejects.toEqual( Error('missing article content') )
		done()
	})

})

describe('uploadPicture()', () => {

	test('upload a valid article picture', async done => {
		expect.assertions(2)
		const picture = {path: 'mockdir/fixtures/some', type: 'image/png'}
		const exp = 'public/uploads/some.png'
		await mock({
			'mockdir': {
				'fixtures': {
					'some': Buffer.from([1, 1, 2, 3, 5, 8, 13])
				}
			}
		})
		const path = await this.article.uploadPicture(picture)
		// Check the relative path.
		expect(`public/${path}`).toEqual(exp)
		// Check that the 'file' is there.
		expect(fs.existsSync(exp)).toBe(true)
		await mock.restore()
		done()
	})

	test('error if file is not an image', async done => {
		expect.assertions(1)
		const soundFile = {path: 'mockdir/fixtures/some', type: 'audio/x-wav'}
		await mock({
			'mockdir': {
				'fixtures': {
					'some': Buffer.from([1, 1, 2, 3, 5, 8, 13])
				}
			}
		})
		await expect( this.article.uploadPicture(soundFile) )
			.rejects.toEqual( Error('invalid image MIME type') )
		await mock.restore()
		done()
	})

})

describe('getAll()', () => {

	const mostRecent = {
		headline: 'Recent article title',
		summary: 'Recent article summary that is reasonably short',
		thumbnail: 'mockdir/fixtures/recent.png',
		content: `Recent article body. All the multi-line content
		that is definitely not copied from the dummy article goes here.`
	}

	test('get articles in reverse chronological order', async done => {
		expect.assertions(1)
		// Insert both articles.
		await this.article.add(1, dummy)
		await this.article.add(1, mostRecent)
		// Allow searching for unapproved articles.
		const showHidden = true
		const res = await this.article.getAll(showHidden)
		const dates = res.map((result) => new Date(result.created_at))
		// First result must be the newest.
		expect(dates[0] >= dates[1]).toBe(true)
		done()
	})

	test('get approved articles in reverse chronological order', async done => {
		expect.assertions(2)
		// Insert multiple articles.
		await this.article.add(1, dummy)
		await this.article.add(1, mostRecent)
		await this.article.add(1, dummy)
		// Only approve the last two articles.
		await this.article.setStatus(2, 'approved')
		await this.article.setStatus(3, 'approved')
		const res = await this.article.getAll()
		// There should only be two results.
		expect(res.length).toBe(2)
		// First result should be most recent.
		const dates = res.map((result) => new Date(result.created_at))
		expect(dates[0] >= dates[1]).toBe(true)
		done()
	})

	test('error if invalid showHidden flag', async done => {
		expect.assertions(1)
		await expect( this.article.getAll('veryBOolean') )
			.rejects.toEqual( Error('invalid showHidden value: "veryBOolean"') )
		done()
	})

	test('error if no published articles', async done => {
		expect.assertions(1)
		// Add no articles.
		await expect( this.article.getAll() )
			.rejects.toEqual( Error('found no published articles') )
		done()
	})

})

describe('get()', () => {

	test('get hidden article with existing ID', async done => {
		expect.assertions(1)
		// Add article that is 'pending' by default.
		await this.article.add(1, dummy)
		const showHidden = true
		const {data: res} = await this.article.get(1, showHidden)
		expect(res).toMatchObject(dummy)
		done()
	})

	test('get rejected article with existing ID', async done => {
		expect.assertions(1)
		// Add article that is 'pending' by default.
		await this.article.add(1, dummy)
		// Mark article as rejected.
		await this.article.setStatus(1, 'rejected')
		const showHidden = true
		const {data: res} = await this.article.get(1, showHidden)
		expect(res).toMatchObject(dummy)
		done()
	})

	test('get article with existing ID', async done => {
		expect.assertions(1)
		// Add article that is 'pending' by default.
		await this.article.add(1, dummy)
		// Mark article as approved.
		await this.article.setStatus(1, 'approved')
		// Retrieve approved article.
		const {data: res} = await this.article.get(1)
		// Check that the result has the same content as the dummy.
		expect(res).toMatchObject(dummy)
		done()
	})

	test('error if invalid showHidden flag', async done => {
		expect.assertions(1)
		await expect( this.article.get(1, 'veryBOolean') )
			.rejects.toEqual( Error('invalid showHidden value: "veryBOolean"') )
		done()
	})

	test('error if article is not approved', async done => {
		expect.assertions(1)
		// Add article that is 'pending' by default.
		await this.article.add(1, dummy)
		await expect( this.article.get(1) )
			.rejects.toEqual( Error('article with ID "1" not found') )
		done()
	})

	test('error if article is rejected', async done => {
		expect.assertions(1)
		// Add article that is 'pending' by default.
		await this.article.add(1, dummy)
		// Mark article as rejected.
		await this.article.setStatus(1, 'rejected')
		await expect( this.article.get(1) )
			.rejects.toEqual( Error('article with ID "1" not found') )
		done()
	})

	test('error if article ID is not numeric', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		await expect( this.article.get('horse') )
			.rejects.toEqual( Error('invalid article ID') )
		done()
	})

	test('error if article does not exist', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		// Mark article as approved.
		await this.article.setStatus(1, 'approved')
		const invalidId = 999
		await expect( this.article.get(invalidId) )
			.rejects.toEqual( Error(`article with ID "${invalidId}" not found`) )
		done()
	})

})

describe('getStatus()', () => {

	test('get pending article status', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		const status = await this.article.getStatus(1)
		expect(status).toBe('pending')
		done()
	})

	test('error if article does not exist', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		const invalidId = 999
		await expect( this.article.getStatus(invalidId) )
			.rejects.toEqual( Error(`article with ID "${invalidId}" not found`) )
		done()
	})

	test('error if article ID is not numeric', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		await expect( this.article.getStatus('horse') )
			.rejects.toEqual( Error('invalid article ID') )
		done()
	})

})

describe('setStatus()', () => {

	test('mark article as approved', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		const res = await this.article.setStatus(1, 'approved')
		expect(res).toBe(true)
		done()
	})

	test('mark article as pending', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		const res = await this.article.setStatus(1, 'pending')
		expect(res).toBe(true)
		done()
	})

	test('mark article as rejected', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		const res = await this.article.setStatus(1, 'rejected')
		expect(res).toBe(true)
		done()
	})

	test('error if invalid article status', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		const newStatus = 'sent into space'
		await expect( this.article.setStatus(1, newStatus) )
			.rejects.toEqual( Error(`new status "${newStatus}" is not allowed`) )
		done()
	})

	test('error if article does not exist', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		const invalidId = 999
		await expect( this.article.setStatus(invalidId, 'approved') )
			.rejects.toEqual( Error(`article with ID "${invalidId}" not found`) )
		done()
	})

	test('error if article ID is not numeric', async done => {
		expect.assertions(1)
		await this.article.add(1, dummy)
		await expect( this.article.setStatus('horse', 'approved') )
			.rejects.toEqual( Error('invalid article ID') )
		done()
	})

})

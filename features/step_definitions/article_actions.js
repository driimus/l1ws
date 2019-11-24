
'use strict'

const faker = require('faker')

const db = require('../../db')
const scope = require('../support/scope')
const pages = require('../support/pages')
const selectors = require('../support/selectors')
const {wait, visitPage, typeInput, pressButton} = require('./implementations')
const {login, loginAsAdmin, logout} = require('./user_actions')

const generateArticle = async title => {
	const article = {
		headline: title,
		summary: faker.lorem.sentence(),
		thumbnail: faker.image.imageUrl(),
		content: [
			faker.lorem.paragraph(),
			faker.image.imageUrl(),
			faker.lorem.paragraph()
		]
	}
	if(scope.context.articles) scope.context.articles.push(article)
	else scope.context.articles = [article]
	return article
}

const newArticle = async title => {
	await visitPage('new article')
	const {currentPage} = scope.context
	const article = await generateArticle(title)
	// Fill out article details
	await typeText(article.thumbnail, 'thumbnail')
	await typeInput(article.headline, 'headline')
	await typeInput(article.summary, 'summary')
	// Fill out article content
	await typeText(article.content[0], 'content')
	await currentPage.click('#add-image')
	await typeText(article.content[1], 'image')
	// await currentPage.waitForSelector('#confirm-btn')
	await wait(0.1)
	await currentPage.click('#confirm-btn', {clickCount: 2, delay: 5})
	// await pressButton('confirm')
	// await currentPage.click('#confirm-btn')
	// await currentPage.click('#add-content')
	// await typeText(article.content[2], 'content')
	await wait(0.1)
	await pressButton('Add article')
	// await pressButton('Add article')
}

const typeText = async(input, field) => {
	const {currentPage} = scope.context
	await currentPage.waitForSelector(selectors.fields[field])
	await currentPage.evaluate(field => {
		const elems = document.querySelectorAll(field.name)
		const e = elems[elems.length - 1]
		e.value = field.value
	}, {name: selectors.fields[field], value: input})
}

const approve = async title => {
	const pool = new db()
	await pool.query(`UPDATE article SET status='approved'`)
}

const newArticleByUser = async(status, title, username) => {
	const {accounts} = scope.context
	const user = accounts.find(acc => acc.username === username)
	await login(user)
	await newArticle(title)
	if(status === 'approved') await approve(title)
	await logout()
}

const newArticleByAdmin = async title => {
	await loginAsAdmin()
	await newArticle(title)
	await logout()
}

const newArticlesByAdmin = async count => {
	await loginAsAdmin()
	for(const a in count)
		await newArticle(faker.lorem.sentence())
	await logout()
}

const approveLatest = async() => {
	await loginAsAdmin()
	const {length} = scope.context.articles
	await visitArticle(pages.article(length))
	await pressButton('approved')
	await logout()
}

const visitArticle = async page => {
	const url = `${ scope.host }${ page }`
	const visit = await scope.context.currentPage.goto(url, {
		waitUntil: 'networkidle2'
	})
	return visit
}

const shouldSeeArticles = async count => {
	const {currentPage} = scope.context
	const results = await currentPage.$$('#articleCard')
	if (results.length !== count)
		throw new Error(`Page contains ${results.length} articles instead of ${count}`)
}

module.exports = {
	newArticle,
	newArticleByUser,
	newArticleByAdmin,
	newArticlesByAdmin,
	approveLatest,
	shouldSeeArticles
}


'use strict'

const db = require('../../db')
const scope = require('../support/scope')
const pages = require('../support/pages')
const selectors = require('../support/selectors')
const {
	wait,
	visitPage,
	typeInput,
	pressButton
} = require('./implementations')
const {login, loginAsAdmin, logout} = require('./user_actions')

const generateArticle = async title => {
	const article = {
		headline: title,
		summary: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
		thumbnail: 'https://w.wallhaven.cc/full/p8/wallhaven-p8gj8j.jpg',
		content: [
			'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.',
			'https://w.wallhaven.cc/full/13/wallhaven-13gom9.jpg',
			'Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.'
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
	await currentPage.waitForSelector('#confirm-btn', {visible: true})
	await currentPage.click('#confirm-btn', {clickCount: 2, delay: 5})
	await currentPage.waitForSelector('#confirm-btn', {visible: false})
	await wait(0.1)
	await pressButton('Add article')
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
		await newArticle('Lorem ipsum dolor sit amet, consectetuer adipiscing elit.')
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
	const {currentPage} = scope.context
	const url = `${ scope.host }${ page }`
	const visit = await currentPage.goto(url, {
		waitUntil: 'networkidle2'
	})
	return visit
}

const goToEdit = async() => {
	const {currentPage} = scope.context
	const url = `${ currentPage.url() }/edit`
	const visit = await currentPage.goto(url, {
		waitUntil: 'networkidle2'
	})
	return visit
}

const goToArticle = async() => {
	const {length} = scope.context.articles
	await visitArticle(pages.article(length))
}

const shouldSeeArticles = async count => {
	const {currentPage} = scope.context
	await wait(0.1)
	const results = await currentPage.$$('#articleCard')
	if (results.length !== count)
		throw new Error(`Page contains ${results.length} articles instead of ${count}`)
}

const editArticle = async field => {
	await pressButton('edit')
	const {currentPage} = scope.context
	await wait(0.3)
	await typeInput('So long ', 'summary')
	await wait(0.1)
	await pressButton('Add article')
}

const rateArticle = async value => {
	const {currentPage} = scope.context
	currentPage.on('dialog', async dialog => await dialog.dismiss())
	const stars = await currentPage.$$('.fa-star')
	const target = stars[5 - value]
	await target.click()
}

module.exports = {
	newArticle,
	editArticle,
	rateArticle,
	newArticleByUser,
	newArticleByAdmin,
	newArticlesByAdmin,
	approveLatest,
	goToArticle,
	goToEdit,
	shouldSeeArticles
}

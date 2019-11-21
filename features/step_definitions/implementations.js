
'use strict'

const pages = require('../support/pages')
const errors = require('../support/errors')
const {buttons, links} = require('../support/selectors')
const scope = require('../support/scope')

const delay = duration => new Promise(resolve => setTimeout(resolve, duration))

const wait = async seconds => {
	const sec = 1000, time = parseFloat(seconds) * sec
	await delay(time)
}

const visitPage = async page => {
	if (scope.browser === undefined)
		scope.browser = await scope.driver.launch({
			args: ['--disable-dev-shm-usage'],
			headless: true,
			slowMo: 40
		})
	scope.context.currentPage = await scope.browser.newPage()
	// Use native viewport size for the Chromebook.
	scope.context.currentPage.setViewport( {width: 1366, height: 768} )
	const url = `${ scope.host }${ pages[page] }`
	const visit = await scope.context.currentPage.goto(url, {
		waitUntil: 'networkidle2'
	})
	return visit
}

const shouldSeeText = async text => {
	const {currentPage} = scope.context
	const content = await currentPage.content()
	if (content.includes(text) === false)
		throw new Error(`Page does not contain text: "${text}"`)
}

const shouldSeeError = async text => {
	const {currentPage} = scope.context
	const content = await currentPage.content()
	if (content.includes('Error Has Occurred') === false)
		throw new Error('Page does not contain any error')
	if (errors[text].test(content) === false)
		throw new Error(`Page does not contain text: "${text}"`)
}

const shouldNotSeeText = async text => {
	const {currentPage} = scope.context
	const content = await currentPage.content()
	if (content.includes(text) === true)
		throw new Error(`Page contains unexpected text: "${text}"`)
}

const typeInput = async(input, field) => {
	const {currentPage} = scope.context
	await currentPage.waitForSelector(`input[name="${field}"]`)
	await currentPage.focus(`input[name="${field}"]`)
	await currentPage.type(`input[name="${field}"]`, input, { delay: 1 })
}

const pressButton = async button => {
	const {currentPage} = scope.context
	return await currentPage.click(buttons[button])
}

const clickLink = async button => {
	const {currentPage} = scope.context
	return await currentPage.click(links[button])
}

const shouldBeOnPage = async pageName => {
	const {currentPage} = scope.context
	const url = scope.host + pages[pageName]
	return await currentPage.waitForFunction(
		`window.location.href.split('?')[0] === '${url}'`,
		{mutation: true}
	)
}

const login = async user => {
	await visitPage('login')
	await typeInput(user.username, 'user')
	await typeInput(user.password, 'pass')
	return await pressButton('submit')
}

const loginAsAdmin = async() => await login(scope.context.admin)

const loginAsUser = async() => {
	const {accounts} = scope.context
	return await login(accounts[accounts.length - 1])
}

const newAccount = async username => {
	await visitPage('signup')
	const user = {
		username,
		password: 'Rpass12',
		email: `${username}@user.com`
	}
	scope.context.accounts.push(user)
	await typeInput(username, 'user')
	await typeInput(user.password, 'pass')
	await typeInput(user.email, 'email')
	await pressButton('submit')
}

module.exports = {
	visitPage,
	shouldSeeText,
	shouldNotSeeText,
	shouldSeeError,
	wait,
	typeInput,
	pressButton,
	clickLink,
	shouldBeOnPage,
	loginAsUser,
	loginAsAdmin,
	newAccount
}

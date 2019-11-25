
'use strict'

const pages = require('../support/pages')
const errors = require('../support/errors')
const {buttons, links, checkboxes} = require('../support/selectors')
const scope = require('../support/scope')

const slowMo = 40

const delay = duration => new Promise(resolve => setTimeout(resolve, duration))

const wait = async seconds => {
	const sec = 1000, time = parseFloat(seconds) * sec
	await delay(time)
}

const visitPage = async page => {
	if (scope.browser === undefined)
		scope.browser = await scope.driver.launch({
			args: ['--disable-dev-shm-usage', '--start-fullscreen'],
			headless: true,
			slowMo
		})
	const {currentPage} = scope.context
	if (currentPage === undefined) {
		scope.context.currentPage = await scope.browser.newPage()
		// Use native viewport size for the Chromebook.
		scope.context.currentPage.setViewport( {width: 1366, height: 768} )
	}
	const url = `${ scope.host }${ pages[page] }`
	const visit = await scope.context.currentPage.goto(url, {
		waitUntil: 'networkidle2'
	})
	return visit
}

const shouldSeeText = async text => {
	await delay(100)
	const {currentPage} = scope.context
	const content = await currentPage.content()
	if (content.includes(text) === false)
		throw new Error(`Page does not contain text: "${text}"`)
}

const shouldSeeError = async text => {
	await delay(100)
	const {currentPage} = scope.context
	const content = await currentPage.content()
	if (content.includes('Error Has Occurred') === false)
		throw new Error('Page does not contain any error')
	if (errors[text].test(content) === false)
		throw new Error(`Page does not contain text: "${text}"`)
}

const shouldNotSeeText = async text => {
	await delay(100)
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

const replaceInput = async field => {
	const {currentPage} = scope.context
	await currentPage.evaluate(field => {
		const input = document.querySelector(`input[name="${field}"]`)
		input.value = `new${input.value}`
	}, field)
}

const pressButton = async button => {
	const {currentPage} = scope.context
	await delay(100)
	return await currentPage.click(buttons[button])
}

const pressCheckbox = async checkboxName => {
	const {currentPage} = scope.context
	return await currentPage.click(checkboxes[checkboxName])
}

const clickLink = async button => {
	const {currentPage} = scope.context
	return await currentPage.click(links[button])
}

const shouldBeOnPage = async pageName => {
	const {currentPage} = scope.context
	const url = scope.host + pages[pageName]
	const watchDog = currentPage.waitForFunction(
		`window.location.href.split('?')[0] === '${url}'`,
		{mutation: true}
	)
	await watchDog
}

const shouldBeChecked = async checkbox => {
	await delay(100)
	const {currentPage} = scope.context
	const elem = await currentPage.$(checkboxes[checkbox])
	const value = await (await elem.getProperty('checked')).jsonValue()
	if (value !== true) throw new Error(`Checkbox is not checked, instead: ${value}`)
}

const dismissAlert = async() => await wait(1)

module.exports = {
	visitPage,
	shouldSeeText,
	shouldNotSeeText,
	shouldSeeError,
	wait,
	typeInput,
	replaceInput,
	pressButton,
	pressCheckbox,
	clickLink,
	shouldBeOnPage,
	shouldBeChecked,
	dismissAlert
}

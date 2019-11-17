
'use strict'

const pages = require('../support/pages')
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
	const { currentPage } = scope.context
	const content = await currentPage.content()
	if (!content.includes(text))
		throw new Error(`Page does not contain text: "${text}"`)
}

module.exports = {visitPage, shouldSeeText, wait}

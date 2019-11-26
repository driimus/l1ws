/*
 * Based on the checkScreenshot helper of cucumber-puppeteer.
 * https://raw.githubusercontent.com/patheard/cucumber-puppeteer/master/features/support/check/checkScreenshot.js
 */

'use strict'

const assert = require('assert').strict
const fs = require('fs-extra')
const PNG = require('pngjs').PNG
const pixelmatch = require('pixelmatch')
const scope = require('./scope')

async function parseImage(filename) {
	return new Promise(resolve => {
		const img = fs
			.createReadStream(filename)
			.pipe(new PNG())
			.on('parsed', () => resolve(img))
	})
}

const snap = {
	compare: label => `snapshots/compare/${label}.png`,
	diff: label => `snapshots/diff/${label}.png`,
	ref: label => `snapshots/ref/${label}.png`
}

module.exports = async label => {
	console.log(label)
	const {currentPage} = scope.context
	await currentPage.screenshot({path: snap.compare(label), fullPage: true})

	// If there's no reference screenshot, save the taken screenshot as the new reference
	if(!await fs.pathExists(snap.ref(label))) await fs.copy(snap.compare(label), snap.ref(label))
	else {
		const imgCompare = await parseImage(snap.compare(label))
		const imgRef = await parseImage(snap.ref(label))

		assert.strictEqual(imgCompare.width, imgRef.width, 'Expected screenshot widths to match.')
		assert.strictEqual(imgCompare.height, imgRef.height, 'Expected screenshot heights to match.')

		// Compare the images
		const imgDiff = await new PNG({width: imgCompare.width, height: imgCompare.height})
		const diffPixels = await pixelmatch(
			imgCompare.data, imgRef.data, imgDiff.data,
			imgCompare.width, imgCompare.height,
			{threshold: 0.1}
		)

		// If they don't match, save the difference screenshot
		if(diffPixels > 0)
			await imgDiff.pack().pipe(fs.createWriteStream(snap.diff(label)))

		assert.strictEqual(diffPixels, 0, 'Expected screenshots to match.')
	}
}

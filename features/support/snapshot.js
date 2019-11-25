/*
 * Based on the checkScreenshot helper of cucumber-puppeteer.
 * https://raw.githubusercontent.com/patheard/cucumber-puppeteer/master/features/support/check/checkScreenshot.js
 */

'use strict'

const assert = require('assert').strict
const fs = require('fs-extra')
const PNG = require('pngjs').PNG
const pixelmatch = require('pixelmatch')

async function parseImage(filename) {
	return new Promise(resolve => {
		const img = fs
			.createReadStream(filename)
			.pipe(new PNG())
			.on('parsed', () => resolve(img))
	})
}

const path = {
	compare: label => `snapshots/compare/${label}.png`,
	diff: label => `snapshots/diff/${label}.png`,
	ref: label => `snapshots/ref/${label}.png`
}

module.exports = async(page, label) => {

	await page.screenshot({path: path.compare(label), fullPage: true})

	// If there's no reference screenshot, save the taken screenshot as the new reference
	if(!await fs.pathExists(path.ref(label))) await fs.copy(path.compare(label), path.ref(label))
	else {
		const imgCompare = await parseImage(path.compare(label))
		const imgRef = await parseImage(path.ref(label))

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
			await imgDiff.pack().pipe(fs.createWriteStream(path.diff(label)))

		assert.strictEqual(diffPixels, 0, 'Expected screenshots to match.')
	}
}

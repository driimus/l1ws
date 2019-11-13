
'use strict'

const {isInt} = require('../utils')

/**
 * Determines the time left until sending out a newsletter.
 *
 * @async
 * @param {object} today - Current time.
 * @param {number} targetHour - Newsletter's delivery hour.
 *
 * @returns {number} Time left in ms until next occurrence of 8AM.
 */
const getTimeLeft = async(today, targetHour) => {
	try {
		targetHour = await isInt(targetHour, 'hour')
		const now = new Date(today)
		// Invalid date objects never convert to numbers.
		if (isNaN(now) === true) throw new Error(`not a valid date: ${today}`)
		// Get time left until target hour.
		let timeLeft = today.setHours(targetHour, 0, 0, 0) - now
		// Use next day if current time is past targetHour.
		if (timeLeft < 1) timeLeft = today.setDate(today.getDate() + 1) - now
		return timeLeft
	} catch(err) {
		throw err
	}
}

module.exports = Newsletter => Newsletter.prototype.getTimeLeft = getTimeLeft

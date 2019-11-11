
'use strict'

/**
 * Determines the time left until sending out a newsletter.
 *
 * @async
 *
 * @returns {number} Time left in ms until next occurrence of 8AM.
 */
const getTimeLeft = async function() {
	const d = new Date(), now = new Date(d)
	// Get time left until 8 a.m.
	let timeLeft = d.setHours(8, 0, 0, 0) - now
	// Use next day if current time is past targetHour.
	if (timeLeft < 1) timeLeft = d.setDate(d.getDate() + 1) - now
	return timeLeft
}

module.exports = Newsletter => Newsletter.prototype.getTimeLeft = getTimeLeft

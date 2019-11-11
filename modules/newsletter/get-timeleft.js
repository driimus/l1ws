
'use strict'

/**
 * Determines the time left until sending out a newsletter.
 *
 * @async
 *
 * @returns {number} Time left in ms until next occurrence of 8AM.
 */
const getTimeLeft = async(today=new Date(), targetHour) => {
	const now = new Date(today)
	// Get time left until target hour.
	let timeLeft = today.setHours(targetHour, 0, 0, 0) - now
	// Use next day if current time is past targetHour.
	if (timeLeft < 1) timeLeft = today.setDate(today.getDate() + 1) - now
	return timeLeft
}

module.exports = Newsletter => Newsletter.prototype.getTimeLeft = getTimeLeft

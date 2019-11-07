
'use strict'

/**
 * Displays submission date in local time.
 */
const setDate = (data) => {
	const date = data.getAttribute('date')
	document.getElementById('date').innerText = new Date(date).toLocaleString()
}

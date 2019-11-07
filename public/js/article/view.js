
'use strict'

document.addEventListener('DOMContentLoaded', () => {
	const data = document.getElementById('articleView')
	setDate(data)
})

/**
 * Displays submission date in local time.
 */
const setDate = (data) => {
	const date = data.getAttribute('date')
	document.getElementById('date').innerText = new Date(date).toLocaleString()
}

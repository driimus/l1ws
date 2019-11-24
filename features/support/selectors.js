
'use strict'

module.exports = {
	links: {
		Login: 'a[href="/login"]',
		'Sign up': 'a[href="/register"]'
	},
	buttons: {
		search: '#search-btn',
		submit: 'input[type="submit"]',
		confirm: '#confirm-btn',
		approved: 'button[value="approved"]',
		'Add article': 'input[value="Add article"]',
	},
	checkboxes: {
		subscribe: '#subscribe',
		subscribed: 'input[name="subscribed"]'
	},
	fields: {
		thumbnail: '#thumbnailUrl',
		image: 'input[name="image"]',
		content: 'textarea[name="text"]'
	}
}

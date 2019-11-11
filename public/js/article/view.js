
'use strict'

let starCount

document.addEventListener('DOMContentLoaded', () => {
	const data = document.getElementById('articleView'),
		starContainer = document.querySelector('.stars'),
		stars = Array.prototype.slice.call(starContainer.children),
		id = data.getAttribute('articleId')
	starCount = stars.length
	starContainer.addEventListener('click', async e => rate(e, stars, id))
	setDate(data.getAttribute('date'))
	setRating(stars, data.getAttribute('rating'))
})

/**
 * Displays submission date in local time.
 *
 * @param {string} date - Timestamp with timezone.
 */
const setDate = date => document.getElementById('date').innerText = new Date(date).toLocaleString()

/**
 * Updates individual user rating.
 *
 * @param {object} stars - HTML container of the 5 star rating.
 * @param {number} rating - The up-to-date individual rating.
 */
const setRating = (stars, rating) => {
	const selected = document.querySelector('.is-selected')
	// Reset current selection if there is one.
	if (selected !== null) selected.classList.toggle('is-selected')
	// Update selection to new rating.
	if (Number.isInteger(+rating))
		stars[starCount - parseInt(rating)].classList.toggle('is-selected')
}

/**
 * Submits a new article rating and updates the average rating.
 *
 * @async
 * @param {object} e - Event that triggered the call.
 * @param {object} stars - HTML container of the 5 star rating.
 * @param {number} articleId - The ID of the current article.
 */
const rate = async(e, stars, articleId) => {
	const newRating = starCount - stars.indexOf(e.target.parentElement),
		res = await fetch(`/article/${articleId}/rate`, {
			method: 'POST',
			body: JSON.stringify( {value: newRating} ),
			credentials: 'include',
			mode: 'cors'
		})
	const {newAverage} = await res.json()
	// Update client-side ratings.
	setRating(stars, newRating)
	document.getElementById('rating').innerText = `rated ${newAverage}/${starCount} on average`
	// Disable unselecting the rating.
	e.target.parentElement.classList.add('is-selected')
}

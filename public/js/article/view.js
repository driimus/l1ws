
'use strict'

document.addEventListener('DOMContentLoaded', () => {
	const data = document.getElementById('articleView'),
		starContainer = document.querySelector('.stars'),
		stars = Array.prototype.slice.call(starContainer.children),
		id = data.getAttribute('articleId')
	starContainer.addEventListener('click', async e => rate(e, stars, id))
	setDate(data.getAttribute('date'))
	setRating(stars, data.getAttribute('rating'))
})

/**
 * Displays submission date in local time.
 */
const setDate = date => document.getElementById('date').innerText = new Date(date).toLocaleString()

const starCount = 5

/**
 * Updates individual user rating.
 */
const setRating = (stars, rating) => {
	const selected = document.querySelector('.is-selected')
	// Reset current selection if there is one.
	if (selected !== null) selected.classList.toggle('is-selected')
	// Update selection to new rating.
	if (Number.isInteger(rating))
		stars[starCount - parseInt(rating)].classList.toggle('is-selected')
}

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

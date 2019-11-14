/* eslint-env jquery*/

'use strict'

document.addEventListener('DOMContentLoaded', () => {
	const editor = document.getElementById('content')

	document.getElementById('add-content').addEventListener('click', () => {
		const content = document.querySelector('.content-field').cloneNode(true)
		content.firstElementChild.value = ''
		toggleChildBtn(content.lastElementChild)
		editor.insertBefore(content, editor.lastChild.nextSibling)

	})

})

document.addEventListener('DOMContentLoaded', () => {

	$('#editor').submit(e => {
		const [,,, ...rest] = $('#editor').serializeArray()
		$('<input />').attr('type', 'hidden')
			.attr('name', 'content')
			.attr('value', JSON.stringify(rest))
			.appendTo('#editor')
		return true
	})

})

// Enable remove button for every manually added content field.
const toggleChildBtn = container => {
	container.firstElementChild.disabled = false
	container.hidden = false
}

const loadPreview = (e, target) => {
	const img = document.getElementById(target)
	img.src = URL.createObjectURL(e.target.files[0])
}

const uploadImage = async(src, target) => {
	const data = new FormData()
	const [img] = document.getElementById(src).files,
		url = document.getElementById(target)
	data.append('thumbnail', img)
	try {
		const res = await fetch('/article/upload', {
			method: 'POST',
			body: data,
			credentials: 'include',
			mode: 'cors'
		})
		const {thumbnail} = await res.json()
		url.value = thumbnail
	} catch(err) {
		alert(err.message)
	}
}

const attachImage = () => {
	const url = document.getElementById('image-url-container').cloneNode(true),
		editor = document.getElementById('content')
	toggleChildBtn(url.lastElementChild)
	editor.insertBefore(url, editor.lastChild.nextSibling)
	$('#exampleModal').modal('toggle')
}

const remove = btn => {
	const editor = document.getElementById('content')
	editor.removeChild(btn.parentElement.parentElement)
}

const submitArticle = async(e) => {
	e.preventDefault()
	const [thumbnail, headline, summary, ...rest] = $('#editor').serializeArray()
	const data = {
		thumbnail,
		headline,
		summary,
		content: rest
	}
	const res = await fetch(e.target.action, {
		method: 'POST',
		body: JSON.stringify(data),
		credentials: 'include',
		redirect: 'follow',
		mode: 'cors'
	})
	if (res.redirected) window.location.href = res.url
}

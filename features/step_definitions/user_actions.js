
'use strict'

const scope = require('../support/scope')
const {visitPage, typeInput, pressButton} = require('./implementations')

const login = async user => {
	await visitPage('login')
	await typeInput(user.username, 'user')
	await typeInput(user.password, 'pass')
	return await pressButton('submit')
}

const loginAsAdmin = async() => await login(scope.context.admin)

const loginAsUser = async() => {
	const {accounts} = scope.context
	return await login(accounts[accounts.length - 1])
}

const newAccount = async username => {
	await visitPage('signup')
	const user = {
		username,
		password: 'Rpass12',
		email: `${username}@user.com`
	}
	scope.context.accounts.push(user)
	await typeInput(username, 'user')
	await typeInput(user.password, 'pass')
	await typeInput(user.email, 'email')
	await pressButton('submit')
}

const fillRegisterForm = async() => {
	const {accounts} = scope.context
	const user = accounts
		? accounts[accounts.length - 1]
		: {
			username: 'randomusername',
			password: 'Rpass12',
			email: 'randomusername@user.com'
		}
	await typeInput(`new${user.username}`, 'user')
	await typeInput(user.password, 'pass')
	await typeInput(`new${user.email}`, 'email')
}

const fillRegisterFormWith = async field => {
	const {accounts} = scope.context
	const user = Object.assign({}, accounts[accounts.length - 1])
	user.username = `new${user.username}`
	user.email = `new${user.email}`
	user[field] = accounts[0][field]
	await typeInput(user.username, 'user')
	await typeInput(user.password, 'pass')
	await typeInput(user.email, 'email')
}

const fillLoginFormWith = async field => {
	const {accounts} = scope.context
	const user = accounts[accounts.length - 1]
	// Enforce wrong credentials
	user[field] = `wrong${user[field]}`
	await typeInput(user.username, 'user')
	await typeInput(user.password, 'pass')
}

module.exports = {
	loginAsAdmin,
	loginAsUser,
	newAccount,
	fillRegisterForm,
	fillLoginFormWith,
	fillRegisterFormWith
}

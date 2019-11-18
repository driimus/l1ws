
'use strict'

const User = require('../../modules/user')

const getAdmin = async session => {
	const user = await new User()
	await user.getAdmin(session.username)
	return true
}

const getUserInfo = async session => {
	const user = await new User()
	const {authorised: loggedIn, username, avatar} = session
	const isAdmin = await user.isAdmin(username)
	return {loggedIn, username, avatar, isAdmin}
}

module.exports = {getAdmin, getUserInfo}


'use strict'

module.exports = async session => {
	const {authorised: loggedIn, username, avatar} = session
	return {loggedIn, username, avatar}
}


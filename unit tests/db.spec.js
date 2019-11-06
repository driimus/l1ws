'use strict'

const Connection = require('../db')

describe('database connection', () => {

	test('connect to development database', async done => {
		const { development } = require('../db/config')
		process.env.NODE_ENV = 'development'
		const db = new Connection()
		Object.keys(development).forEach((attr) => {
			expect(db.options[attr]).toBe(development[attr])
		})
		done()
	})

	test('connect to prod database', async done => {
		const { production } = require('../db/config')
		process.env = {
			RDS_USERNAME: 'prod',
			RDS_HOSTNAME: 'production',
			RDS_DB_NAME: 'cwprod',
			RDS_PASSWORD: 'secret',
			RDS_PORT: 5432,
			NODE_ENV: 'production'
		}
		const db = new Connection()
		Object.keys(production).forEach((attr) => {
			expect(db.options[attr]).toBe(production[attr])
		})
		done()
	})

	test('connect to test database', async done => {
		const { test } = require('../db/config')
		process.env = test
		process.env.NODE_ENV = 'test'
		const db = new Connection()
		Object.keys(test).forEach((attr) => {
			expect(db.options[attr]).toBe(test[attr])
		})
		done()
	})

})

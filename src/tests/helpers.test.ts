import { describe, it } from 'node:test'
import assert from 'node:assert'

import { hash, isHashValid } from '../helpers'

describe('helpers', () => {
	describe('hash', () => {
		it('should return a string', () => {
			const result = hash('test')
			assert.strictEqual(typeof result, 'string')
		})
	})

	describe('isHashValid', () => {
		it('should return true if hash is valid', () => {
			const result = isHashValid({
				hash: '0000',
				difficulty: 4,
				prefix: '0',
			})
			assert.deepStrictEqual(result, true)
		})

		it('should return false if hash is invalid', () => {
			const result = isHashValid({
				hash: '0000',
				difficulty: 5,
				prefix: '0',
			})
			assert.deepStrictEqual(result, false)
		})
	})
})
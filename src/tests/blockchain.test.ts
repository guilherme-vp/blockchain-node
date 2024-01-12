import { describe, it, before, mock } from "node:test";
import assert from "node:assert";

import { Blockchain } from "../blockchain";

describe("Blockchain", () => {
	before(() => {
		mock.method(console, "log", () => {});
	});

	describe("constructor", () => {
		it("should return a Blockchain", () => {
			const result = new Blockchain(0);

			assert.strictEqual(typeof result, "object");
			assert.strictEqual(result instanceof Blockchain, true);
		});

		it("should return a Blockchain with a genesis block", () => {
			const result = new Blockchain();

			assert.strictEqual(result.chain.length, 1);
		});
	});

	describe("addBlock", () => {
		it("should add a Block to the chain", () => {
			const blockchain = new Blockchain(0);
			const block = blockchain.createBlock({
				data: "test",
			});
			const { minedBlock } = blockchain.mineBlock(block);

			blockchain.addBlock(minedBlock);

			// 1 genesis block + 1 block
			assert.strictEqual(blockchain.chain.length, 2);
		});
	});

	describe("verifyBlock", () => {
		it("should return true if the chain is valid", () => {
			const blockchain = new Blockchain(0);
			const block = blockchain.createBlock({
				data: "test",
			});
			const { minedBlock } = blockchain.mineBlock(block);

			const result = blockchain.verifyBlock(minedBlock);

			assert.strictEqual(result, true);
		});

		it("should return false if the previous hash is invalid", () => {
			const blockchain = new Blockchain(0);
			const block = blockchain.createBlock({
				data: "test",
			});
			const { minedBlock } = blockchain.mineBlock(block);
			minedBlock.payload.previousHash = "invalid hash";

			const result = blockchain.verifyBlock(minedBlock);

			assert.strictEqual(result, false);
		});
	});

	describe("mineBlock", () => {
		it("should return a Block", () => {
			const blockchain = new Blockchain(0);
			const block = blockchain.createBlock({
				index: 0,
				data: "test",
				timestamp: Date.now(),
				previousHash: "0",
			});

			const result = blockchain.mineBlock(block);

			assert.strictEqual(typeof result, "object");
			assert.strictEqual(result instanceof Object, true);
		});
	});
});

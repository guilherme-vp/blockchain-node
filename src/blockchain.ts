import { hash, isHashValid } from "./helpers";

export interface Block {
	header: {
		nonce: number;
		hash: string;
	};
	payload: {
		sequence: number;
		timestamp: number;
		data: unknown;
		previousHash?: string;
	};
}

export class Blockchain {
	#chain: Block[] = [];
	private prefixPow = "0";

	constructor(private readonly difficulty: number = 4) {
		this.#chain.push(this.genesisBlock());
	}

	private genesisBlock(): Block {
		const payload: Block["payload"] = {
			sequence: 0,
			timestamp: Date.now(),
			data: "GENESIS BLOCK",
			previousHash: undefined,
		};
		const header: Block["header"] = {
			hash: hash(JSON.stringify(payload)),
			nonce: 0,
		};

		return {
			header,
			payload,
		};
	}

	private get lastBlock(): Block {
		return this.#chain[this.#chain.length - 1];
	}

	private get hashLastBlock(): string {
		return this.lastBlock.header.hash;
	}

	public get chain(): Block[] {
		return this.#chain;
	}

	public createBlock(data: unknown): Block["payload"] {
		const payload: Block["payload"] = {
			sequence: this.lastBlock.payload.sequence + 1,
			timestamp: Date.now(),
			data,
			previousHash: this.hashLastBlock,
		};

		console.log(`Block #${payload.sequence} created!`);

		return payload;
	}

	public mineBlock(block: Block["payload"]): {
		minedBlock: Block;
		minedHash: string;
		shortHash: string;
		mineTime: number;
	} {
		let nonce = 0;
		const hashBlock = hash(JSON.stringify(block));
		const startAt = Date.now();

		while (true) {
			const hashProof = hash(hashBlock + nonce);

			console.log(`Try nº: ${nonce} - Hash: ${hashProof}`);

			if (
				isHashValid({
					hash: hashProof,
					difficulty: this.difficulty,
					prefix: this.prefixPow,
				})
			) {
				const endAt = Date.now();
				const shortHash = hashBlock.slice(0, this.difficulty);
				const mineTime = (endAt - startAt) / 1000;

				console.log(`Block #${block.sequence} mined in ${mineTime} seconds!`);
				console.log(`Short hash: ${shortHash} - (${nonce} tries)`);

				return {
					minedBlock: {
						payload: block,
						header: { hash: hashProof, nonce },
					},
					minedHash: hashProof,
					shortHash,
					mineTime,
				};
			}

			nonce++;
		}
	}

	public verifyBlock(block: Block): boolean {
		if (block.payload.previousHash !== this.hashLastBlock) {
			console.error(
				`Block #${block.payload.sequence} rejected: Previous hash ${block.payload.previousHash} invalid!`,
			);
			return false;
		}

		const hashedPayload = hash(JSON.stringify(block.payload));
		const hashTest = hash(hashedPayload + block.header.nonce);
		if (
			!isHashValid({
				hash: hashTest,
				difficulty: this.difficulty,
				prefix: this.prefixPow,
			})
		) {
			console.error(
				`Block #${block.payload.sequence} rejected: Nonce ${block.header.nonce} invalid!`,
			);
			return false;
		}

		return true;
	}

	public addBlock(block: Block): Block[] {
		console.log(`Block #${block.payload.sequence} received!`);
		if (this.verifyBlock(block)) {
			this.#chain.push(block);
			console.log(
				`Block #${block.payload.sequence} added to the chain: ${JSON.stringify(
					block,
					null,
					2,
				)}!`,
			);
		}
		return this.#chain;
	}
}

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
	private prefixPow = "0".repeat(this.difficulty);

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

	public createBlock(data: unknown): Block {
		const payload: Block["payload"] = {
			sequence: this.lastBlock.payload.sequence + 1,
			timestamp: Date.now(),
			data,
			previousHash: this.hashLastBlock,
		};
		const header: Block["header"] = {
			hash: hash(JSON.stringify(payload)),
			nonce: 0,
		};

		console.log(`Bloco #${payload.sequence} criado!`);

		return {
			header,
			payload,
		};
	}

	public mineBlock(block: Block): {
		minedBlock: Block;
		minedHash: string;
		shortHash: string;
		mineTime: number;
	} {
		let nonce = 0;
		const hashBlock = hash(JSON.stringify(block.payload));
		const startAt = Date.now();

		while (true) {
			const hashProof = hash(hashBlock + nonce);

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

				console.log(
					`Bloco #${block.payload.sequence} minerado em ${mineTime} segundos!`,
				);
				console.log(`Hash reduzido: ${shortHash} - (${nonce} tentativas)`);

				return {
					minedBlock: {
						payload: block.payload,
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
				`Bloco #${block.payload.sequence} rejeitado: hash anterior inválido!`,
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
				`Bloco #${block.payload.sequence} rejeitado: Nonce ${block.header.nonce} inválido!`,
			);
			return false;
		}

		return true;
	}

	public addBlock(block: Block): Block[] {
		if (this.verifyBlock(block)) {
			this.#chain.push(block);
			console.log(
				`Bloco #${
					block.payload.sequence
				} adicionado à Blockchain: ${JSON.stringify(block, null, 2)}!`,
			);
		}
		return this.#chain;
	}
}

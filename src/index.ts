import { Blockchain } from "./blockchain";

const difficulty = Number(process.argv[2]) || 3;
const numBlocks = Number(process.argv[3]) || 4;

const blockchain = new Blockchain(difficulty);

let chain = blockchain.chain;
for (let i = 1; i <= numBlocks; i++) {
	const block = blockchain.createBlock(`Block ${i}`);
	const mineInfo = blockchain.mineBlock(block);

	chain = blockchain.addBlock(mineInfo.minedBlock);
}

console.log("---- GENERATED BLOCKCHAIN ----\n");
console.log(chain);

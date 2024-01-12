import { BinaryLike, createHash } from "node:crypto";

export function hash(data: BinaryLike): string {
	return createHash("sha256").update(data).digest("hex");
}

export function isHashValid({
	hash,
	difficulty,
	prefix,
}: { hash: string; difficulty: number; prefix: string }) {
	const check = prefix.repeat(difficulty);
	return hash.startsWith(check);
}

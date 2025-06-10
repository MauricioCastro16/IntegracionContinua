// src/lib/RootN.ts
export function RootN(n: number, m: number): number {
	if (n <= 0 || m <= 0) throw new Error('Ambos parámetros deben ser números positivos');
	return Math.pow(n, 1 / m);
}

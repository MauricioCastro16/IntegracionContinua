// src/lib/RootN.ts
export function RootN(n: number, m: number): number {
	//if (n <= 0 || m <= 0) throw new Error('Ambos parámetros deben ser números positivos');
	if (m === 1) return n; // La raíz de un número con m=1 es el mismo número
	return Math.pow(n, 1 / m);
}

/**
 * Función para verificar si un número es primo.
 * @param n Número al que se le calculará la raíz.
 * @param m Índice de la raíz.
 * @returns La raíz n-ésima de `n`.
 * @throws Error si `n` o `m` son menores o iguales a 0.
 * @example
 * // Calcular la raíz cúbica de 27
 * RootN(27, 3); // Devuelve 3
 */
export function RootN(n: number, m: number): number {
	//if (n <= 0 || m <= 0) throw new Error('Ambos parámetros deben ser números positivos');
	if (m === 1) return n; // La raíz de un número con m=1 es el mismo número
	const result = Math.pow(n, 1 / m);
	return result;
}

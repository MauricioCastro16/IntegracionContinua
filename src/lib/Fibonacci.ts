/**
 * Función que genera el enésimo número de Fibonacci.
 * @param n El índice del número en la secuencia de Fibonacci.
 * @returns El número en la posición n de la secuencia.
 */

export function Fibonacci(n: number): number {
	if (n <= 0) {
		throw new Error('El índice debe ser un número entero positivo.');
	}
	if (n === 1) return 0; // Primer número de Fibonacci
	if (n === 2) return 1; // Segundo número de Fibonacci

	let a = 0,
		b = 1;
	for (let i = 3; i <= n; i++) {
		const next = a + b;
		a = b;
		b = next;
	}

	return b;
}

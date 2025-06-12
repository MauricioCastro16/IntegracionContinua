// src/lib/NextPrime.ts

/**
 * Función para verificar si un número es primo.
 * @param num Número a verificar.
 * @returns `true` si el número es primo, `false` si no lo es.
 * @example
 * // Verificar si 7 es primo
 * isPrime(7); // Devuelve true
 */
function isPrime(num: number): boolean {
	if (num <= 1) return false;
	if (num === 2) return true;
	if (num % 2 === 0) return false;
	for (let i = 3; i <= Math.sqrt(num); i += 2) {
		if (num % i === 0) return false;
	}
	return true;
}

/**
 * Función que encuentra el número primo más cercano mayor o igual a un número dado.
 * @param num Número inicial.
 * @returns El número primo más cercano.
 * @example
 * // Encontrar el siguiente primo después de 10
 * NextPrime(10); // Devuelve 11
 */
export function NextPrime(num: number): number {
	// Si el número es menor que 2, el primer número primo es 2
	if (num <= 1) return 2;

	let prime = num;
	while (!isPrime(prime)) {
		prime++;
	}
	return prime;
}

// tests/NextPrime.test.ts

import { describe, it, expect } from 'vitest';
import { NextPrime } from '$lib/NextPrime'; // Importa la función de NextPrime.ts

describe('Pruebas para la función NextPrime', () => {
	it('Debe devolver 2 como el primer número primo', () => {
		expect(NextPrime(1)).toBe(2);
	});

	it('Debe devolver 2 para números menores a 2', () => {
		expect(NextPrime(0)).toBe(2);
		expect(NextPrime(-1)).toBe(2);
	});

	it('Debe devolver el propio número primo si es que se ingresa un número primo', () => {
		expect(NextPrime(2)).toBe(2);
		expect(NextPrime(59)).toBe(59);
	});

	it('Debe devolver 5 como el siguiente primo de 4', () => {
		expect(NextPrime(4)).toBe(5);
	});

	it('Debe devolver 11 como el siguiente primo de 10', () => {
		expect(NextPrime(10)).toBe(11);
	});

	it('Debe devolver 13 como el siguiente primo de 12', () => {
		expect(NextPrime(12)).toBe(13);
	});

	it('Debe devolver 17 como el siguiente primo de 15', () => {
		expect(NextPrime(15)).toBe(17);
	});
});

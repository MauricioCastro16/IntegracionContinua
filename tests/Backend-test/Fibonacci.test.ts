// tests/Fibonacci.test.ts

import { describe, it, expect } from 'vitest';
import { Fibonacci } from '$lib/Fibonacci';

describe('Pruebas para la función Fibonacci', () => {
	it('Debe devolver el 1er número de Fibonacci', () => {
		expect(Fibonacci(1)).toBe(0);
	});

	it('Debe devolver el 2do número de Fibonacci', () => {
		expect(Fibonacci(2)).toBe(1);
	});

	it('Debe devolver el 10mo número de Fibonacci', () => {
		expect(Fibonacci(10)).toBe(34);
	});

	it('Debe devolver el 20mo número de Fibonacci', () => {
		expect(Fibonacci(20)).toBe(4181);
	});

	it('Debe lanzar un error si el índice es menor o igual a 0', () => {
		expect(() => Fibonacci(0)).toThrow('El índice debe ser un número entero positivo.');
		expect(() => Fibonacci(-1)).toThrow('El índice debe ser un número entero positivo.');
	});
});

// tests/rootN.test.ts
import { describe, it, expect } from 'vitest';
import { RootN } from '../src/lib/RootN';

describe('RootN function', () => {
	it('should return the correct result for positive n and m', () => {
		const result = RootN(8, 3);
		expect(result).toBe(2);
	});

	it('should return the correct result for a decimal number', () => {
		const result = RootN(28, 3); // 28^(1/3) -> approximately 3.0366
		expect(result).toBeCloseTo(3.036, 2);
	});

	it('should throw an error if n or m is less than or equal to zero', () => {
		expect(() => RootN(0, 3)).toThrowError('Ambos parámetros deben ser números positivos');
		expect(() => RootN(3, 0)).toThrowError('Ambos parámetros deben ser números positivos');
		expect(() => RootN(-1, 3)).toThrowError('Ambos parámetros deben ser números positivos');
		expect(() => RootN(3, -1)).toThrowError('Ambos parámetros deben ser números positivos');
	});
});

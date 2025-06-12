import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

test('La calculadora carga correctamente', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	const currentUrl = page.url(); // Obtiene la URL actual de la página
	console.log(`La URL actual es: ${currentUrl}`);
	const buttons = await page.$$('.buttons button');
	expect(buttons.length).toBeGreaterThan(0); // Verifica que haya botones en la calculadora
	const resultText = await page.innerText('.display .result');
	expect(resultText).toBe('=0'); // La pantalla debe estar vacía al principio
});

test('Suma de 2 + 3 debe dar 5', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForURL('/');
	await page.$$('.buttons button');
	await page.$$('.display');
	await page.waitForSelector('button:text("C")', { state: 'visible' });
	await page.click('button:text("C")');

	await page.waitForSelector('button:text("2")', { state: 'visible' });
	await page.click('button:text("2")');
	const inputText = await page.innerText('.display .input');
	expect(inputText).toBe('2');

	await page.click('button:text("+")');
	await page.click('button:text("3")');
	await page.click('button:text("=")');
	const resultText = await page.innerText('.display .result');
	expect(resultText).toBe('=5');
});

test('Resta de 6 - 3 debe dar 3', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForURL('/');
	await page.$$('.buttons button');
	await page.$$('.display');
	await page.waitForSelector('button:text("C")', { state: 'visible' });
	await page.click('button:text("C")');

	await page.waitForSelector('button:text("6")', { state: 'visible' });
	await page.click('button:text("6")');
	const inputText = await page.innerText('.display .input');
	expect(inputText).toBe('6');

	await page.click('button:text("-")');
	await page.click('button:text("3")');
	await page.click('button:text("=")');
	const resultText = await page.innerText('.display .result');
	expect(resultText).toBe('=3');
});

test('Multiplicación de 3 * 2 debe dar 6', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForURL('/');
	await page.$$('.buttons button');
	await page.$$('.display');
	await page.waitForSelector('button:text("C")', { state: 'visible' });
	await page.click('button:text("C")');

	await page.waitForSelector('button:text("3")', { state: 'visible' });
	await page.click('button:text("3")');
	const inputText = await page.innerText('.display .input');
	expect(inputText).toBe('3');

	await page.click('button:text("*")');
	await page.click('button:text("2")');
	await page.click('button:text("=")');
	const resultText = await page.innerText('.display .result');
	expect(resultText).toBe('=6');
});

test('División de 9 / 3 debe dar 3', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForURL('/');
	await page.$$('.buttons button');
	await page.$$('.display');
	await page.waitForSelector('button:text("C")', { state: 'visible' });
	await page.click('button:text("C")');

	await page.waitForSelector('button:text("9")', { state: 'visible' });
	await page.click('button:text("9")');
	const inputText = await page.innerText('.display .input');
	expect(inputText).toBe('9');

	await page.click('button:text("/")');
	await page.click('button:text("3")');
	await page.click('button:text("=")');
	const resultText = await page.innerText('.display .result');
	expect(resultText).toBe('=3');
});

test('La función RootN debe calcular la raíz correctamente', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForURL('/');
	await page.$$('.special-functions button');
	await page.$$('.display');
	await page.waitForSelector('button:text("C")', { state: 'visible' });
	await page.click('button:text("C")');

	await page.waitForSelector('button:text("RootN")', { state: 'visible' });
	await page.click('button:text("RootN")');
	const inputText = await page.innerText('.display .input');
	expect(inputText).toBe('RootN(');

	await page.click('button:text("2")');
	await page.click('button:text(",")');
	await page.click('button:text("8")');
	await page.click('button:text(")")');
	await page.click('button:text("=")');
	const resultText = await page.innerText('.display .result');
	expect(resultText).toBe('=2.8284'); // Aproximadamente 2.8284
});

test('La función Fibonacci debe calcular el número correctamente', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForURL('/');
	await page.$$('.special-functions button');
	await page.$$('.display');
	await page.waitForSelector('button:text("C")', { state: 'visible' });
	await page.click('button:text("C")');

	await page.waitForSelector('button:text("Fibo")', { state: 'visible' });
	await page.click('button:text("Fibo")');
	const inputText = await page.innerText('.display .input');
	expect(inputText).toBe('Fibo(');

	await page.click('button:text("5")');
	await page.click('button:text(")")');
	await page.click('button:text("=")');
	const resultText = await page.innerText('.display .result');
	expect(resultText).toBe('=3'); // El 5to número de Fibonacci es 3
});

test('El botón NextPrime calcula el siguiente primo', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForURL('/');
	await page.$$('.special-functions button');
	await page.$$('.display');
	await page.waitForSelector('button:text("C")', { state: 'visible' });
	await page.click('button:text("C")');

	await page.waitForSelector('button:text("NextPrime")', { state: 'visible' });
	await page.click('button:text("NextPrime")');
	const inputText = await page.innerText('.display .input');
	expect(inputText).toBe('NextPrime(');
	
	await page.click('button:text("9")');
	await page.click('button:text(")")');
	await page.click('button:text("=")');
	const resultText = await page.innerText('.display .result');
	expect(resultText).toBe('=11'); // El siguiente primo después de 9 es 11
});

test('El botón C borra la entrada', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForURL('/');
	await page.$$('.buttons button');
	await page.$$('.display');
	await page.waitForSelector('button:text("C")', { state: 'visible' });
	await page.click('button:text("C")');

	await page.waitForSelector('button:text("5")', { state: 'visible' });
	await page.click('button:text("5")');
	const inputText = await page.innerText('.display .input');
	expect(inputText).toBe('5');

	await page.click('button:text("+")');
	await page.click('button:text("3")');
	await page.click('button:text("C")');
	const resultText = await page.innerText('.display .input');
	expect(resultText).toBe(''); // El resultado debe ser cero tras presionar "C"
});

test('Operaciones con decimales', async ({ page }) => {
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.waitForURL('/');
	await page.$$('.buttons button');
	await page.$$('.display');
	await page.waitForSelector('button:text("C")', { state: 'visible' });
	await page.click('button:text("C")');

	await page.waitForSelector('button:text("2")', { state: 'visible' });
	await page.click('button:text("2")');
	const inputText = await page.innerText('.display .input');
	expect(inputText).toBe('2');

	await page.click('button:text(".")');
	await page.click('button:text("5")');
	await page.click('button:text("+")');
	await page.click('button:text("1")');
	await page.click('button:text(".")');
	await page.click('button:text("5")');
	await page.click('button:text("=")');
	const resultText = await page.innerText('.display .result');
	expect(resultText).toBe('=4'); // El resultado debe ser 4
});

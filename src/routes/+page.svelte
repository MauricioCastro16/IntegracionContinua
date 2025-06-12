<script lang="ts">
	import { RootN } from '$lib/RootN';
	import { Fibonacci } from '$lib/Fibonacci';
	import { NextPrime } from '$lib/NextPrime';

	let currentInput: string = '';
	let result: number = 0;
	let prevResult: number = 0; // Variable para guardar el resultado anterior
	let isResultDisplayed: boolean = false;

	function addToInput(value: string, type: string) {
		if (type === 'function' && isResultDisplayed) {
			currentInput = `${value}(`; // Iniciar con el primer parámetro
		} else if (type === 'function') {
			currentInput += `${value}(`; // Reiniciar la entrada con la función
		} else if (isResultDisplayed && (type === 'operation' || type === 'function')) {
			currentInput = prevResult + value;
		} else {
			if ((isResultDisplayed && type === 'number') || Number.isNaN(currentInput)) {
				currentInput = value;
			} else {
				currentInput += value;
			}
		}
		isResultDisplayed = false;
	}

	function calculate() {
		try {
			// Función para resolver expresiones de manera recursiva
			function resolveNestedExpression(input: string): string {
				let regex = /([A-Za-z]+\([^\(\)]*\))/g; // eslint-disable-line
				let match: RegExpExecArray | null;

				while ((match = regex.exec(input)) !== null) {
					let expression = match[0];
					if (expression.includes('RootN')) {
						input = input.replace(expression, solveRootN(expression));
					} else if (expression.includes('Fibo')) {
						input = input.replace(expression, solveFibo(expression));
					} else if (expression.includes('NextPrime')) {
						input = input.replace(expression, solveNextPrime(expression));
					}
					match = regex.exec(input);
				}
				return input;
			}

			// Función para resolver 'Ans'
			function replaceAns(input: string): string {
				const regex = /Ans/g;
				return input.replace(regex, prevResult.toString());
			}

			// Funcion para resolver 'RootN(a,b)'
			function solveRootN(expression: string): string {
				const regex = /RootN\(([^,]+),([^,]+)\)/;
				const match = expression.match(regex);
				if (!match) return expression;
				const a = parseFloat(match[1]);
				const b = parseFloat(match[2]);
				return RootN(b, a).toFixed(4); // Resolver la raíz n-ésima
			}

			// Funcion para resolver 'Fibo(a)'
			function solveFibo(expression: string): string {
				const regex = /Fibo\(([^)]+)\)/;
				const match = expression.match(regex);
				if (!match) return expression;
				const a = parseInt(match[1]);
				return Fibonacci(a).toFixed(0); // Resolver el número de Fibonacci
			}

			// Funcion para resolver 'NextPrime(a)'
			function solveNextPrime(expression: string): string {
				const regex = /NextPrime\(([^)]+)\)/;
				const match = expression.match(regex);
				if (!match) return expression;
				const a = parseInt(match[1]);
				return NextPrime(a).toFixed(0); // Resolver el número de Fibonacci
			}

			// Reemplazar 'Ans' con el resultado anterior
			currentInput = replaceAns(currentInput);
			// Expresión regular para encontrar y resolver las expresiones
			currentInput = resolveNestedExpression(currentInput);

			result = parseFloat(eval(currentInput).toFixed(4));
			prevResult = result;
		} catch {
			result = NaN;
		}
		isResultDisplayed = true;
		if (Number.isNaN(result)) {
			currentInput = '0';
		} else {
			currentInput = `${result}`; // Mostramos el resultado
		}
	}

	function clearDisplay() {
		currentInput = '';
		result = 0;
		prevResult = 0; // Resetear el resultado anterior
	}

	function deleteLast() {
		currentInput = currentInput.slice(0, -1); // Elimina el último carácter
		if (currentInput === '') {
			result = 0; // Resetear el resultado si la entrada está vacía
		}
	}
</script>

<main class="calculator">
	<div class="display">
		<p class="input">{currentInput}</p>
		<p class="result">={result}</p>
	</div>

	<!-- Botones para las funcionalidades especiales -->
	<div class="special-functions">
		<button on:click={() => addToInput('RootN', 'function')}>RootN</button>
		<button on:click={() => addToInput('Fibo', 'function')}>Fibo</button>
		<button on:click={() => addToInput('NextPrime', 'function')}>NextPrime</button>
	</div>

	<!-- Botones de la calculadora -->
	<div class="buttons">
		<div class="row">
			<button on:click={() => addToInput('7', 'number')}>7</button>
			<button on:click={() => addToInput('8', 'number')}>8</button>
			<button on:click={() => addToInput('9', 'number')}>9</button>
			<button on:click={() => addToInput('/', 'operation')}>/</button>
			<button on:click={() => addToInput('(', 'number')}>&#40</button>
			<button on:click={() => addToInput(')', 'number')}>&#41</button>
		</div>
		<div class="row">
			<button on:click={() => addToInput('4', 'number')}>4</button>
			<button on:click={() => addToInput('5', 'number')}>5</button>
			<button on:click={() => addToInput('6', 'number')}>6</button>
			<button on:click={() => addToInput('*', 'operation')}>*</button>
			<button on:click={() => addToInput('Ans', 'number')}>Ans</button>
		</div>
		<div class="row">
			<button on:click={() => addToInput('1', 'number')}>1</button>
			<button on:click={() => addToInput('2', 'number')}>2</button>
			<button on:click={() => addToInput('3', 'number')}>3</button>
			<button on:click={() => addToInput('-', 'operation')}>-</button>
			<button on:click={() => addToInput('+', 'operation')}>+</button>
		</div>
		<div class="row">
			<button on:click={() => addToInput('0', 'number')}>0</button>
			<button on:click={() => addToInput('.', 'number')}>.</button>
			<button on:click={() => addToInput(',', 'number')}>,</button>
			<button on:click={calculate}>=</button>
			<button on:click={deleteLast}>⌫</button>
			<button on:click={clearDisplay}>C</button>
		</div>
	</div>

	<style>
		.calculator {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px;
		}

		.display {
			width: 100%;
			text-align: center;
			margin-bottom: 10px;
		}

		.result {
			font-size: 1.5em;
			color: #333;
		}

		.buttons {
			display: flex;
			flex-direction: column;
			justify-content: center;
			margin-top: 10px;
		}

		.row {
			display: flex;
			justify-content: left;
			margin-bottom: 5px;
		}

		button {
			width: 60px;
			height: 60px;
			margin: 5px;
			font-size: 1.5em;
			cursor: pointer;
			background-color: #f0f0f0;
			border: none;
			border-radius: 10px;
			transition: background-color 0.3s;
		}

		button:hover {
			background-color: #ddd;
		}

		.special-functions button {
			width: 120px;
			margin: 10px;
			background-color: #4caf50;
			color: white;
		}

		.special-functions button:hover {
			background-color: #45a049;
		}
	</style>
</main>

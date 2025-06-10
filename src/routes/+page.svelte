<script lang="ts">
	import { RootN } from '$lib/RootN';

	let currentInput: string = '';
	let result: number = 0;
	let prevResult: number = 0; // Variable para guardar el resultado anterior
	let isResultDisplayed: boolean = false;

	function addToInput(value: string, type: string) {
		if (type === 'function') {
			currentInput += `${value}(`; // Iniciar con el primer parámetro
		} else if (isResultDisplayed && (type === 'operation' || type === 'function')) {
			currentInput = prevResult + value;
		} else {
			if ((isResultDisplayed && type === 'number') || Number.isNaN(result)) {
				currentInput = value;
				result = 0;
			} else {
				currentInput += value;
			}
		}
		isResultDisplayed = false;
	}

	function calculate() {
		try {
			// Expresión regular 'RootN(a,b)'
			const regex = /RootN\((\d+(\.\d+)?)\,(\d+(\.\d+)?)\)/g; // eslint-disable-line
			let match;
			while ((match = regex.exec(currentInput)) != null) {
				const a = parseFloat(match[1]);
				const b = parseFloat(match[3]);
				const rootResult = parseFloat(RootN(b, a).toFixed(4));
				currentInput = currentInput.replace(match[0], rootResult.toString());
			}
			result = parseFloat(eval(currentInput).toFixed(4));
			prevResult = result;
		} catch {
			result = NaN;
		}
		isResultDisplayed = true;
		currentInput = `${result}`; // Mostramos el resultado
	}

	function clearDisplay() {
		currentInput = '';
		result = 0;
		prevResult = 0; // Resetear el resultado anterior
	}
</script>

<main class="calculator">
	<div class="display">
		<p>{currentInput}</p>
		<p class="result">={result}</p>
	</div>

	<!-- Botones para las funcionalidades especiales -->
	<div class="special-functions">
		<button on:click={() => addToInput('RootN', 'function')}>RootN</button>
	</div>

	<!-- Botones de la calculadora -->
	<div class="buttons">
		<div class="row">
			<button on:click={() => addToInput('7', 'number')}>7</button>
			<button on:click={() => addToInput('8', 'number')}>8</button>
			<button on:click={() => addToInput('9', 'number')}>9</button>
			<button on:click={() => addToInput('/', 'operation')}>/</button>
			<button on:click={() => addToInput('(', 'number')}>(</button>
		</div>
		<div class="row">
			<button on:click={() => addToInput('4', 'number')}>4</button>
			<button on:click={() => addToInput('5', 'number')}>5</button>
			<button on:click={() => addToInput('6', 'number')}>6</button>
			<button on:click={() => addToInput('*', 'operation')}>*</button>
			<button on:click={() => addToInput(')', 'number')}>)</button>
		</div>
		<div class="row">
			<button on:click={() => addToInput('1', 'number')}>1</button>
			<button on:click={() => addToInput('2', 'number')}>2</button>
			<button on:click={() => addToInput('3', 'number')}>3</button>
			<button on:click={() => addToInput('-', 'operation')}>-</button>
			<button on:click={() => addToInput(',', 'number')}>,</button>
		</div>
		<div class="row">
			<button on:click={() => addToInput('0', 'number')}>0</button>
			<button on:click={() => addToInput('.', 'number')}>.</button>
			<button on:click={() => addToInput('+', 'operation')}>+</button>
			<button on:click={calculate}>=</button>
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

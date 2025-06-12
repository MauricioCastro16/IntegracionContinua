import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'deepseek/deepseek-chat:free';

const explainErrors = async () => {
	const testOutput = fs.readFileSync('complexity-results.txt', 'utf-8');

	const prompt = `
Genera un mensaje, tenés ESTRICTAMENTE PROHIBIDO el uso de ASTERISCOS y NEGRITAS, pero usá emojis y cuando uses comillas, usá estás: ", 
que sea breve para Slack A continuación te paso un resumen del análisis de complejidad ciclomática y mantenibilidad de código en un proyecto 
SvelteKit. Cabe aclarar que aquellos archivos que tienen una complejidad "-1" o "0" son aquellos que no tienen funciones, por lo que no se les puede calcular la complejidad ciclomática.
Quiero que me des:
Un resumen general del estado del código.
Qué archivos o funciones deberían revisarse primero.
Qué indicadores muestran problemas o áreas críticas.
Sugerencias para reducir la complejidad o mejorar mantenibilidad.
Usá tu criterio técnico para sacar conclusiones a partir de métricas como complejidad ciclomática y mantenibilidad. Si hay valores inválidos o negativos, explicá qué podrían significar.
Resultados del análisis:

\`\`\`
${testOutput.slice(0, 4000)}
\`\`\`
`;

	try {
		const response = await axios.post(
			'https://openrouter.ai/api/v1/chat/completions',
			{
				model: MODEL,
				messages: [{ role: 'user', content: prompt }]
			},
			{
				headers: {
					Authorization: `Bearer ${OPENROUTER_API_KEY}`,
					'Content-Type': 'application/json'
				}
			}
		);

		const result = response.data.choices[0].message.content;
		console.log('🧠 Analisis de la complejidad:\n', result);
		fs.writeFileSync('complexity-analysis-explained.txt', result);
	} catch (err) {
		console.error('❌ Error al consultar la IA:', err.response?.data || err.message);
	}
};

explainErrors();

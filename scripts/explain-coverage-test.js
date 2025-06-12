import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'deepseek/deepseek-chat:free';

const explainErrors = async () => {
	const testOutput = fs.readFileSync('coverage-test-result.txt', 'utf-8');

	const prompt = `
Genera un mensaje sin uso de negritas ni itálicas, pero con emojis y cuando uses comillas, usá estás: ", que sea breve para Slack sobre el estado de la cobertura de pruebas del proyecto, basándote en la siguiente tabla de cobertura. El mensaje debe ser claro, conciso, y resaltar las áreas clave, incluyendo los archivos que tienen baja cobertura y las áreas que están bien cubiertas. Aquí está la tabla de cobertura:

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
		console.log('🧠 Explicación de la cobertura:\n', result);
		fs.writeFileSync('coverage-test-explained.txt', result);
	} catch (err) {
		console.error('❌ Error al consultar la IA:', err.response?.data || err.message);
	}
};

explainErrors();

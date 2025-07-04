import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'deepseek/deepseek-chat:free';

const explainErrors = async () => {
	const testOutput = fs.readFileSync('unit-test-result.txt', 'utf-8');

	const prompt = `
El siguiente es un resultado de test automatizado. Resumí en español qué falló y por qué, en lenguaje claro y entendible para alguien 
que no es técnico y de forma muy resumida, y cuando uses comillas, usá estas ":

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
		console.log('🧠 Explicación del error:\n', result);
		fs.writeFileSync('unit-test-explained.txt', result);
	} catch (err) {
		console.error('❌ Error al consultar la IA:', err.response?.data || err.message);
	}
};

explainErrors();

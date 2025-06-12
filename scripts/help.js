import chalk from 'chalk';

console.log(`
Comandos disponibles:
${chalk.bold.green('- npm run help:')} ${chalk.blue('Mostrar este mensaje de ayuda.')}

${chalk.magenta('Comandos nativos de svelte.kit:\n')}${chalk.red('npm run...')}
${chalk.bold.green('- ... dev:')} ${chalk.blue('Deploy local.')}
${chalk.bold.green('- ... build:')} ${chalk.blue('Build local.')}
${chalk.bold.green('- ... preview:')} ${chalk.blue('Visualizar la build.')}
${chalk.bold.green('- ... check:')} ${chalk.blue('Realizar checkeo de tipos y de Svelte.')}
${chalk.bold.green('- ... format:')} ${chalk.blue('Formatear el código usando Prettier.')}
${chalk.bold.green('- ... lint:')} ${chalk.blue('Valida el formato y realiza un linteo.')}
${chalk.magenta('Testing:\n')}${chalk.red('npm run...')}
${chalk.bold.green('- ... test:')} ${chalk.blue('Corre los test unitarios.')}
${chalk.bold.green('- ... test-e2e:')} ${chalk.blue('Corre los test E2E.')}
${chalk.bold.green('- ... test:e2e:change')} ${chalk.gray('(local || render)')} ${chalk.bold.green(':')} ${chalk.blue('Cambia el entorno de los test E2E a local o render.')}
${chalk.bold.green('- ... coverage:')} ${chalk.blue('Genera un reporte de cobertura de test.')}
${chalk.magenta('Docker:\n')}${chalk.red('npm run...')}
${chalk.bold.green('- ... docker:build:')} ${chalk.blue('Crear una imagen Docker.')}
${chalk.bold.green('- ... docker:run:')} ${chalk.blue('Corre el contenedor Docker.')}
${chalk.bold.green('- ... docker:stop:')} ${chalk.blue('Detiene el contenedor Docker.')}
${chalk.bold.green('- ... docker:rm:')} ${chalk.blue('Borra el contenedor Docker.')}
${chalk.bold.green('- ... docker:rebNrun:')} ${chalk.blue('Reconstruir y correr el contenedor Docker.')}
${chalk.magenta('Apertura:\n')}${chalk.red('npm run...')}
${chalk.bold.green('- ... open:')} ${chalk.blue('Abrir todas las aplicaciones.')}
${chalk.bold.green('- ... open:jenkins:')} ${chalk.blue('Portear Jenkins local a Ngrok y abrirlo en el navegador.')}
${chalk.magenta('Github:\n')}${chalk.red('npm run...')}
${chalk.bold.green('- ... commit:')} ${chalk.blue('Realizar un commit interactivo.')}
${chalk.bold.green('- ... push:')} ${chalk.blue('Realizar un push y verificar los archivos pusheados.')}`);

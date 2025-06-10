import simpleGit from 'simple-git';
import inquirer from 'inquirer';

const git = simpleGit();

async function gitFlow() {
	try {
		// Obtener la rama actual
		const branch = await git.revparse(['--abbrev-ref', 'HEAD']);
		console.log(`Estás en la rama: ${branch}`);

		// Flujo dependiendo de la rama actual
		if (branch === 'main') {
			//Estás en la rama de main
			const response = await inquirer.prompt([
				{
					type: 'list',
					name: 'action',
					message: '¿Qué quieres hacer en la rama main?',
					choices: [
						{ name: 'Hacer checkout a development', value: 'checkout_development' },
						{ name: 'Crear una branch de hotfix', value: 'create_hotfix' },
						{ name: 'Hacer checkout a un hotfix ya existente', value: 'checkout_hotfix' }
					]
				}
			]);

			if (response.action === 'checkout_development') {
				await git.checkout('development');
				console.log('Cambiado a la rama development');
			} else if (response.action === 'create_hotfix') {
				const { hotfixName } = await inquirer.prompt([
					{
						type: 'input',
						name: 'hotfixName',
						message: 'Ingresa el nombre del hotfix:',
						default: 'Hfx-'
					}
				]);
				await git.checkoutLocalBranch(`Hfx-${hotfixName}`);
				console.log(`Creada y cambiada a la rama Hfx-${hotfixName}`);
            } else if (response.action === 'checkout_hotfix') {
                const hotfixBranches = await git.branch();
                const hotfixes = hotfixBranches.all.filter((b) => b.startsWith('Hfx-'));

                if (hotfixes.length === 0) {
                    // Si no hay ramas de hotfix, informa al usuario y ofrécele la opción de crear una nueva
                    console.log('No hay ramas de hotfix disponibles.');
                    const { createNewHotfix } = await inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'createNewHotfix',
                            message: '¿Quieres crear una nueva rama de hotfix?',
                            default: true
                        }
                    ]);

                    if (createNewHotfix) {
                        const { hotfixName } = await inquirer.prompt([
                            {
                                type: 'input',
                                name: 'hotfixName',
                                message: 'Ingresa el nombre del hotfix:',
                                default: 'Hfx-'
                            }
                        ]);
                        await git.checkoutLocalBranch(`Hfx-${hotfixName}`);
                        console.log(`Creada y cambiada a la rama Hfx-${hotfixName}`);
                    } else {
                        console.log('No se creará ninguna rama de hotfix.');
                    }
                } else {
                    // Si hay ramas de hotfix, muestra el prompt para que el usuario seleccione una
                    const { hotfixBranch } = await inquirer.prompt([
                        {
                            type: 'list',
                            name: 'hotfixBranch',
                            message: 'Selecciona una rama de hotfix existente:',
                            choices: hotfixes
                        }
                    ]);
                    await git.checkout(hotfixBranch);
                    console.log(`Cambiado a la rama ${hotfixBranch}`);
                }
            }              
		} else if (branch === 'development') {
			//Estás en la rama de development
			const response = await inquirer.prompt([
				{
					type: 'list',
					name: 'action',
					message: '¿Qué quieres hacer en la rama development?',
					choices: [
						{ name: 'Crear una branch de feature', value: 'create_feature' },
						{ name: 'Crear una branch de release', value: 'create_release' },
						{ name: 'Hacer checkout a una branch de feature existente', value: 'checkout_feature' },
						{ name: 'Hacer checkout a una branch de release existente', value: 'checkout_release' }
					]
				}
			]);

			if (response.action === 'create_feature') {
				const { featureName } = await inquirer.prompt([
					{
						type: 'input',
						name: 'featureName',
						message: 'Ingresa el nombre de la feature:',
						default: 'F-'
					}
				]);
				await git.checkoutLocalBranch(`F-${featureName}`);
				console.log(`Creada y cambiada a la rama F-${featureName}`);
			} else if (response.action === 'create_release') {
				const { releaseName } = await inquirer.prompt([
					{
						type: 'input',
						name: 'releaseName',
						message: 'Ingresa el nombre del release:',
						default: 'R-'
					}
				]);
				await git.checkoutLocalBranch(`R-${releaseName}`);
				console.log(`Creada y cambiada a la rama R-${releaseName}`);
			} else if (response.action === 'checkout_feature') {
				const branches = await git.branch();
				const featureReleaseBranches = branches.all.filter((b) => b.startsWith('F-'));
				const { branchName } = await inquirer.prompt([
					{
						type: 'list',
						name: 'branchName',
						message: 'Selecciona una rama de feature existente:',
						choices: featureReleaseBranches
					}
				]);
				await git.checkout(branchName);
				console.log(`Cambiado a la rama ${branchName}`);
			} else if (response.action === 'checkout_release') {
				const branches = await git.branch();
				const featureReleaseBranches = branches.all.filter((b) => b.startsWith('R-'));
				const { branchName } = await inquirer.prompt([
					{
						type: 'list',
						name: 'branchName',
						message: 'Selecciona una rama de release existente:',
						choices: featureReleaseBranches
					}
				]);
				await git.checkout(branchName);
				console.log(`Cambiado a la rama ${branchName}`);
			}
		} else if (branch.startsWith('F-')) {
			//Estás en una rama de feature
			const response = await inquirer.prompt([
				{
					type: 'list',
					name: 'action',
					message: '¿Qué quieres hacer en la rama feature?',
					choices: [{ name: 'Hacer merge a development', value: 'merge_development' }]
				}
			]);

			if (response.action === 'merge_development') {
				await git.checkout('development');
				await git.merge(branch, ['--no-ff']); // Forzar un merge commit
				await git.branch(['-d', branch]); // Borrar la rama de feature
				console.log(`Merge de ${branch} a development realizado y rama ${branch} eliminada`);
			}
		} else if (branch.startsWith('Hfx-')) {
			const response = await inquirer.prompt([
				{
					type: 'list',
					name: 'action',
					message: '¿Qué quieres hacer en la rama hotfix?',
					choices: [{ name: 'Hacer merge a main y development', value: 'merge_main_development' }]
				}
			]);

			if (response.action === 'merge_main_development') {
				await git.checkout('main');
				await git.merge(branch, ['--no-ff']);
				await git.checkout('development');
				await git.merge(branch, ['--no-ff']);
				await git.branch(['-d', branch]); // Borrar la rama de hotfix
				console.log(`Merge de ${branch} a main y development realizado y rama ${branch} eliminada`);
			}
		} else if (branch.startsWith('R-')) {
			const response = await inquirer.prompt([
				{
					type: 'list',
					name: 'action',
					message: '¿Qué quieres hacer en la rama release?',
					choices: [
						{
							name: 'Lanzar release (hacer pull request a main y merge a development)',
							value: 'launch_release'
						}
					]
				}
			]);

			if (response.action === 'launch_release') {
				// Hacer el merge de release a main y development
				await git.checkout('main');
				await git.merge(branch, ['--no-ff']);
				await git.checkout('development');
				await git.merge(branch, ['--no-ff']);
				console.log(`Merge de ${branch} a main y development realizado`);
			}
		}
	} catch (error) {
		console.error('Error en el flujo Git:', error);
	}
}

gitFlow();

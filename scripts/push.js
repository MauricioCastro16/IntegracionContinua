import simpleGit from 'simple-git';
import chalk from 'chalk';

const git = simpleGit();

const run = async () => {
  try {
    const branch = await git.revparse(['--abbrev-ref', 'HEAD']);

    // Ver qué commits están por ser pusheados
    const remote = `origin/${branch}`;
    const diffRange = `${remote}..${branch}`;

    const log = await git.log([diffRange]);

    if (!log.total) {
      console.log(chalk.yellow('⚠️ No hay commits nuevos para pushear.'));
      return;
    }

    // Mostrar los commits que se van a pushear
    console.log(chalk.green(`📝 Commits a pushear en rama ${chalk.cyan(branch)}:`));
    for (const commit of log.all.reverse()) {
      console.log(`🔸 ${chalk.blue(commit.hash.substring(0, 7))} - ${commit.message}`);
      if (commit.body?.trim()) {
        console.log(`   ${chalk.gray(commit.body.trim())}`);
      }
    }

    // Hacer el push
    await git.push('origin', branch);
    console.log(chalk.green('✅ Push exitoso.'));

  } catch (err) {
    console.error(chalk.red('❌ Error al hacer el push:'), err.message || err);
  }
};

run();

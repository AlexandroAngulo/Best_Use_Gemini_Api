import { Octokit } from '@octokit/core';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export const WORKFLOWS = {
  GITHUB_FLOW: 'GitHub Flow',
  GIT_FLOW: 'Git Flow Clásico',
  TRUNK_BASED: 'Trunk Based Development',
  GITLAB_FLOW: 'GitLab Flow',
  ONE_FLOW: 'One Flow'
};

export async function generateSetupScript(repoUrl: string, workflowType: string) {
  // Extract owner and repo name from URL
  // Example: https://github.com/user/repo -> user, repo
  const urlParts = repoUrl.replace('https://github.com/', '').split('/');
  const owner = urlParts[0];
  const repo = urlParts[1]?.replace('.git', '');

  if (!owner || !repo) {
    throw new Error('URL de repositorio inválida');
  }

  let script = `#!/bin/bash\n\n`;
  script += `# Proyecto: ${repo}\n`;
  script += `# Workflow: ${workflowType}\n\n`;
  script += `# 1. Clonar el repositorio\n`;
  script += `git clone ${repoUrl}\n`;
  script += `cd ${repo}\n\n`;

  script += `# 2. Configuración de ramas según ${workflowType}\n`;

  switch (workflowType) {
    case WORKFLOWS.GIT_FLOW:
      script += `git checkout -b develop\n`;
      script += `git push -u origin develop\n`;
      script += `# El flujo Git Flow usa main para producción y develop para integración\n`;
      break;
    
    case WORKFLOWS.GITLAB_FLOW:
      script += `git checkout -b pre-production\n`;
      script += `git checkout -b production\n`;
      script += `git push -u origin pre-production production\n`;
      script += `# GitLab Flow usa ramas de entorno (pre-production, production)\n`;
      break;

    case WORKFLOWS.ONE_FLOW:
      script += `# One Flow usa ramas de release basadas en tags o versiones\n`;
      script += `git checkout -b release/v1.0.0\n`;
      script += `git push -u origin release/v1.0.0\n`;
      break;

    case WORKFLOWS.TRUNK_BASED:
      script += `# Trunk Based Development: Todo el equipo trabaja sobre main\n`;
      script += `# Se recomiendan ramas de vida muy corta\n`;
      break;

    case WORKFLOWS.GITHUB_FLOW:
    default:
      script += `# GitHub Flow: main es siempre desplegable, usa feature branches\n`;
      break;
  }

  script += `\n# 3. Scaffolding inicial\n`;
  script += `mkdir src tests docs\n`;
  script += `touch .gitignore README.md\n`;
  script += `echo "# ${repo}" > README.md\n\n`;
  
  script += `echo "¡Configuración completada con éxito para ${workflowType}!"\n`;

  return script;
}

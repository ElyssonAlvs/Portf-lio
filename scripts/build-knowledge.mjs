import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { educationList } from '../src/data/education.ts';
import { experiences } from '../src/data/experience.ts';
import { projects } from '../src/data/projects.ts';
import { publications } from '../src/data/publications.ts';
import { skillCategories } from '../src/data/skills.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DEFAULT_OUTPUT_PATH = path.resolve(__dirname, '../src/data/knowledge.json');

/**
 * Parses local github.txt file into structured repository records.
 * @param {string} textContent
 * @returns {Array<{ name: string, html_url: string, description: string, language: string, stargazers_count: number }>}
 */
export function parseGithubTxt(textContent) {
  const lines = textContent.split(/\r?\n/);
  const repos = [];
  let currentRepo = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Skip the principal profile link
    if (line.includes('ElyssonAlvs -> Github Principal')) continue;

    // Detect repo URL
    const repoMatch = line.match(/^https:\/\/github\.com\/ElyssonAlvs\/([a-zA-Z0-9_.-]+)/i);
    if (repoMatch) {
      if (currentRepo) {
        repos.push(currentRepo);
      }
      currentRepo = {
        name: repoMatch[1],
        html_url: `https://github.com/ElyssonAlvs/${repoMatch[1]}`,
        description: '',
        language: 'Various',
        stargazers_count: 0,
      };
      continue;
    }

    // Detect Desc: line
    if (currentRepo && line.startsWith('Desc:')) {
      currentRepo.description = line.replace(/^Desc:\s*/, '').trim();
    }
  }

  if (currentRepo) {
    repos.push(currentRepo);
  }

  return repos;
}

/**
 * Loads fallback repositories from local github.txt.
 * @returns {Array}
 */
export function getLocalFallbackRepos() {
  const githubTxtPath = path.join(DATA_DIR, 'github.txt');
  if (fs.existsSync(githubTxtPath)) {
    const raw = fs.readFileSync(githubTxtPath, 'utf-8');
    return parseGithubTxt(raw);
  }
  return [];
}

/**
 * Fetches recent public repositories from GitHub with fallback to local data.
 * @param {object} options
 * @param {typeof fetch} [options.fetchFn]
 * @param {number} [options.timeoutMs]
 * @param {number} [options.maxRepos]
 * @returns {Promise<Array>}
 */
export async function fetchGithubRepos({
  fetchFn = fetch,
  timeoutMs = 5000,
  maxRepos = 15,
} = {}) {
  const localFallback = getLocalFallbackRepos();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetchFn('https://api.github.com/users/ElyssonAlvs/repos?sort=updated', {
      headers: {
        'User-Agent': 'Portfolio-Knowledge-Builder',
        Accept: 'application/vnd.github.v3+json',
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      console.warn(`[build-knowledge] GitHub API responded with status ${res.status}. Falling back to local repos.`);
      return localFallback;
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      console.warn('[build-knowledge] GitHub API returned unexpected format. Falling back to local repos.');
      return localFallback;
    }

    // Map curated descriptions from local file
    const localDescMap = new Map(localFallback.map((r) => [r.name.toLowerCase(), r.description]));

    const filtered = data
      .filter((r) => !r.fork)
      .slice(0, maxRepos)
      .map((r) => ({
        name: r.name,
        html_url: r.html_url,
        description: r.description || localDescMap.get(r.name.toLowerCase()) || '',
        language: r.language || 'Unknown',
        stargazers_count: r.stargazers_count || 0,
        updated_at: r.updated_at,
        topics: r.topics || [],
      }));

    return filtered.length > 0 ? filtered : localFallback;
  } catch (err) {
    console.warn(`[build-knowledge] Unable to fetch GitHub repositories (${err.message}). Using local cache.`);
    return localFallback;
  }
}

/**
 * Consolidates all portfolio knowledge into a structured JSON payload.
 * @param {object} options
 * @param {string} [options.outputPath]
 * @param {typeof fetch} [options.fetchFn]
 * @returns {Promise<object>}
 */
export async function buildKnowledge({
  outputPath = DEFAULT_OUTPUT_PATH,
  fetchFn = fetch,
} = {}) {
  console.log('[build-knowledge] Aggregating portfolio knowledge base...');

  const githubRepos = await fetchGithubRepos({ fetchFn });

  const profile = {
    name: 'Elysson Alves de Lacerda',
    preferredName: 'Elysson Alves',
    headline: 'Desenvolvedor Backend & Engenharia de IA',
    location: 'Quixadá, Ceará, Brasil',
    email: 'elyssontech@gmail.com',
    github: 'https://github.com/ElyssonAlvs',
    linkedin: 'https://www.linkedin.com/in/elysson-alves',
    bio: {
      pt: 'Graduando em Sistemas de Informação pela Universidade Federal do Ceará (UFC). Experiência em desenvolvimento backend (NestJS, FastAPI, Node.js), modelagem de dados, arquiteturas orientadas a agentes de IA (LangGraph, MCP, BDI) e metodologias ágeis Scrum.',
      en: 'Information Systems undergraduate at Universidade Federal do Ceará (UFC). Experience in backend development (NestJS, FastAPI, Node.js), relational data modeling, AI agentic architectures (LangGraph, MCP, BDI), and agile Scrum methodologies.',
    },
    education: educationList,
    certifications: [
      'AWS Academy Graduate - AWS Academy Cloud Foundations',
      'Lean Six Sigma White Belt',
      'Linguagem de Programação Python - Básico',
      'Curso IA na Prática',
      'Ciência de Dados para Iniciantes',
    ],
    awards: [
      '1º Lugar como Melhor Trabalho (Best Paper - Melhor Resumo) na XV edição dos Encontros Universitários da UFC (2025)',
      'Top 3 Melhores Trabalhos de Graduação no WESAAC 2025 (Workshop-Escola de Sistemas de Agentes, SBBD & BRACIS 2025)',
    ],
    languages: [
      { language: 'Português', level: 'Nativo' },
      { language: 'Inglês', level: 'Intermediário / Técnico' },
      { language: 'Italiano', level: 'Básico' },
      { language: 'Russo', level: 'Básico' },
    ],
    thesis: {
      title: 'Mapeamento de Processos e BPM no Contexto do Desenvolvimento de Software: um Mapeamento Sistemático da Literatura em Organizações de Desenvolvimento de Software',
      institution: 'Universidade Federal do Ceará (UFC)',
      focus: 'Business Process Management (BPM) aplicado à engenharia de software',
      url: 'https://repositorio.ufc.br/handle/riufc/85781',
    },
  };

  const simplifiedProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subtitle: p.subtitle,
    problem: p.problem,
    solution: p.solution,
    description: p.description,
    metrics: p.metrics,
    tags: p.tags,
    adr: p.adr,
    url: p.url,
  }));

  const knowledge = {
    profile,
    skills: skillCategories,
    experience: experiences,
    projects: simplifiedProjects,
    publications,
    githubRepositories: githubRepos,
    generatedAt: new Date().toISOString(),
  };

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(knowledge, null, 2), 'utf-8');
  console.log(`[build-knowledge] Knowledge artifact generated at: ${outputPath}`);

  return knowledge;
}

// Execute when invoked directly from command line
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(__filename)
) {
  buildKnowledge()
    .then(() => {
      console.log('[build-knowledge] Done!');
    })
    .catch((err) => {
      console.error('[build-knowledge] Fatal error during build:', err);
      process.exit(1);
    });
}

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseGithubTxt,
  fetchGithubRepos,
  buildKnowledge,
} from '../scripts/build-knowledge.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Build Pipeline - build-knowledge.mjs', () => {
  it('deve fazer o parse correto de repositórios do arquivo local github.txt', () => {
    const sampleTxt = `https://github.com/ElyssonAlvs -> Github Principal
https://github.com/ElyssonAlvs/FinanceBOT
    Desc: Uma automação via n8n localhost usando Groq API
https://github.com/ElyssonAlvs/TaskAgent
    Desc: A lightweight AI agent with FastAPI`;

    const repos = parseGithubTxt(sampleTxt);
    assert.strictEqual(repos.length, 2);
    assert.strictEqual(repos[0].name, 'FinanceBOT');
    assert.strictEqual(repos[0].description, 'Uma automação via n8n localhost usando Groq API');
    assert.strictEqual(repos[0].html_url, 'https://github.com/ElyssonAlvs/FinanceBOT');
    assert.strictEqual(repos[1].name, 'TaskAgent');
  });

  it('deve consultar a API pública do GitHub e limitar a lista aos mais recentes', async () => {
    const mockFetch = async () => {
      return {
        ok: true,
        status: 200,
        json: async () => [
          {
            name: 'repo-1',
            html_url: 'https://github.com/ElyssonAlvs/repo-1',
            description: 'Recent repo 1',
            language: 'TypeScript',
            stargazers_count: 5,
            updated_at: '2026-03-01T00:00:00Z',
            fork: false,
          },
          {
            name: 'repo-2',
            html_url: 'https://github.com/ElyssonAlvs/repo-2',
            description: 'Recent repo 2',
            language: 'Python',
            stargazers_count: 3,
            updated_at: '2026-02-01T00:00:00Z',
            fork: false,
          },
        ],
      };
    };

    const repos = await fetchGithubRepos({ fetchFn: mockFetch });
    assert.strictEqual(repos.length, 2);
    assert.strictEqual(repos[0].name, 'repo-1');
    assert.strictEqual(repos[0].language, 'TypeScript');
  });

  it('deve continuar o build normalmente usando fallback local se a API do GitHub falhar ou estiver em rate limit', async () => {
    const mockFailingFetch = async () => {
      return {
        ok: false,
        status: 403,
        statusText: 'rate limit exceeded',
        json: async () => ({ message: 'API rate limit exceeded' }),
      };
    };

    const repos = await fetchGithubRepos({ fetchFn: mockFailingFetch });
    assert.ok(Array.isArray(repos));
    assert.ok(repos.length > 0, 'Fallback repositories should be loaded from local files');
    const financeBot = repos.find((r) => r.name === 'FinanceBOT');
    assert.ok(financeBot, 'FinanceBOT should be present in fallback repos');
  });

  it('deve consolidar corretamente dados de currículo, publicações, projetos e repositórios em knowledge.json estruturado', async () => {
    const testOutputPath = path.join(__dirname, 'temp-knowledge.json');

    try {
      const knowledge = await buildKnowledge({
        outputPath: testOutputPath,
        fetchFn: async () => ({
          ok: true,
          status: 200,
          json: async () => [
            {
              name: 'TaskAgent',
              html_url: 'https://github.com/ElyssonAlvs/TaskAgent',
              description: 'AI agent',
              language: 'Python',
              stargazers_count: 10,
              updated_at: '2026-03-01T00:00:00Z',
              fork: false,
            },
          ],
        }),
      });

      assert.ok(knowledge.profile, 'Knowledge must include profile');
      assert.strictEqual(knowledge.profile.name, 'Elysson Alves de Lacerda');
      assert.ok(Array.isArray(knowledge.skills), 'Knowledge must include skills array');
      assert.ok(Array.isArray(knowledge.experience), 'Knowledge must include experience array');
      assert.ok(Array.isArray(knowledge.projects), 'Knowledge must include projects array');
      assert.ok(Array.isArray(knowledge.publications), 'Knowledge must include publications array');
      assert.ok(Array.isArray(knowledge.githubRepositories), 'Knowledge must include githubRepositories');
      assert.ok(knowledge.generatedAt, 'Knowledge must have generatedAt timestamp');

      // Verify file was written to disk
      assert.ok(fs.existsSync(testOutputPath), 'Output file must exist on disk');
      const savedJson = JSON.parse(fs.readFileSync(testOutputPath, 'utf-8'));
      assert.strictEqual(savedJson.profile.name, 'Elysson Alves de Lacerda');
    } finally {
      if (fs.existsSync(testOutputPath)) {
        fs.unlinkSync(testOutputPath);
      }
    }
  });
});

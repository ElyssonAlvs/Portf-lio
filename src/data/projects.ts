export interface ArchitectureNode {
  id: string;
  label: string;
  role: { pt: string; en: string };
  detail: { pt: string; en: string };
  isGuardrail?: boolean;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: { pt: string; en: string };
  guardrail?: boolean;
}

export interface ADRRecord {
  decision: { pt: string; en: string };
  discarded: { pt: string; en: string };
  rationale: { pt: string; en: string };
}

export interface ProjectMetric {
  label: { pt: string; en: string };
  value: string;
}

export interface Project {
  id: string;
  name: string;
  category: { pt: string; en: string };
  subtitle: { pt: string; en: string };
  problem: { pt: string; en: string };
  solution: { pt: string; en: string };
  description: { pt: string; en: string };
  metrics: ProjectMetric[];
  tags: (string | { pt: string; en: string })[];
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  adr: ADRRecord;
  url: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: "agentic-triage",
    name: "Agentic Triage Engine",
    category: {
      pt: "AI Agent & Triagem Clínica",
      en: "AI Agent & Clinical Triage"
    },
    subtitle: {
      pt: "Triagem Clínica Autônoma, Roteamento Determinístico & FastMCP",
      en: "Autonomous Clinical Triage, Deterministic Routing & FastMCP"
    },
    problem: {
      pt: "Alto custo de tokens e risco de alucinação em agendamentos médicos sem supervisão humana.",
      en: "Excessive token expenditure and hallucination risk in medical scheduling without human oversight."
    },
    solution: {
      pt: "Zero-Cost Router com validações determinísticas SQL diretas, servidor FastMCP 3.4 isolado via stdio, LangGraph com checkpointing de estado e gate Human-in-the-Loop.",
      en: "Zero-Cost Router with deterministic direct SQL validation, isolated FastMCP 3.4 server via stdio, LangGraph state checkpointing, and Human-in-the-Loop gate."
    },
    description: {
      pt: "Pattern de produção para triagem clínica automatizada com Agentes de IA. Resolve o custo de tokens com Text-to-SQL em PostgreSQL ACID (<2ms e 0 tokens), orquestração cíclica no LangGraph, ferramentas isoladas via FastMCP (stdio) e governança com Human-in-the-Loop para casos graves.",
      en: "Production pattern for automated clinical triage with AI Agents. Solves token costs with Text-to-SQL on ACID PostgreSQL (<2ms and 0 tokens), cyclic LangGraph orchestration, isolated tools via FastMCP (stdio), and Human-in-the-Loop governance for severe cases."
    },
    metrics: [
      {
        label: { pt: "Validação Determinística SQL", en: "Deterministic SQL Validation" },
        value: "0 tokens / <2ms"
      },
      {
        label: { pt: "Latência de Inferência LPU", en: "LPU Inference Latency" },
        value: "Groq ~150ms"
      },
      {
        label: { pt: "Protocolo de Ferramentas", en: "Tool Protocol" },
        value: "FastMCP (stdio)"
      }
    ],
    tags: ["FastMCP", "LangGraph", "PostgreSQL", "Docker", "Groq", "Python"],
    nodes: [
      {
        id: "client",
        label: "Client / Webhook",
        role: { pt: "Gateway de Entrada", en: "Ingress Gateway" },
        detail: {
          pt: "Recebe requisições HTTP REST de pacientes e sistemas de telemedicina.",
          en: "Receives HTTP REST requests from patients and telemedicine systems."
        }
      },
      {
        id: "router",
        label: "Zero-Cost Router",
        role: { pt: "Filtro Determinístico", en: "Deterministic Filter" },
        detail: {
          pt: "Executa queries SQL diretas no PostgreSQL sem invocar LLM (0 tokens / <2ms).",
          en: "Runs direct SQL queries on PostgreSQL without invoking LLM (0 tokens / <2ms)."
        },
        isGuardrail: true
      },
      {
        id: "langgraph",
        label: "LangGraph State",
        role: { pt: "Orquestrador de Grafo", en: "Graph Orchestrator" },
        detail: {
          pt: "Gerencia a máquina de estados, memória contextual e ciclos de raciocínio.",
          en: "Manages state machine transitions, contextual memory, and reasoning loops."
        }
      },
      {
        id: "fastmcp",
        label: "FastMCP Server (stdio)",
        role: { pt: "Protocolo MCP Isolado", en: "Isolated MCP Protocol" },
        detail: {
          pt: "Executa ferramentas em processo isolado via stdio, desacoplando modelo e banco.",
          en: "Runs tools in an isolated process via stdio, decoupling model from database."
        }
      },
      {
        id: "db",
        label: "PostgreSQL ACID",
        role: { pt: "Persistência Relacional", en: "Relational Persistence" },
        detail: {
          pt: "Armazenamento transacional com isolamento estrito contra conflito de horários.",
          en: "Transactional storage with strict isolation against scheduling conflicts."
        },
        isGuardrail: true
      },
      {
        id: "hil",
        label: "HIL Supervisor Gate",
        role: { pt: "Supervisão Humana", en: "Human-in-the-Loop" },
        detail: {
          pt: "Pausa a execução (interrupt_before) para aprovação médica em casos críticos.",
          en: "Suspends execution (interrupt_before) for medical staff review in critical cases."
        },
        isGuardrail: true
      }
    ],
    edges: [
      { from: "client", to: "router", label: { pt: "Payload de Triagem", en: "Triage Payload" } },
      { from: "router", to: "db", label: { pt: "Validação SQL Direta", en: "Direct SQL Validation" }, guardrail: true },
      { from: "router", to: "langgraph", label: { pt: "Caso Complexo", en: "Complex Case" } },
      { from: "langgraph", to: "fastmcp", label: { pt: "Invocação MCP stdio", en: "MCP stdio Invocation" } },
      { from: "fastmcp", to: "db", label: { pt: "Transação ACID", en: "ACID Transaction" }, guardrail: true },
      { from: "langgraph", to: "hil", label: { pt: "Risco Elevado", en: "High Risk Detected" }, guardrail: true }
    ],
    adr: {
      decision: {
        pt: "FastMCP isolado via stdio",
        en: "FastMCP isolated via stdio"
      },
      discarded: {
        pt: "Function calling acoplado diretamente ao prompt do LLM",
        en: "Function calling coupled directly into LLM prompt"
      },
      rationale: {
        pt: "Desacopla ferramentas do modelo, reduz risco de prompt injection e isola o acesso a banco.",
        en: "Decouples tools from model runtime, mitigates prompt injection vectors, and strictly isolates DB access."
      }
    },
    url: "https://github.com/ElyssonAlvs/agentic-triage"
  },
  {
    id: "finance-bot",
    name: "FinanceBOT",
    category: {
      pt: "Assistente Financeiro com RAG",
      en: "Financial AI Assistant & RAG"
    },
    subtitle: {
      pt: "Assistente Financeiro com RAG Híbrido & n8n",
      en: "Financial Assistant with Hybrid RAG & n8n"
    },
    problem: {
      pt: "Fricção em planilhas e imprecisão de cálculos numéricos em busca vetorial pura.",
      en: "Friction in spreadsheets and numeric inaccuracy in pure vector searches."
    },
    solution: {
      pt: "Persistência Híbrida combinando Analytics Exato em Python para somas e ChromaDB para busca semântica, orquestrados via n8n.",
      en: "Hybrid Persistence combining exact Python Analytics for arithmetic and ChromaDB for semantic search, orchestrated via n8n."
    },
    description: {
      pt: "Assistente financeiro no Telegram para controle de gastos e conciliação bancária. Integra LLMs de alta velocidade (Llama 3.3 70B via Groq) a banco vetorial ChromaDB com RAG híbrido (embeddings e buscas em CSV) e automação de eventos no n8n.",
      en: "Financial assistant on Telegram for expense tracking and bank reconciliation. Integrates high-speed LLMs (Llama 3.3 70B via Groq) with ChromaDB vector store using Hybrid RAG (embeddings and CSV search) and event automation in n8n."
    },
    metrics: [
      {
        label: { pt: "Estratégia de Busca RAG", en: "RAG Search Strategy" },
        value: "Híbrida (CSV + ChromaDB)"
      },
      {
        label: { pt: "Modelo de Linguagem", en: "Language Model" },
        value: "Groq Llama 3.3 70B"
      },
      {
        label: { pt: "Automação de Eventos", en: "Event Automation" },
        value: "n8n Webhook Switch"
      }
    ],
    tags: ["Python", "n8n", "Groq", "ChromaDB", "Telegram", "FastAPI"],
    nodes: [
      {
        id: "telegram",
        label: "Telegram User",
        role: { pt: "Interface Conversacional", en: "Conversational UI" },
        detail: {
          pt: "Envio de mensagens de áudio e texto de despesas cotidianas.",
          en: "Everyday expense submissions via voice notes and text messages."
        }
      },
      {
        id: "n8n",
        label: "n8n Master Switch",
        role: { pt: "Roteador de Webhook", en: "Webhook Router" },
        detail: {
          pt: "Recebe o payload do Telegram, sanitiza entradas e direciona eventos.",
          en: "Receives Telegram payload, sanitizes inputs, and routes events."
        },
        isGuardrail: true
      },
      {
        id: "groq",
        label: "Groq Llama 3.3",
        role: { pt: "Inferência LPU 70B", en: "70B LPU Inference" },
        detail: {
          pt: "Extrai entidades estruturadas (valor, data, categoria) com latência ultra-baixa.",
          en: "Extracts structured entities (value, date, category) with ultra-low latency."
        }
      },
      {
        id: "fastapi",
        label: "FastAPI Service",
        role: { pt: "Motor Analítico Determinístico", en: "Deterministic Engine" },
        detail: {
          pt: "Executa somas, balanços e agregações numéricas com exatidão determinística.",
          en: "Executes summations, balances, and aggregations with deterministic accuracy."
        },
        isGuardrail: true
      },
      {
        id: "chromadb",
        label: "ChromaDB Vector Store",
        role: { pt: "Banco Vetorial", en: "Vector Database" },
        detail: {
          pt: "Indexa histórico para busca contextual e correlação semântica de despesas.",
          en: "Indexes transaction history for semantic search and category context."
        }
      }
    ],
    edges: [
      { from: "telegram", to: "n8n", label: { pt: "Mensagem Bruta", en: "Raw Message" } },
      { from: "n8n", to: "groq", label: { pt: "Payload Sanitizado", en: "Sanitized Payload" }, guardrail: true },
      { from: "groq", to: "fastapi", label: { pt: "Entidades JSON", en: "JSON Entities" } },
      { from: "fastapi", to: "chromadb", label: { pt: "Geração de Embeddings", en: "Embedding Indexing" } },
      { from: "fastapi", to: "n8n", label: { pt: "Resposta Validada", en: "Validated Response" }, guardrail: true }
    ],
    adr: {
      decision: {
        pt: "Persistência Híbrida (CSV/Banco + ChromaDB)",
        en: "Hybrid Persistence (CSV/DB + ChromaDB)"
      },
      discarded: {
        pt: "Vector Store puro para todas as consultas",
        en: "Pure Vector Store for all queries"
      },
      rationale: {
        pt: "Modelos vetoriais alucinam em somas exatas de despesas; a matemática deve ser resolvida por código determinístico.",
        en: "Vector models hallucinate on exact arithmetic aggregations; math must be executed by deterministic code."
      }
    },
    url: "https://github.com/ElyssonAlvs/FinanceBOT",
    image: "/projects/FinanceBOTV1.jpg"
  },
  {
    id: "task-agent",
    name: "TaskAgentV2",
    category: {
      pt: "Multiagente Dual-Engine",
      en: "Dual-Engine Multi-Agent"
    },
    subtitle: {
      pt: "Orquestrador Assíncrono Dual-Engine (LangGraph & CrewAI)",
      en: "Asynchronous Dual-Engine Orchestrator (LangGraph & CrewAI)"
    },
    problem: {
      pt: "Trade-off entre autonomia para linguagem ambígua vs. regras estritas sem improvisação.",
      en: "Trade-off between autonomy for ambiguous language vs. strict rules without improvisation."
    },
    solution: {
      pt: "Arquitetura Dual-Engine desacoplada permitindo alternar entre CrewAI (criativo/colaborativo) e LangGraph (grafo estrito).",
      en: "Decoupled Dual-Engine architecture switching between CrewAI (collaborative) and LangGraph (strict graph)."
    },
    description: {
      pt: "Motor assíncrono para orquestração de agentes autônomos baseado em grafos de decisão. Arquitetura Dual-Engine que integra LangGraph e CrewAI com validação estrita via Pydantic, queries no PostgreSQL e roteamento dinâmico entre modelos locais (Ollama) e nuvem.",
      en: "Asynchronous decision-graph engine for autonomous agent orchestration. Dual-Engine architecture integrating LangGraph and CrewAI with strict Pydantic validation, PostgreSQL queries, and dynamic routing between local (Ollama) and cloud models."
    },
    metrics: [
      {
        label: { pt: "Arquitetura de Motores", en: "Engine Architecture" },
        value: "Dual-Engine (LangGraph + CrewAI)"
      },
      {
        label: { pt: "Validação & Tipagem", en: "Validation & Typing" },
        value: "Pydantic v2 + PostgreSQL"
      },
      {
        label: { pt: "Roteamento de Modelos", en: "Model Routing" },
        value: "Ollama Local + Nuvem"
      }
    ],
    tags: ["Python", "FastAPI", "LangGraph", "CrewAI", "PostgreSQL", "Docker"],
    nodes: [
      {
        id: "ui",
        label: "Web Chat UI",
        role: { pt: "Interface do Usuário", en: "Client Web Interface" },
        detail: {
          pt: "Ponto de entrada onde operadores submetem instruções e metas de tarefas.",
          en: "Operator portal for submitting workflow goals and instructions."
        }
      },
      {
        id: "gateway",
        label: "FastAPI Gateway",
        role: { pt: "Roteador Dual-Engine", en: "Dual-Engine Router" },
        detail: {
          pt: "Analisa a complexidade e direciona para CrewAI ou LangGraph.",
          en: "Analyzes request complexity and directs to either CrewAI or LangGraph."
        },
        isGuardrail: true
      },
      {
        id: "crewai",
        label: "CrewAI (3 Especialistas)",
        role: { pt: "Motor Multiagente Autônomo", en: "Autonomous Multi-Agent" },
        detail: {
          pt: "Planejador, Executor e Revisor colaborando em metas abertas.",
          en: "Planner, Executor, and Reviewer collaborating on open-ended goals."
        }
      },
      {
        id: "langgraph",
        label: "LangGraph (Fluxo Estrito)",
        role: { pt: "Motor de Grafo Determinístico", en: "Deterministic Graph" },
        detail: {
          pt: "Grafo de transições fixas para operações que proíbem improvisos.",
          en: "Fixed-transition graph for zero-divergence critical operations."
        },
        isGuardrail: true
      },
      {
        id: "domain_db",
        label: "Task Domain DB",
        role: { pt: "Banco Relacional PostgreSQL", en: "PostgreSQL Domain DB" },
        detail: {
          pt: "Persistência com transações ACID, log de auditoria e status de tarefas.",
          en: "ACID transactions, audit logs, and workflow status persistence."
        },
        isGuardrail: true
      }
    ],
    edges: [
      { from: "ui", to: "gateway", label: { pt: "Instrução de Tarefa", en: "Task Instruction" } },
      { from: "gateway", to: "crewai", label: { pt: "Entrada Ambígua", en: "Ambiguous Goal" } },
      { from: "gateway", to: "langgraph", label: { pt: "Fluxo Estrito", en: "Strict Workflow" }, guardrail: true },
      { from: "crewai", to: "domain_db", label: { pt: "Persistência de Resultados", en: "Result Storage" } },
      { from: "langgraph", to: "domain_db", label: { pt: "Checkpointing ACID", en: "ACID Checkpointing" }, guardrail: true }
    ],
    adr: {
      decision: {
        pt: "Dual-Engine Switchable (CrewAI + LangGraph)",
        en: "Switchable Dual-Engine (CrewAI + LangGraph)"
      },
      discarded: {
        pt: "Agente único monolítico com prompt generalista",
        en: "Monolithic single agent with generalist prompt"
      },
      rationale: {
        pt: "Permite alternar entre criatividade para entradas vagas e determinismo para operações críticas sem risco de desvios.",
        en: "Allows toggling between creative exploration for vague inputs and strict determinism for critical operations."
      }
    },
    url: "https://github.com/ElyssonAlvs/TaskAgentV2",
    image: "/projects/TaskAgentV2.png"
  },
  {
    id: "stock-fastapi",
    name: "Stock_FASTAPI",
    category: {
      pt: "API REST de Alta Concorrência",
      en: "High-Concurrency REST API"
    },
    subtitle: {
      pt: "API RESTful de Alta Concorrência & Integridade ACID",
      en: "High-Concurrency RESTful API & ACID Integrity"
    },
    problem: {
      pt: "Concorrência em estoque, rastreabilidade de schema e senhas vulneráveis.",
      en: "Inventory concurrency race conditions, schema drift, and vulnerable passwords."
    },
    solution: {
      pt: "PostgreSQL 16 com controle transacional ACID, versionamento com Alembic, Argon2-CFFI e operações em lote.",
      en: "PostgreSQL 16 with ACID transactional control, Alembic versioning, Argon2-CFFI, and batch operations."
    },
    description: {
      pt: "API RESTful de gestão de estoque desenhada para alta concorrência e integridade transacional ACID. Controle de migrações com Alembic, autenticação stateless JWT com hashing Argon2-CFFI, endpoints para operações em lote (bulk) e Docker Compose.",
      en: "RESTful inventory management API engineered for high concurrency and ACID transactional integrity. Schema migration control with Alembic, stateless JWT authentication with Argon2-CFFI hashing, bulk operation endpoints, and Docker Compose."
    },
    metrics: [
      {
        label: { pt: "Integridade Transacional", en: "Transactional Integrity" },
        value: "100% ACID Concorrente"
      },
      {
        label: { pt: "Versionamento de Schema", en: "Schema Versioning" },
        value: "Alembic Migrations"
      },
      {
        label: { pt: "Segurança de Credenciais", en: "Credential Security" },
        value: "Argon2-CFFI (OWASP)"
      }
    ],
    tags: ["Python", "FastAPI", "PostgreSQL", "Alembic", "Docker", "Argon2", "JWT"],
    nodes: [
      {
        id: "client",
        label: "HTTP REST Client",
        role: { pt: "Aplicações & Sistemas", en: "Consumer Systems" },
        detail: {
          pt: "Requisições HTTP simultâneas de checkout e controle de estoque.",
          en: "Concurrent checkout and inventory management HTTP requests."
        }
      },
      {
        id: "auth",
        label: "JWT Auth + Argon2",
        role: { pt: "Segurança Criptográfica", en: "Cryptographic Security" },
        detail: {
          pt: "Tokens stateless JWT e hash de senha Argon2 resistente a ataques por GPU.",
          en: "Stateless JWT tokens and GPU-resistant Argon2 password hashing."
        },
        isGuardrail: true
      },
      {
        id: "service",
        label: "Stock Service (Batch)",
        role: { pt: "Camada de Negócio", en: "Domain Service Layer" },
        detail: {
          pt: "Validações de regras de saldo, operações em lote e soft-delete.",
          en: "Inventory balance rules, atomic batch inserts, and soft-delete."
        },
        isGuardrail: true
      },
      {
        id: "alembic",
        label: "Alembic Schema Versioning",
        role: { pt: "Versionamento de Schema", en: "Schema Versioning" },
        detail: {
          pt: "Migrações declarativas e auditáveis impedindo drift estrutural.",
          en: "Declarative, auditable migrations preventing schema drift."
        }
      },
      {
        id: "postgres",
        label: "PostgreSQL 16 Engine",
        role: { pt: "Banco Relacional ACID", en: "ACID Relational Engine" },
        detail: {
          pt: "Transações atômicas com locks seletivos para impedir overselling.",
          en: "Atomic transactions with selective row locks to prevent overselling."
        },
        isGuardrail: true
      }
    ],
    edges: [
      { from: "client", to: "auth", label: { pt: "Bearer JWT", en: "Bearer JWT" } },
      { from: "auth", to: "service", label: { pt: "Requisição Autenticada", en: "Authenticated Request" }, guardrail: true },
      { from: "service", to: "postgres", label: { pt: "Transação Atômica", en: "Atomic Transaction" }, guardrail: true },
      { from: "alembic", to: "postgres", label: { pt: "Schema Migrations", en: "Schema Migrations" }, guardrail: true }
    ],
    adr: {
      decision: {
        pt: "Argon2-CFFI + Alembic",
        en: "Argon2-CFFI + Alembic"
      },
      discarded: {
        pt: "Bcrypt legado e sincronização manual de tabelas",
        en: "Legacy Bcrypt and manual table synchronization"
      },
      rationale: {
        pt: "Resistência comprovada a ataques de força bruta com GPU (OWASP) e histórico auditável de migrations.",
        en: "Proven resistance to GPU brute-force attacks (OWASP) and auditable migration history."
      }
    },
    url: "https://github.com/ElyssonAlvs/Stock_FASTAPI"
  }
];

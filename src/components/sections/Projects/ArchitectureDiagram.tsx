import { useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../../../i18n/translations';
import type { Project } from '../../../data/projects';
import styles from './ArchitectureDiagram.module.css';

interface ArchitectureDiagramProps {
  project: Project;
  language: 'pt' | 'en';
}

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const ShieldAlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const ArchitectureDiagram = ({ project, language }: ArchitectureDiagramProps) => {
  const [scenario, setScenario] = useState<'nominal' | 'defense'>('nominal');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(project.nodes[0]?.id || '');

  const t = translations[language].pipeline;
  const isDefense = scenario === 'defense';
  const selectedNode = project.nodes.find((n) => n.id === selectedNodeId) || project.nodes[0];

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % project.nodes.length;
      const nextNode = project.nodes[nextIndex];
      if (nextNode) {
        setSelectedNodeId(nextNode.id);
        document.getElementById(`stage-tab-${nextNode.id}`)?.focus();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + project.nodes.length) % project.nodes.length;
      const prevNode = project.nodes[prevIndex];
      if (prevNode) {
        setSelectedNodeId(prevNode.id);
        document.getElementById(`stage-tab-${prevNode.id}`)?.focus();
      }
    }
  };

  return (
    <section
      aria-label={`${project.name} Architecture Pipeline`}
      className="w-full flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[var(--card-shadow)]"
    >
      {/* Top Bar: Título da Topologia & Seletor de Cenário */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[var(--border)] bg-[var(--surface-inset)] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider">
            {language === 'pt' ? 'Topologia do Pipeline' : 'Pipeline Topology'}
          </span>

          <div
            className="inline-flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--surface)] relative"
            role="tablist"
            aria-label={language === 'pt' ? 'Alternador de Cenário de Arquitetura' : 'Architecture Scenario Toggle'}
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isDefense}
              tabIndex={0}
              onClick={() => setScenario('nominal')}
              className={`relative z-10 px-3 py-1.5 rounded-md font-mono text-xs transition-colors duration-200 cursor-pointer ${
                !isDefense
                  ? 'text-white font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {!isDefense && (
                <motion.div
                  layoutId="activeScenarioPill"
                  className="absolute inset-0 rounded-md bg-[var(--accent)] shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              {t.nominal}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isDefense}
              tabIndex={0}
              onClick={() => setScenario('defense')}
              className={`relative z-10 px-3 py-1.5 rounded-md font-mono text-xs transition-colors duration-200 flex items-center gap-1.5 cursor-pointer ${
                isDefense
                  ? 'text-white font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isDefense && (
                <motion.div
                  layoutId="activeScenarioPill"
                  className="absolute inset-0 rounded-md bg-[var(--state-guardrail)] shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {t.defense}
            </button>
          </div>
        </div>

        {/* Legenda dos Módulos */}
        <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block bg-[var(--state-verified)]" />
            <span>{t.legend_acid}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block bg-[var(--state-guardrail)]" />
            <span>{t.legend_guardrail}</span>
          </span>
        </div>
      </div>

      {/* Pipeline Semântico de Etapas: Horizontal Fluido no Desktop, Vertical no Mobile */}
      <div className="p-4 sm:p-5 w-full bg-[var(--surface)]">
        <div
          role="tablist"
          aria-label={language === 'pt' ? 'Etapas Sequenciais do Pipeline' : 'Sequential Pipeline Stages'}
          className="flex flex-col lg:flex-row lg:items-stretch gap-2.5 lg:gap-2 w-full"
        >
          {project.nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            const isNodeDefense = isDefense && Boolean(node.isGuardrail);
            const isLast = index === project.nodes.length - 1;
            const stepNumber = String(index + 1).padStart(2, '0');
            const nextNode = project.nodes[index + 1];
            const isNextGuardrail = isDefense && Boolean(nextNode?.isGuardrail);
            const streamDelay = `${index * 0.45}s`;

            return (
              <div
                key={node.id}
                className="flex flex-col lg:flex-row items-center flex-1 min-w-0"
              >
                {/* Card Interativo da Etapa */}
                <button
                  type="button"
                  role="tab"
                  id={`stage-tab-${node.id}`}
                  aria-controls={`stage-panel-${node.id}`}
                  aria-selected={isSelected}
                  tabIndex={0}
                  onClick={() => setSelectedNodeId(node.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between gap-3 cursor-pointer min-h-[120px] ${styles.nodeCard} ${
                    isSelected
                      ? `border-[var(--accent)] bg-[var(--surface-inset)] ring-2 ring-[var(--accent)]/30 ${styles.nodeSelected}`
                      : isNodeDefense
                      ? 'border-[var(--state-guardrail)] bg-[oklch(64%_0.18_25_/_0.08)] shadow-sm hover:border-[var(--state-guardrail)]'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--surface-inset)]'
                  }`}
                >
                  {/* Topo do Card: Número da Etapa + Indicador */}
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                      {stepNumber}
                    </span>

                    <span className="flex items-center gap-1.5">
                      {isNodeDefense ? (
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded bg-[oklch(64%_0.18_25_/_0.15)] text-[var(--state-guardrail)] border border-[var(--state-guardrail)]/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--state-guardrail)] animate-pulse" />
                          <span>GUARD</span>
                        </span>
                      ) : (
                        <span className={styles.activeIndicatorContainer}>
                          {isSelected && <span className={styles.activeIndicatorRing} />}
                          <span
                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                              isSelected
                                ? 'bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]'
                                : 'bg-[var(--state-verified)]'
                            }`}
                          />
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Nome Completo do Componente + Função */}
                  <div className="flex flex-col gap-1 w-full">
                    <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] leading-snug break-words">
                      {node.label}
                    </h3>
                    <p className="font-mono text-xs sm:text-[12.5px] text-[var(--text-muted)] leading-tight">
                      {node.role[language]}
                    </p>
                  </div>
                </button>

                {/* Conector Fluido com Pulso de Dados (Desktop Horizontal / Mobile Vertical) */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="flex lg:flex-row items-center justify-center my-1.5 lg:my-0 lg:px-2 shrink-0 select-none pointer-events-none"
                  >
                    {/* Desktop (Horizontal) */}
                    <div className={styles.connectorDesktop}>
                      <svg
                        width="32"
                        height="16"
                        viewBox="0 0 32 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <line
                          x1="2"
                          y1="8"
                          x2="24"
                          y2="8"
                          stroke="var(--border-strong)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          className={isNextGuardrail ? styles.defenseStreamLine : ''}
                        />
                        <polyline
                          points="21,4 27,8 21,12"
                          stroke={isNextGuardrail ? 'var(--state-guardrail)' : 'currentColor'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={isNextGuardrail ? '' : 'text-[var(--text-muted)]'}
                        />
                      </svg>
                      <div
                        className={`${styles.streamDotHorizontal} ${
                          isNextGuardrail ? styles.defenseStreamDot : ''
                        }`}
                        style={{ animationDelay: streamDelay }}
                      />
                    </div>

                    {/* Mobile (Vertical) */}
                    <div className={styles.connectorMobile}>
                      <svg
                        width="16"
                        height="28"
                        viewBox="0 0 16 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                      >
                        <line
                          x1="8"
                          y1="2"
                          x2="8"
                          y2="20"
                          stroke="var(--border-strong)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          className={isNextGuardrail ? styles.defenseStreamLine : ''}
                        />
                        <polyline
                          points="4,17 8,23 12,17"
                          stroke={isNextGuardrail ? 'var(--state-guardrail)' : 'currentColor'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={isNextGuardrail ? '' : 'text-[var(--text-muted)]'}
                        />
                      </svg>
                      <div
                        className={`${styles.streamDotVertical} ${
                          isNextGuardrail ? styles.defenseStreamDot : ''
                        }`}
                        style={{ animationDelay: streamDelay }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Painel de Inspeção Textual Direta e Limpa com Transição Cross-Fade */}
      <div
        role="tabpanel"
        id={`stage-panel-${selectedNode.id}`}
        aria-labelledby={`stage-tab-${selectedNode.id}`}
        className="px-4 sm:px-6 py-4 border-t border-[var(--border)] bg-[var(--surface-inset)] overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedNode.id}-${scenario}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3.5 w-full"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="p-1.5 rounded-lg border shrink-0 transition-colors duration-200"
                  style={{
                    borderColor: isDefense && selectedNode.isGuardrail ? 'var(--state-guardrail)' : 'var(--accent)',
                    backgroundColor: isDefense && selectedNode.isGuardrail ? 'oklch(64% 0.18 25 / 0.12)' : 'oklch(68% 0.18 250 / 0.12)',
                    color: isDefense && selectedNode.isGuardrail ? 'var(--state-guardrail)' : 'var(--accent)'
                  }}
                >
                  {isDefense && selectedNode.isGuardrail ? <ShieldAlertIcon /> : <ShieldCheckIcon />}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-bold text-[var(--text-primary)]">
                    {selectedNode.label}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)] font-semibold">
                    {selectedNode.role[language]}
                  </span>
                  {selectedNode.isGuardrail && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[oklch(64%_0.18_25_/_0.15)] text-[var(--state-guardrail)] border border-[var(--state-guardrail)] font-semibold">
                      {t.defense_module}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-xs font-mono text-[var(--text-muted)] shrink-0">
                {t.inspect_hint}
              </span>
            </div>

            {/* Explicação Textual Direta do Nó Selecionado */}
            <p className="text-sm sm:text-[14.5px] text-[var(--text-secondary)] leading-relaxed text-left max-w-4xl">
              {selectedNode.detail[language]}
            </p>

            {/* Protocolo e Garantia Técnica */}
            <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)]">
              <div>
                <span className="font-semibold text-[var(--text-secondary)]">{t.protocol}:</span>{' '}
                <span>
                  {selectedNode.isGuardrail
                    ? (language === 'pt' ? 'Isolamento de Processo & Integridade Transacional' : 'Process Isolation & Transactional Integrity')
                    : (language === 'pt' ? 'Comunicação Assíncrona & Roteamento Determinístico' : 'Async Communication & Deterministic Routing')}
                </span>
              </div>
              {isDefense && selectedNode.isGuardrail && (
                <span className="text-[var(--state-guardrail)] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  <span>{language === 'pt' ? 'Mecanismo de Defesa Ativo' : 'Active Defense Mechanism'}</span>
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

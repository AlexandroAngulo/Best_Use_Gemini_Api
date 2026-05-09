import { useState } from 'react';

interface AnalysisResult {
  recommendedStack: string[];
  requiredSkills: string[];
}

interface FeedEvent {
  id: string;
  type: 'push' | 'ai_suggestion';
  repo: string;
  message: string;
  author?: string;
  suggestion?: string;
  timestamp: string;
}

function App() {
  // Phase 1 State
  const [projectIdea, setProjectIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Phase 2 State
  const [repoUrl, setRepoUrl] = useState('');
  const [workflow, setWorkflow] = useState('GitHub Flow');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Phase 3 State
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleAnalyze = async () => {
    if (!projectIdea.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: projectIdea }),
      });
      if (!response.ok) throw new Error('Error al analizar la propuesta');
      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!repoUrl.trim()) return;
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/github/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, workflowType: workflow }),
      });
      if (!response.ok) throw new Error('Error al generar el script');
      const data = await response.json();
      setGeneratedScript(data.script);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al conectar con el servidor');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSimulatePush = async () => {
    setIsSimulating(true);
    try {
      // Mock payload
      const payload = {
        repository: { name: repoUrl ? repoUrl.split('/').pop()?.replace('.git', '') : 'mi-proyecto-demo' },
        commits: [{
          message: 'feat: added user authentication and improved security logs',
          author: { name: 'DevUser' }
        }]
      };

      const response = await fetch('http://localhost:3001/api/webhooks/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al simular el push');
      const data = await response.json();

      const newEvent: FeedEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'push',
        repo: data.repo,
        message: data.commit,
        author: data.author,
        suggestion: data.suggestion,
        timestamp: new Date().toLocaleTimeString()
      };

      setFeedEvents(prev => [newEvent, ...prev]);
    } catch (err) {
      alert('Error en la simulación: Asegúrate de que el backend esté corriendo y el bot de Telegram configurado.');
    } finally {
      setIsSimulating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              G
            </div>
            <h1 className="text-xl font-bold tracking-tight">Gemini Dev Assistant</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full animate-pulse ${isLoading || isGenerating || isSimulating ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
              {isLoading || isGenerating || isSimulating ? 'Procesando...' : 'IA Activa'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Phases 1 & 2 */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Phase 1: Análisis y Definición */}
          <section className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <div className="text-6xl font-black">01</div>
            </div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-400">
              <span className="p-1 bg-indigo-500/10 rounded">🚀</span>
              1. Análisis y Definición
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  ¿Qué quieres construir hoy?
                </label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 h-32"
                  placeholder="Ej: Una aplicación de gestión de tareas con React y Supabase..."
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleAnalyze}
                  disabled={isLoading || !projectIdea.trim()}
                  className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg flex items-center gap-2 w-fit ${
                    isLoading 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                  }`}
                >
                  {isLoading ? 'Analizando Propuesta...' : 'Analizar Propuesta'}
                  {!isLoading && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </button>
                {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
              </div>

              {analysisResult && (
                <div className="mt-8 pt-8 border-t border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Stack Recomendado</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.recommendedStack.map(tech => (
                        <span key={tech} className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Skills de IA Cargadas</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.requiredSkills.map(skill => (
                        <span key={skill} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Phase 2: Configuración del Entorno */}
          <section className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 shadow-xl relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <div className="text-6xl font-black">02</div>
            </div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-400">
              <span className="p-1 bg-emerald-500/10 rounded">⚙️</span>
              2. Configuración de Git
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Repositorio GitHub</label>
                <input 
                  type="text" 
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Flujo de Trabajo</label>
                <select 
                  value={workflow}
                  onChange={(e) => setWorkflow(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option>GitHub Flow</option>
                  <option>Git Flow Clásico</option>
                  <option>Trunk Based Development</option>
                  <option>GitLab Flow</option>
                  <option>One Flow</option>
                </select>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs border border-slate-700 mb-6 min-h-[120px] relative overflow-hidden">
              <div className="flex items-center justify-between mb-2 text-slate-500">
                <span>setup_project.sh</span>
                <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded uppercase">Bash</span>
              </div>
              <div className="text-emerald-400 whitespace-pre-wrap">
                {generatedScript || (
                  <p className="text-slate-600 italic">Introduce la URL del repositorio para generar el script...</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleGenerateScript}
                disabled={isGenerating || !repoUrl.trim()}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all"
              >
                {isGenerating ? 'Generando...' : 'Generar Script'}
              </button>
              <button 
                onClick={copyToClipboard}
                disabled={!generatedScript}
                className={`flex-1 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-lg ${
                  copyFeedback 
                  ? 'bg-green-600 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 disabled:opacity-50'
                }`}
              >
                {copyFeedback ? '¡Copiado!' : 'Copiar al Portapapeles'}
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Phase 3 Monitoring */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 shadow-xl h-full flex flex-col relative min-h-[600px]">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <div className="text-6xl font-black">03</div>
            </div>
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-rose-400">
              <span className="p-1 bg-rose-500/10 rounded">📡</span>
              3. Monitoreo en Tiempo Real
            </h2>

            <button 
              onClick={handleSimulatePush}
              disabled={isSimulating}
              className={`mb-6 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                isSimulating 
                ? 'border-slate-700 text-slate-600 cursor-wait' 
                : 'border-rose-500/50 text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              {isSimulating ? 'Simulando...' : 'Simular Evento Push'}
            </button>
            
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {feedEvents.length === 0 && !isSimulating && (
                <div className="text-center py-20">
                  <p className="text-xs text-slate-600 italic">No hay actividad reciente. Pulsa simular para ver la magia.</p>
                </div>
              )}

              {feedEvents.map((event) => (
                <div key={event.id} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  {/* Webhook Event */}
                  <div className="relative pl-6 border-l-2 border-slate-700 pb-2">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-900 border-2 border-indigo-500 rounded-full"></div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-indigo-400 uppercase">Push Event</span>
                      <span className="text-[10px] text-slate-500">{event.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 mb-2">Commit en <span className="text-indigo-300">{event.repo}</span></p>
                    <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-3 shadow-inner">
                      <p className="text-[11px] text-slate-400 italic">"{event.message}"</p>
                      <p className="text-[9px] text-slate-500 mt-2 font-mono">— {event.author}</p>
                    </div>
                  </div>

                  {/* Gemini Suggestion Card */}
                  {event.suggestion && (
                    <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-4 shadow-inner relative overflow-hidden group ml-2">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center text-[10px]">✨</div>
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-tighter">Sugerencia de Gemini</span>
                      </div>
                      <h4 className="text-[13px] font-semibold mb-2">Revisión de Código</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                        {event.suggestion}
                      </p>
                      <div className="flex gap-2">
                        <button className="text-[9px] bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-500 transition-colors uppercase font-bold">Ver Guía</button>
                        <button className="text-[9px] border border-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors uppercase font-bold">Ok</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isSimulating && (
                <div className="relative pl-6 border-l-2 border-slate-700 animate-pulse">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-900 border-2 border-yellow-500 rounded-full"></div>
                  <p className="text-xs text-yellow-500 font-bold uppercase">Procesando Webhook...</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Notificaciones: Activas</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-600 font-mono">Telegram Bot</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </section>
        </div>

      </main>

      <footer className="max-w-7xl mx-auto px-4 py-8 text-center border-t border-slate-800/50 mt-12">
        <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">
          Preview Mode • Gemini CLI Integration
        </p>
      </footer>
    </div>
  );
}

export default App;

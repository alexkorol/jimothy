import type { Deck } from '../types';

export const azureAiServices: Deck = {
  id: 'azure-ai-services',
  title: 'Azure AI Services',
  description: 'The service-picker round: which Azure AI tool for which job.',
  icon: '🔷',
  color: '#60a5fa',
  track: 'Credentials',
  cards: [
    {
      id: 'az-service-picker',
      type: 'flash',
      front: 'The Azure AI service map: recite what each major service is FOR.',
      back: 'Foundry (was AI Studio): build/deploy genAI apps and agents; the hub.\nAzure OpenAI in Foundry Models: hosted GPT-family models.\nAI Search: retrieval (vector + keyword + semantic ranking), the RAG backbone.\nDocument Intelligence: forms/PDF extraction.\nAI Language: NER, sentiment, custom text classification.\nAI Vision: image analysis and OCR.\nContent Understanding: multimodal document/media pipelines.\nContent Safety: moderation filters.\nExam questions are mostly "which service?": this map answers them.',
    },
    {
      id: 'az-search-rag',
      type: 'mcq',
      prompt: 'The standard Azure RAG retrieval layer is…',
      choices: [
        'Azure AI Search: vector, keyword, and hybrid with semantic reranking',
        'Azure SQL full-text search: CONTAINS predicates over nvarchar columns',
        'Blob storage prefix queries over containers organized by document topic',
        'Cosmos DB change feed streaming document updates straight into prompts',
      ],
      answer: 0,
      explanation:
        'AI Search is the answer to nearly every Azure retrieval question: integrated vectorization, hybrid + semantic ranker, index-time enrichment skills, and the "add your data" integration in Foundry.',
    },
    {
      id: 'az-doc-intel',
      type: 'mcq',
      prompt: 'Extract fields from thousands of invoices on Azure, which service and mode?',
      choices: [
        'Document Intelligence: prebuilt invoice model, custom if layout defies it',
        'AI Vision OCR for raw text, plus per-vendor regex to pull each invoice field',
        'Azure OpenAI vision on page screenshots, one completion per invoice',
        'A Logic Apps workflow routing each invoice to manual data entry',
      ],
      answer: 0,
      explanation:
        'Prebuilt models (invoice, receipt, ID) ship trained; custom models fine-tune on as few as ~5 labeled samples when your layout defies the prebuilts.',
    },
    {
      id: 'az-content-safety',
      type: 'mcq',
      prompt: 'Azure OpenAI content filtering: what should you know for the exam?',
      choices: [
        'Filters run on both prompt and completion, per category, with severity config',
        'Filtering is off by default until a Content Safety resource is attached',
        'Only completions are filtered; prompts always pass through unmodified',
        'Filters block all creative writing categorically, whatever severity tier is set',
      ],
      answer: 0,
      explanation:
        'Categories are hate, sexual, violence, and self-harm, plus prompt shields for jailbreaks. Filter hits surface as specific finish reasons/errors your app must handle gracefully: a favorite scenario question. Custom severity config requires justification for some tiers.',
    },
    {
      id: 'az-auth-patterns',
      type: 'mcq',
      prompt: 'Exam-grade auth ranking for calling Azure AI services from an app?',
      choices: [
        'Managed identity + RBAC > service principal + Key Vault > keys in config',
        'API keys first: they skip Entra token latency and rotate server-side',
        'Anonymous access behind strict IP firewall restrictions on the service endpoint',
        'Shared SAS tokens issued to the frontend with short expiry windows',
      ],
      answer: 0,
      explanation:
        '"No secrets to leak" beats "secrets stored well" beats "secrets in appsettings". Any exam answer containing a hardcoded key is wrong on sight.',
    },
    {
      id: 'az-quota',
      type: 'fill',
      prompt: 'Azure OpenAI throughput is provisioned in:',
      code: 'quota unit = ____ per minute (TPM),\nrate limits also expressed as RPM',
      answers: ['tokens'],
      distractors: ['requests', 'characters', 'threads'],
      explanation:
        'TPM quota is assigned per deployment from a regional pool; 429s mean backoff or a Provisioned Throughput (PTU) reservation for guaranteed capacity.',
    },
    {
      id: 'az-agent-service',
      type: 'mcq',
      prompt: 'Foundry Agent Service: what does it manage for you versus DIY agent loops?',
      choices: [
        'A hosted runtime: threads, state, tool orchestration, and tracing',
        'Nothing concrete; it is a documentation label for DIY patterns',
        'It fine-tunes an agent model on your tool schemas so no runtime loop is needed',
        'It replaces evaluation: managed runs are validated by the platform',
      ],
      answer: 0,
      explanation:
        'Built-in tools include code interpreter, search, and functions; you supply instructions and tool definitions. The managed counterpart to a hand-rolled LangGraph loop: same concepts (state, tools, routing), platform-hosted. Exam scenarios test "when managed service vs custom code": answer: compliance/speed vs control.',
    },
    {
      id: 'az-eval-foundry',
      type: 'mcq',
      prompt: 'Foundry evaluation runs measure genAI quality with metrics like…',
      choices: [
        'Groundedness, relevance, coherence, fluency, plus safety evaluations',
        'Operational metrics only: token throughput, latency percentiles, cost per call',
        'GPU utilization and memory pressure on the deployment\'s hosts',
        'Azure Monitor CPU and memory metrics for the underlying compute',
      ],
      answer: 0,
      explanation:
        'AI-assisted metrics (an LLM judge under the hood) plus traditional ones. Wiring evals into CI/CD before promotion is the pattern the exam rewards.',
    },
    {
      id: 'az-language-custom',
      type: 'mcq',
      prompt: 'Classify support tickets into your 12 custom categories, which service tier?',
      choices: [
        'AI Language custom text classification: label, train, deploy an endpoint',
        'Fine-tune GPT-4: fixed labels are the cheapest LLM fine-tuning case',
        'Prebuilt sentiment analysis, with its scores mapped onto the 12 categories',
        'Azure Functions matching keyword lists maintained per category',
      ],
      answer: 0,
      explanation:
        'The decision rule: prebuilt if it fits → custom AI Language/Vision training for narrow classifiers → LLM when labels are scarce or the task needs reasoning. Cost ascends in that order too.',
    },
    {
      id: 'az-monitor-ai',
      type: 'mcq',
      prompt: 'Tracing a misbehaving Foundry agent in production: the tooling?',
      choices: [
        'Foundry tracing + Application Insights: per-run traces of calls and tools',
        'print() statements in the agent code, read from the console output',
        'RDP into the GPU host serving your deployment and tail the inference logs',
        'A support ticket to Microsoft with the run ID for their engineers',
      ],
      answer: 0,
      explanation:
        'OpenTelemetry-based tracing shows each step of the agent loop: thoughts, tool calls, and cost, linked per run.',
    },
    {
      id: 'az-regions-data',
      type: 'mcq',
      prompt: 'Customer requires EU data residency for an Azure OpenAI app. Key controls?',
      choices: [
        'EU regions with a Data Zone or regional deployment type, private endpoints',
        'Not possible: Azure OpenAI offers no processing-location guarantees',
        'A contractual data-processing addendum; no technical control exists',
        'Only on-prem or Azure Stack works; hosted inference routes through US regions',
      ],
      answer: 0,
      explanation:
        'Deployment types (Global/Data Zone/Regional) trade quota flexibility against processing-location guarantees: a compliance scenario the exam and real sales calls both love. Customer data is also not used to train models.',
    },
    {
      id: 'az-applied-skills',
      type: 'flash',
      front: 'Azure credential ladder for an AI engineer: what stacks, in what order?',
      back: 'AI-103 (Azure AI Apps & Agents Developer) is the core credential. Microsoft Applied Skills badges: the Foundry generative chat app and Foundry agents labs; are fast public proof you can earn during exam prep, and each produces a portfolio artifact. Broader certs like the MLOps Engineer Associate or AZ-104 are worth adding only when job postings you care about ask for them. A badge is most valuable when it maps to a project you can talk about.',
    },
  ],
};

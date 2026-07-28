import type { Deck } from '../types';

export const credHfAgents: Deck = {
  id: 'cred-hf-agents',
  title: 'HF Agents Course',
  description: 'smolagents, LlamaIndex, LangGraph, and beating 30% on GAIA.',
  icon: '🤗',
  color: '#ff9d00',
  track: 'Credentials',
  cards: [
    {
      id: 'hfa-structure',
      type: 'flash',
      front: 'The Hugging Face Agents Course: structure and what the certificate requires.',
      back: 'Unit 0: onboarding.\nUnit 1: agent fundamentals (earns the fundamentals certificate).\nUnit 2: frameworks; smolagents, LlamaIndex, LangGraph.\nUnit 3: agentic RAG use case.\nUnit 4: final challenge.\nThe completion certificate requires Unit 1, a use-case assignment, and a final agent scoring 30%+ on a GAIA benchmark subset, with a student leaderboard and no deadline.',
    },
    {
      id: 'hfa-react-loop',
      type: 'mcq',
      prompt: 'The core agent cycle taught in Unit 1?',
      choices: [
        'Thought → Action → Observation, looped until the goal (ReAct)',
        'Train → Test → Deploy: each run fine-tunes on its own trajectory',
        'Prompt → Response → Done: one completion with tools inlined as text',
        'Map → Reduce → Aggregate, with each tool acting as one mapper stage',
      ],
      answer: 0,
      explanation:
        'The model reasons about what to do, emits an action (tool call), reads the result, and loops. Every framework in Unit 2 is a different way of engineering this same loop.',
    },
    {
      id: 'hfa-gaia',
      type: 'mcq',
      prompt: 'What is GAIA, the final-challenge benchmark?',
      choices: [
        'Real-world assistant tasks: multi-step reasoning, browsing, tools, files',
        'A math-proof benchmark where formal verification rejects LLM reasoning',
        'A latency benchmark ranking inference servers by tokens per second',
        'A chess-puzzle dataset where agents are graded on move quality against engines',
      ],
      answer: 0,
      explanation:
        'Questions like "which country had the fewest athletes at the 1928 Olympics per this file": humans score ~92%, unassisted LLMs a small fraction of that. The gap IS the agent: tools close it.',
    },
    {
      id: 'hfa-codeagent',
      type: 'flash',
      front: 'smolagents’ signature idea: the CodeAgent. What is it and why does it work?',
      back: 'Instead of emitting JSON tool calls, the agent writes and executes Python code as its actions. Code composes naturally (loops, conditionals, chaining several tools in one step, variables carrying state), so it needs fewer round trips than one-JSON-call-per-step. The tradeoff to name immediately: executing model-written code demands sandboxing (restricted imports, e2b-style isolation).',
    },
    {
      id: 'hfa-toolcalling-vs-code',
      type: 'mcq',
      prompt: 'smolagents offers ToolCallingAgent and CodeAgent. The difference?',
      choices: [
        'ToolCallingAgent emits JSON calls; CodeAgent writes Python that calls tools',
        'ToolCallingAgent is multi-turn; CodeAgent writes one script and runs it single-shot',
        'CodeAgent requires a code-tuned model; chat models get ToolCallingAgent',
        'Nothing: they are aliases of the same class kept for API compatibility',
      ],
      answer: 0,
      explanation:
        'Same ReAct loop, different action format. JSON is safer and more portable; code is more expressive per step: pick per task.',
    },
    {
      id: 'hfa-tool-decorator',
      type: 'fill',
      prompt: 'Turn a plain function into a smolagents tool:',
      code: '@____\ndef get_weather(city: str) -> str:\n    """Get current weather for a city."""\n    ...',
      answers: ['tool'],
      distractors: ['agent', 'function_call', 'register'],
      explanation:
        'The @tool decorator reads the signature, type hints, and docstring to build the tool spec the model sees, which is why the docstring quality directly affects whether the agent uses the tool correctly.',
    },
    {
      id: 'hfa-llamaindex',
      type: 'mcq',
      prompt: 'LlamaIndex’s role in the course lineup?',
      choices: [
        'Agents over your data: indexes, query engines, retrieval workflows',
        'A web-browsing agent that crawls live sites with no retrieval layer',
        'A training framework that fine-tunes embedding models on your docs',
        'A JavaScript-only smolagents alternative for browser deployments',
      ],
      answer: 0,
      explanation:
        'The mental map: smolagents = lightweight code-first agents, LlamaIndex = data/RAG-centric agents, LangGraph = explicit control flow. Pick by what dominates your problem: actions, data, or flow.',
    },
    {
      id: 'hfa-langgraph-unit',
      type: 'mcq',
      prompt: 'Why does the course teach LangGraph for "production-ready" agents specifically?',
      choices: [
        'Explicit graph control flow: typed state, conditional routing, checkpoints',
        'It alone scales past one machine, scheduling nodes across a GPU cluster',
        'Its typed state schema validates node outputs, so agents cannot hallucinate',
        'It is no-code: graphs are drawn in a visual editor instead of Python',
      ],
      answer: 0,
      explanation:
        'Determinism where you want it, model freedom where you need it: that’s the argument for graphs over free-running loops.',
    },
    {
      id: 'hfa-agentic-rag',
      type: 'mcq',
      prompt: 'Agentic RAG (Unit 3) differs from plain RAG how?',
      choices: [
        'The agent decides when and what to retrieve, rewriting and repeating',
        'Bigger embedding models make the single retrieval pass return better chunks',
        'No vector store: the agent reads the raw corpus via long context',
        'It only works on structured data with a schema the agent can query',
      ],
      answer: 0,
      explanation:
        'Plain RAG: retrieve once, then answer. Agentic: retrieval becomes a tool the agent calls as needed; multi-hop questions, query rewriting, choosing between search and calculation per step.',
    },
    {
      id: 'hfa-observability',
      type: 'flash',
      front: 'The observability & evaluation bonus unit: what do you instrument on an agent?',
      back: 'Trace every step: each thought, tool call, tool result, and token cost, linked by a run ID (OpenTelemetry-style tooling. Langfuse and friends). Evaluate at two levels: step level (did it pick sensible tools?) and task level (final success rate, cost per solved task, steps per task).',
    },
    {
      id: 'hfa-final-agent',
      type: 'flash',
      front: 'Design an agent that clears 30% on the GAIA subset: the practical architecture.',
      back: 'A capable model driving a ReAct/CodeAgent loop with the tools GAIA demands: web search + page reading, file inspection (CSV/Excel/images), and code execution for math. Add per-step retries and a step cap. Then the classic gotcha: GAIA grades by EXACT MATCH; a final-answer formatting pass ("number only, no commas, no units unless asked") rescues points that reasoning already earned. Most failed submissions fail on formatting, not intelligence.',
    },
    {
      id: 'hfa-fc-finetune',
      type: 'flash',
      front: 'Bonus unit: what actually happens when you fine-tune for function calling?',
      back: 'SFT (often LoRA) on conversations whose assistant turns contain structured tool calls: teaching the model the emit-a-call format natively instead of relying on prompt engineering. Worth doing for smaller local models that ignore tool instructions; pointless for frontier APIs that already do it.',
    },
    {
      id: 'hfa-observation-loop',
      type: 'flash',
      front: 'Why is the Observation step what separates an agent from a one-shot LLM response?',
      back: 'Observation feeds the REAL result of each action back into the next decision, turning generation into a control loop: the agent can react to tool failures, unexpected outputs, environment changes, and whether the goal is actually reached. Without it you have a linear pipeline that cannot correct itself.',
    },
    {
      id: 'hfa-agent-memory',
      type: 'mcq',
      prompt: 'What does agent "working memory" contain, versus plain chat history?',
      choices: [
        'The current run\'s structured record: task, tool calls, outputs, errors',
        'Only the user and assistant turns, exactly as a chat app stores them',
        'The model\'s weights, updated by fine-tuning after each completed run',
        'A vector store holding every past conversation for later lookup',
      ],
      answer: 0,
      explanation:
        'It is working memory for iterative problem-solving on THIS task, structured around actions and observations: not conversational turns, and not long-term memory across sessions.',
    },
    {
      id: 'hfa-debug-order',
      type: 'mcq',
      prompt: 'Correct order for debugging an agent system that is failing?',
      choices: [
        'Model alone, then one tool, then one agent task, then a small batch',
        'Run the full benchmark first and read the aggregate score for clues',
        'Add more tools until one of them gets the failing tasks to pass',
        'Switch frameworks first; most failures are framework-level bugs',
      ],
      answer: 0,
      explanation:
        'Isolate the smallest component first: a one-line "model works" generation before any tools, one tool call before the loop, one question before a batch. Then read the EARLIEST meaningful error in the traceback, not the loudest.',
    },
    {
      id: 'hfa-provider-debug',
      type: 'flash',
      front: 'Your agent 500s on its first call. What is the lesson about inference providers?',
      back: 'Model availability and provider routing are EXTERNAL dependencies: providers drop models, auto-routing changes, servers fail with no bug in your code. (Lived example: InferenceClientModel auto-routed to a provider returning 500s; fix was a supported model + provider="auto", verified with an isolated one-line generation first.) Production answer: retries, fallbacks, a swappable model adapter (agent and tools unchanged when HF credits ran out and the backend moved to OpenRouter), monitoring, graceful degradation.',
    },
    {
      id: 'hfa-baseline-first',
      type: 'mcq',
      prompt: 'When should multi-agent orchestration, memory systems, or a heavier framework be added to an agent?',
      choices: [
        'Only after the baseline demonstrably hits a limitation needing them',
        'From the start, so the design never needs a structural rewrite later',
        'Whenever the benchmark score plateaus, regardless of the failure mode',
        'When the framework ships a new version with those features built in',
      ],
      answer: 0,
      explanation:
        '"Boring before fancy." Framework selection follows workflow requirements, not popularity: smolagents is the shortest path to a working GAIA baseline; explicit state or orchestration earns its complexity only when the baseline exposes the need.',
    },
    {
      id: 'hfa-failure-analysis',
      type: 'flash',
      front: 'What is more informative than a benchmark score alone, and what do you log per run to get it?',
      back: 'A categorized failure analysis: WHY runs failed (format miss, weak evidence, calculation slip, stopped before verifying) and how each change moved each category. Per run log: question, tools selected, intermediate outputs, errors/retries, final vs expected answer, pass/fail, failure category, cost/latency. The interview story is the failure taxonomy and the fixes, not the number.',
    },
  ],
};

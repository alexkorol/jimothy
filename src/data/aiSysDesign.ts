import type { Deck } from '../types';

export const aiSysDesign: Deck = {
  id: 'ai-sys-design',
  title: 'AI System Design',
  description: 'The "design a support bot" round: frameworks for whiteboard composure.',
  icon: '📐',
  color: '#f87171',
  track: 'AI Engineering',
  cards: [
    {
      id: 'sd-framework',
      type: 'flash',
      front: 'The 5-step frame for ANY "design an AI system" interview question.',
      back: '1) Requirements: users, scale, latency budget, cost ceiling, failure tolerance. ASK before designing. 2) Simplest architecture that could work (often one model call + retrieval). 3) Data flow end to end, naming components. 4) Evaluation & feedback loop: how you know it works and improves. 5) Failure modes & guardrails. Interviewers grade the PROCESS; step 4 is where AI candidates differentiate, because most forget it.',
    },
    {
      id: 'sd-support-bot',
      type: 'flash',
      front: 'Whiteboard drill: "Design a customer-support bot over our help docs.": 90 seconds.',
      back: 'Ingestion: docs → chunk (structure-aware, heading context) → embed → vector store; nightly sync.\nQuery path: rewrite conversational query → hybrid retrieve → rerank → generate with citations, strict "answer only from context".\nGuardrails: confidence threshold with human handoff, injection defenses, PII filtering.\nEval: golden Q&A set, retrieval recall@k, groundedness judge, thumbs-down review queue.\nOps: streaming, model routing, prompt caching, dashboards.\nThat skeleton adapts to any RAG product question.',
    },
    {
      id: 'sd-clarify',
      type: 'mcq',
      prompt: 'The interviewer says "design an AI code reviewer." Your FIRST move?',
      choices: [
        'Clarify scope: languages, output format, latency, what "good" means',
        'Start drawing the standard RAG architecture immediately',
        'Pick the model first: context window and pricing constrain the design',
        'Estimate GPU count and infrastructure cost before anything else',
      ],
      answer: 0,
      explanation:
        'Pre-merge vs async latency and inline comments vs summary output change the design entirely. Same discipline as restate-then-example in coding rounds. Two minutes of scoping visibly separates engineers from feature-listers.',
    },
    {
      id: 'sd-human-loop',
      type: 'mcq',
      prompt: 'Where does human-in-the-loop belong in an AI pipeline?',
      choices: [
        'Wherever error cost exceeds review cost, routed by uncertainty signals',
        'Reviewing every output before release; sampling misses rare severe failures',
        'Nowhere: full automation is the goal and review just adds latency',
        'Only during development; a shipped model is already validated',
      ],
      answer: 0,
      explanation:
        'The strong version: route on countable uncertainty signals (confidence scores, missing fields, conflicts) and measure the precision/recall of the routing itself.',
    },
    {
      id: 'sd-cache-layers',
      type: 'mcq',
      prompt: 'The three cache layers of an LLM product, cheapest hit first?',
      choices: [
        'Exact-response cache → semantic cache → provider prefix cache',
        'GPU KV cache → in-memory cache → disk cache, fastest hardware first',
        'One semantic cache: exact and prefix matching are subsets of it',
        'No cache at any layer: reuse breaks correctness for LLM output',
      ],
      answer: 0,
      explanation:
        'Each layer has a staleness/correctness tradeoff: semantic caching especially needs a similarity threshold and TTL. Naming all three unprompted is a strong systems signal.',
    },
    {
      id: 'sd-fallback',
      type: 'mcq',
      prompt: 'The LLM provider has a 30-minute outage. Your product should…',
      choices: [
        'Walk a designed ladder: second provider → local model → cache → error',
        'Show a loading spinner on every request until the provider returns',
        'Retry every request with exponential backoff and jitter until the provider recovers',
        'Nothing special: provider outages are too rare to plan around',
      ],
      answer: 0,
      explanation:
        'Model-agnostic plumbing (an OpenRouter-style gateway) makes the first rung nearly free. "What happens when the model is down?" is a favorite follow-up: have the ladder ready.',
    },
    {
      id: 'sd-latency-budget',
      type: 'mcq',
      prompt: 'Chat product, 3-second perceived-latency budget. How do you spend it?',
      choices: [
        'Retrieval + rerank ≤ 500ms, then stream with TTFT ≤ 1.5s',
        'Generate the full response before rendering any text',
        'Skip retrieval; model weights already hold the knowledge',
        'Batch requests each minute so the model serves fewer, larger calls',
      ],
      answer: 0,
      explanation:
        'Streaming converts "total latency" into "TTFT + reading speed". Budget the latency per component, not for the system as a whole.',
    },
    {
      id: 'sd-feedback-loop',
      type: 'order',
      prompt: 'Order the feedback flywheel that makes a shipped AI product better.',
      items: [
        'Capture: thumbs up/down with the full trace (prompt version, chunks, model, output)',
        'Triage: humans label the failure mode in a review queue',
        'Failures become eval cases, growing the regression suite',
        'Fixes ship: prompt and retrieval changes, eventually fine-tuning data',
      ],
      explanation:
        'Without capture at step 1, nothing downstream exists: you cannot label, eval, or fix what you never recorded.',
    },
    {
      id: 'sd-cost-estimate',
      type: 'mcq',
      prompt: 'Back-of-envelope: 100k queries/day, ~2k input + 500 output tokens each, at $3/M in and $15/M out. Daily cost?',
      choices: [
        '≈ $1,350/day: 200M input tokens at $3/M plus 50M output at $15/M',
        '≈ $135/day: caching and batching cut the naive bill about 90%',
        '≈ $13,500/day: retries and multi-turn context 10x the raw number',
        'Not estimable without batch discounts and the cache hit rate',
      ],
      answer: 0,
      explanation:
        '100k × 2k = 200M input ($600); 100k × 500 = 50M output ($750). After the estimate, name routing and caching as the levers that bring it down.',
    },
    {
      id: 'sd-abuse',
      type: 'mcq',
      prompt: 'Your free AI endpoint is getting hammered by scripts. Defense stack?',
      choices: [
        'Auth, per-user rate limits, spend caps, anomaly alerts, size limits',
        'Rely on the provider\'s rate limits: they already meter each key upstream',
        'CAPTCHA on every request so bots never reach the endpoint at all',
        'A system prompt instructing the model to refuse automated callers',
      ],
      answer: 0,
      explanation:
        'LLM endpoints are expensive compute behind an HTTP call: treat abuse as a cost attack, not just a nuisance. Per-key budgets are the non-negotiable.',
    },
    {
      id: 'sd-buy-vs-build',
      type: 'flash',
      front: '"Should we build this AI feature or use a vendor?": the structured answer.',
      back: 'Build when the capability IS your differentiation, data is proprietary, or vendor costs at scale exceed an owned solution. Buy/API when it’s table-stakes functionality, volume is unproven, or speed-to-market rules. The hybrid default: prototype on the best API to validate demand, then optimize costs (routing, distillation, self-hosting) once usage justifies it. Premature GPU ownership is the AI version of premature optimization.',
    },
    {
      id: 'sd-monitoring',
      type: 'mcq',
      prompt: 'Day-2 operations: what do you alert on for an LLM feature?',
      choices: [
        'Refusal rates, p95 TTFT, token spend vs budget, canary eval drift, feedback rate',
        'Standard infra metrics only: CPU, memory, 5xx rate, and uptime',
        'Nothing: LLM calls are stateless, so there is no state to monitor',
        'Output length and tokens per response; regressions show as length shifts',
      ],
      answer: 0,
      explanation:
        'A silent model update can shift behavior overnight: the scheduled canary eval catches what infra metrics can’t. "Quality is a metric too" is the closing line.',
    },
  ],
};

import type { Deck } from '../types';

export const inferenceOpt: Deck = {
  id: 'inference-opt',
  title: 'LLM Inference & Serving',
  description: 'Why generation is slow, what a token costs, and the levers that matter.',
  icon: '⚙️',
  color: '#fbbf24',
  track: 'AI Engineering',
  cards: [
    {
      id: 'io-two-phases',
      type: 'flash',
      front: 'Prefill vs decode: the two phases of LLM inference and their opposite bottlenecks.',
      back: 'Prefill processes the whole prompt in parallel: compute-bound, sets time-to-first-token. Decode generates one token at a time, each step reading ALL weights and the KV cache: memory-bandwidth-bound, sets tokens/second. This split explains everything downstream: why long prompts hurt TTFT, why batch decoding is nearly free, why quantization speeds up decode.',
    },
    {
      id: 'io-kv-size',
      type: 'mcq',
      prompt: 'What dominates GPU memory during long-context serving?',
      choices: [
        'The KV cache: it grows with context length × batch size, rivaling the weights',
        'The model weights: parameter count grows with the context window, so more layers load',
        'Python interpreter overhead from the tokenizer and serving framework',
        'Logit tensors and log buffers accumulated across the full generation',
      ],
      answer: 0,
      explanation:
        'A 7B model’s weights are fixed (~14GB fp16), but KV for a 128k context can exceed them. GQA/MQA shrink KV by sharing heads: why every modern architecture uses them.',
    },
    {
      id: 'io-paged-attention',
      type: 'mcq',
      prompt: 'vLLM’s PagedAttention: the core idea?',
      choices: [
        'KV cache in non-contiguous pages, like OS virtual memory, ending fragmentation',
        'KV blocks offloaded to CPU RAM and swapped to the GPU page by page, like disk swap',
        'Skipping the attention computation over tokens older than one page of context',
        'A modified attention architecture trained with page-sized blocks',
      ],
      answer: 0,
      explanation:
        'Naive contiguous KV allocation wastes memory on reserved-but-unused space; paging reclaims it → more concurrent requests per GPU → the throughput numbers vLLM is famous for.',
    },
    {
      id: 'io-continuous-batching',
      type: 'mcq',
      prompt: 'Continuous (in-flight) batching beats static batching because…',
      choices: [
        'Finished sequences exit and new ones join mid-flight; no waiting on the longest',
        'It pads all sequences to one length so the GPU runs a single uniform matmul',
        'It deprioritizes short requests so long generations keep the GPU saturated',
        'It removes the scheduler entirely, cutting per-step dispatch overhead',
      ],
      answer: 0,
      explanation:
        'Static batching leaves the GPU idle while one long generation finishes. Continuous batching is THE serving-throughput unlock: standard in vLLM, TGI, TensorRT-LLM.',
    },
    {
      id: 'io-speculative',
      type: 'mcq',
      prompt: 'Speculative decoding: how can a small model speed up a big one without changing outputs?',
      choices: [
        'The draft proposes k tokens; the target verifies all of them in one parallel pass',
        'The small model drafts the full response; the big model rewrites sentences it dislikes',
        'It caches common answers keyed by prompt hash and serves them from the draft model',
        'It temporarily lowers precision to int4 during easy spans of the generation',
      ],
      answer: 0,
      explanation:
        'Verification is parallel (prefill-like), generation is serial, so trading serial steps for parallel checks wins when the draft acceptance rate is decent. Exact-output guarantee is the interview-worthy detail.',
    },
    {
      id: 'io-quant-serving',
      type: 'mcq',
      prompt: 'Why does int4 quantization speed up DECODE specifically?',
      choices: [
        'Decode is memory-bandwidth-bound: smaller weights, fewer bytes read per token',
        'int4 tensor cores execute four times more operations per cycle in the matmuls',
        'int4 arithmetic is numerically more stable, so fewer correction steps run',
        'It shrinks the vocabulary, so each sampling step scans fewer logits',
      ],
      answer: 0,
      explanation:
        'Every decode step streams all weights through the GPU; 4× smaller weights ≈ up to 4× faster streaming. Compute-bound prefill benefits far less: the two-phase model predicts this.',
    },
    {
      id: 'io-metrics',
      type: 'fill',
      prompt: 'The two latency metrics every LLM service dashboards:',
      code: 'TTFT = time to first ____\nTPS  = tokens per second (decode rate)',
      answers: ['token'],
      distractors: ['request', 'byte', 'response'],
      explanation:
        'TTFT is perceived responsiveness (streaming makes it the number users feel); TPS is how fast the answer unrolls. Optimize them separately: they have different bottlenecks.',
    },
    {
      id: 'io-prompt-caching',
      type: 'mcq',
      prompt: 'Provider prompt caching: what exactly is cached and what does it save?',
      choices: [
        'The KV cache of a stable prompt prefix: repeats skip recomputing it, cutting cost and TTFT',
        'Full completions keyed by a hash of the prompt: identical requests return the stored answer',
        'A per-customer copy of the model weights, pre-loaded onto reserved GPUs',
        'Embeddings of the prompt, reused to skip the tokenizer on repeat requests',
      ],
      answer: 0,
      explanation:
        'Why prompt STRUCTURE matters: stable content (system prompt, docs, tools) first, volatile content last. One reorder can cut costs dramatically: architecture decision disguised as formatting.',
    },
    {
      id: 'io-routing',
      type: 'mcq',
      prompt: 'The biggest single cost lever in a production LLM product?',
      choices: [
        'Model routing: send the easy 80% to a 10× cheaper model, escalate the rest',
        'Shorter variable names in prompts, shaving tokens from every request',
        'Turning off server-side logging to reclaim GPU memory for larger batches',
        'Batching all requests into overnight offline jobs for batch-API pricing',
      ],
      answer: 0,
      explanation:
        'A classifier (or heuristics, or cascade-with-fallback) decides difficulty. A model-agnostic gateway layer is what makes routing cheap to add later.',
    },
    {
      id: 'io-streaming-sse',
      type: 'mcq',
      prompt: 'Why does streaming matter even when total generation time is unchanged?',
      choices: [
        'Perceived latency collapses: users read while the model generates; TTFT is the only wait',
        'It reduces server cost: KV cache pages are freed incrementally as tokens leave GPU memory',
        'Output quality improves: the model commits to fewer tokens per forward pass',
        'It sidesteps provider rate limits by spreading tokens over the connection',
      ],
      answer: 0,
      explanation:
        'The full answer might take 15s; the first sentence takes 1s. In FastAPI this is SSE via StreamingResponse.',
    },
    {
      id: 'io-local-vs-api',
      type: 'flash',
      front: '"Should we self-host an open model or use an API?": the grown-up tradeoff answer.',
      back: 'API wins on frontier quality, zero ops, instant scaling: pay per token. Self-hosting wins on data control, latency floor, and cost ONLY at sustained high utilization (idle GPUs bleed money). Practical middle: API for the product, small self-hosted/local models for high-volume narrow tasks (classification, embedding, drafts). Decision inputs: volume, privacy requirements, task difficulty, team ops capacity.',
    },
    {
      id: 'io-retries',
      type: 'mcq',
      prompt: 'Production LLM API calls fail intermittently (429s, timeouts). The resilient client pattern?',
      choices: [
        'Exponential backoff with jitter, a retry budget, per-call timeouts, and a fallback path',
        'Retry immediately in a tight loop: the fastest client back in line wins the freed slot',
        'One attempt only; fail fast and surface the provider error to the user',
        'Precompute and cache a response for every prompt the product can send',
      ],
      answer: 0,
      explanation:
        'Bounded concurrency (a semaphore) plus backoff is the standard batch-client design. Fallback answers ("try again shortly") beat hanging spinners.',
    },
    {
      id: 'io-kv-math',
      type: 'flash',
      front: 'Estimate KV cache size per token for a transformer. What terms go into the formula?',
      back: 'Per token: 2 (K and V) × layers × kv_heads × head_dim × bytes per element.\nExample, Llama-2-7B in fp16: 2 × 32 × 32 × 128 × 2 ≈ 0.5 MB per token.\nSo a 128k-token context needs ~64GB of KV: more than the ~14GB of weights.\nThe formula shows the levers: GQA/MQA shrink kv_heads, KV quantization shrinks bytes, and batch size multiplies the whole thing.',
    },
    {
      id: 'io-quant-tradeoffs',
      type: 'mcq',
      prompt: 'Weight-only quantization (GPTQ/AWQ int4) vs weight-and-activation quantization (int8 W8A8): the key difference?',
      choices: [
        'Weight-only cuts memory traffic but computes in fp16; W8A8 adds integer compute, where activation outliers risk quality',
        'Weight-only calibrates offline; W8A8 requantizes weights per request, recomputing scale factors and losing precision',
        'W8A8 only works on CPUs: GPU tensor cores lack int8 activation support, so integer compute falls back to the host',
        'They are the same technique under different names, differing only in which library branded it',
      ],
      answer: 0,
      explanation:
        'Weight-only int4 dequantizes on the fly: ideal for bandwidth-bound decode, usually near-lossless on large models. W8A8 (SmoothQuant-style) targets compute-bound prefill and large batches; activations have outlier channels, so it needs calibration tricks. Perplexity cost grows as bits drop: 8-bit is near-free, 4-bit weights are mild, aggressive activation or sub-4-bit quant is where quality visibly degrades.',
    },
    {
      id: 'io-tensor-pipeline',
      type: 'mcq',
      prompt: 'The model does not fit on one GPU. Tensor parallelism vs pipeline parallelism?',
      choices: [
        'TP splits each layer\'s matrices across GPUs, all-reducing every layer; PP splits layers into sequential stages',
        'They are interchangeable: both split the same matmuls, so pick whichever is easier to configure',
        'PP is always faster than TP because it communicates less per token, on any interconnect',
        'TP shards the training data across GPUs, PP shards the optimizer state (ZeRO-style); neither applies at inference',
      ],
      answer: 0,
      explanation:
        'The standard deployment: TP within a node (NVLink-class interconnect, all-reduce every layer), PP across nodes (only activations cross, tolerates slow links). For inference, TP helps latency because every GPU works on the same token; PP helps fit but adds bubble overhead and each token still traverses all stages serially.',
    },
    {
      id: 'io-spec-acceptance',
      type: 'tf',
      prompt: 'Speculative decoding always speeds up generation, regardless of the draft model\'s acceptance rate.',
      answer: false,
      explanation:
        'Low acceptance means the draft work plus verification passes are wasted and it can be SLOWER than plain decoding. It wins when the draft aligns with the target (same family/tokenizer, predictable text like code or boilerplate). Gains also shrink at high batch sizes, where the GPU is no longer idle during decode.',
    },
    {
      id: 'io-constrained-decoding',
      type: 'mcq',
      prompt: 'Constrained decoding for structured output (JSON schema, grammars): how does it work and what does it cost?',
      choices: [
        'A state machine masks the logits each step so only grammar-valid tokens can be sampled, guaranteeing syntax',
        'A schema-specific adapter is fine-tuned and hot-loaded before every request that demands JSON',
        'The model samples freely; a validator parses the result and invalid outputs are quietly resampled until one parses',
        'The decoder truncates the output at the first closing brace that balances the opening one',
      ],
      answer: 0,
      explanation:
        'This is how "JSON mode" and tools like Outlines/XGrammar work; the cost is per-step mask overhead. Guaranteed-parseable beats retry loops for reliability and cost. The subtle risk: hard constraints can force low-probability continuations when the schema fights the model\'s natural phrasing, so keep schemas loose where content quality matters.',
    },
    {
      id: 'io-batch-roofline',
      type: 'flash',
      front: 'Why does increasing batch size raise decode throughput almost for free, and what eventually stops it?',
      back: 'Decode reads all weights once per step no matter how many sequences are in the batch, so extra sequences amortize the same memory traffic: tokens/s scales nearly linearly at small batches.\nThree things end the free lunch:\n1. KV cache memory: each sequence adds its own KV, and the GPU runs out.\n2. Arithmetic intensity rises with batch until the workload turns compute-bound.\n3. Per-token latency for each user creeps up as steps get heavier.\nServing is choosing a point on this throughput vs latency curve, not maximizing one number.',
    },
    {
      id: 'io-request-lifecycle',
      type: 'order',
      prompt: 'Order the life of one request inside a continuous-batching server (vLLM-style):',
      items: [
        'Request arrives and is tokenized',
        'Scheduler admits it into the running batch when KV pages are available',
        'Prefill computes the prompt\'s KV cache and emits the first token (TTFT)',
        'Decode steps interleave with every other in-flight request',
        'Generation finishes; its KV pages are freed for waiting requests',
      ],
      explanation:
        'The scheduler plus paged KV is the whole trick: admission is gated by free KV pages, and freeing pages promptly is what keeps new requests flowing in mid-flight.',
    },
  ],
};

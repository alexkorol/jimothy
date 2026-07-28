import type { Deck } from '../types';

export const statsProb: Deck = {
  id: 'stats-prob',
  title: 'Statistics & Probability',
  description: 'The stats round: distributions, tests, and Bayes without flinching.',
  icon: '🎲',
  color: '#a78bfa',
  track: 'ML & Data',
  cards: [
    {
      id: 'sp-mean-median',
      type: 'mcq',
      prompt: 'Income data with a few billionaires, which center to report?',
      choices: [
        'Median: robust to skew; the mean gets dragged upward',
        'Mean: it uses every point, so it is more informative',
        'Mode: the most common value is the typical income',
        'Midrange (max+min)/2: it balances the two extremes',
      ],
      answer: 0,
      explanation:
        'Mean ≫ median is itself a skew diagnostic. Same reasoning as median imputation: one idea, two applications.',
    },
    {
      id: 'sp-std',
      type: 'flash',
      front: 'Variance and standard deviation: define, and why divide by n−1?',
      back: 'Variance = average squared distance from the mean; std = its square root, back in original units. Sample variance divides by n−1 (Bessel’s correction) because the sample mean was estimated from the same data, eating one degree of freedom: dividing by n would systematically underestimate spread.',
    },
    {
      id: 'sp-normal-68',
      type: 'fill',
      prompt: 'The empirical rule for a normal distribution:',
      code: 'within 1 std: ~68%\nwithin 2 std: ~____%\nwithin 3 std: ~99.7%',
      answers: ['95'],
      distractors: ['90', '97', '99'],
      explanation:
        '68–95–99.7. The 2-std ≈ 95% line is why z ≈ 1.96 shows up in every confidence interval.',
    },
    {
      id: 'sp-clt',
      type: 'flash',
      front: 'The Central Limit Theorem: what it says and why ML people care.',
      back: 'Means of large-enough samples are approximately normal regardless of the underlying distribution, with spread shrinking as σ/√n. It’s why confidence intervals and t-tests work on non-normal data, and why averaging noisy estimates (batches, bootstraps, ensemble members) produces stable numbers. Rough threshold people quote: n ≥ 30.',
    },
    {
      id: 'sp-bayes',
      type: 'flash',
      front: 'A disease affects 1% of people. The test is 99% sensitive, 95% specific. You test positive: actual probability you’re sick?',
      back: 'Bayes: P(sick|+) = (0.99 × 0.01) / (0.99×0.01 + 0.05×0.99) ≈ 0.0099/0.0594 ≈ 17%. The false positives from the healthy 99% swamp the true positives from the sick 1%. Base-rate neglect is THE probability interview question, and it is precision under a different name.',
    },
    {
      id: 'sp-bayes-formula',
      type: 'fill',
      prompt: 'Bayes’ theorem:',
      code: 'P(A|B) = P(B|A) * P(A) / P(____)',
      answers: ['B'],
      distractors: ['A', 'A|B', 'not A'],
      explanation:
        'Posterior = likelihood × prior / evidence. Being able to LABEL the four pieces matters more than reciting the formula.',
    },
    {
      id: 'sp-independence',
      type: 'mcq',
      prompt: 'Two fair coin flips. P(both heads)? And what assumption did you just use?',
      choices: [
        '0.25: multiply because the flips are independent',
        '0.5: the probabilities of the flips add together',
        '0.25: probabilities always multiply, independent or not',
        '0.75: one minus the both-tails probability of 0.25',
      ],
      answer: 0,
      explanation:
        'Multiplication REQUIRES independence: the assumption most real-world probability errors violate (correlated defaults, correlated features, correlated model errors).',
    },
    {
      id: 'sp-pvalue',
      type: 'mcq',
      prompt: 'What a p-value of 0.03 actually means?',
      choices: [
        'If the null were true, data this extreme would occur 3% of the time',
        'There is a 3% chance the null hypothesis is true, given the data',
        'The measured effect size is 3% of the outcome scale',
        'A replication would find a significant effect 97% of the time',
      ],
      answer: 0,
      explanation:
        'P(data | null), NOT P(null | data): confusing them is the most common stats error in interviews and in published science alike.',
    },
    {
      id: 'sp-ab-test',
      type: 'flash',
      front: 'Design an A/B test for a new recommendation model: the checklist.',
      back: 'Randomize assignment (users, not sessions, to avoid contamination), define the primary metric and minimum detectable effect UP FRONT, power analysis for sample size, run the pre-committed duration (no peeking-and-stopping: that inflates false positives), then a significance test plus a look at the effect size and guardrail metrics. Bonus terms that land: novelty effects, multiple-comparison correction.',
    },
    {
      id: 'sp-corr-cause',
      type: 'mcq',
      prompt: 'Ice cream sales correlate with drownings. The best explanation?',
      choices: [
        'A confounder: summer drives both; correlation ≠ causation',
        'Ice cream causes cramps while swimming, hence drownings',
        'Coincidence: strong correlations routinely arise by chance',
        'Reverse causality: drowning news drives comfort ice cream sales',
      ],
      answer: 0,
      explanation:
        'Name the mechanism, not the slogan: confounding, reverse causation, selection bias, or chance. Causal claims need randomization or careful causal inference.',
    },
    {
      id: 'sp-correlation-r',
      type: 'mcq',
      prompt: 'Pearson r = 0 between X and Y. Can they still be strongly related?',
      choices: [
        'Yes. Pearson only measures LINEAR association; Y = X² gives r ≈ 0',
        'No: r = 0 means X and Y are statistically independent',
        'Only if n is small enough for sampling noise to hide it',
        'Only if X and Y are categorical rather than numeric',
      ],
      answer: 0,
      explanation:
        'Always plot before trusting r (Anscombe’s quartet is the classic demo). Spearman catches monotonic non-linear relationships.',
    },
    {
      id: 'sp-expected-value',
      type: 'mcq',
      prompt: 'A lottery ticket costs $2, pays $500 with probability 0.001. Expected value of buying?',
      choices: [
        '−$1.50. EV = (0.001 × 500) − 2 = 0.5 − 2 = −1.5',
        '+$0.50: the ticket price is sunk, so EV = 0.001 × 500',
        '$498: the $500 prize minus the $2 ticket price',
        'Cannot be computed without the number of tickets sold',
      ],
      answer: 0,
      explanation:
        'EV = Σ(outcome × probability) minus cost. Quick EV arithmetic under pressure is a favorite screen for data roles.',
    },
    {
      id: 'sp-sampling-bias',
      type: 'mcq',
      prompt: 'Surveying app-store reviewers to estimate user satisfaction: the flaw?',
      choices: [
        'Selection bias: reviewers are self-selected extremes',
        'Sample size: too few reviews for statistical significance',
        'Reviews are free text, so they cannot be quantified',
        'No flaw: reviewers are real users of the actual app',
      ],
      answer: 0,
      explanation:
        'Survivorship and self-selection distort any inference. Fix: sample from the actual user population, weight by usage.',
    },
    {
      id: 'sp-bootstrap',
      type: 'flash',
      front: 'The bootstrap: how do you get a confidence interval with no formula?',
      back: 'Resample your dataset WITH replacement thousands of times, compute the statistic on each resample, and read the interval off the percentiles (2.5th–97.5th for 95%). Works for medians, ratios, model metrics: anything. It’s the practical answer to "how confident are you in that eval score?"',
    },
    {
      id: 'sp-distributions',
      type: 'mcq',
      prompt: 'Number of support tickets arriving per hour is best modeled by…',
      choices: [
        'Poisson: counts of independent events in a fixed window',
        'Normal: the CLT forces hourly counts to be normal',
        'Uniform: each hour is equally likely to get any count',
        'Binomial with n = 60: one Bernoulli trial per minute',
      ],
      answer: 0,
      explanation:
        'The distribution matching game: counts in time → Poisson, successes in n trials → binomial, waiting time → exponential, sums/averages → normal (CLT).',
    },
    {
      id: 'sp-variance-tradeoff',
      type: 'mcq',
      prompt: 'You average the predictions of 10 diverse models. What happens statistically?',
      choices: [
        'Variance drops (errors partially cancel); bias stays put',
        'Bias drops: the models correct each other\'s systematic errors',
        'Both bias and variance rise with the extra model count',
        'Nothing changes: averaging preserves both error terms',
      ],
      answer: 0,
      explanation:
        'Averaging independent-ish errors shrinks them by ~1/√n. Random forests, ensembles, and self-consistency judging are all this one theorem wearing different hats.',
    },
  ],
};

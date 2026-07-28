import type { Deck } from '../types';

export const featureEng: Deck = {
  id: 'feature-eng',
  title: 'Features & Model Selection',
  description: 'Structuring a model project: baselines, features, selection, drift.',
  icon: '🧪',
  color: '#34d399',
  track: 'ML & Data',
  cards: [
    {
      id: 'fe-project-structure',
      type: 'flash',
      front: '"How would you structure an ML project from scratch?": the answer you rehearse.',
      back: 'A recitable arc: 1) Define the target and the metric FROM BUSINESS COST, plus a dumb baseline. 2) Split data first (leakage-proof), stratified/temporal as appropriate. 3) EDA + cleaning. 4) Feature pipeline (fit on train only). 5) Simple model first: logistic regression / gradient boosting. 6) Iterate against validation; error analysis over hyperparameter worship. 7) One final test-set reading. 8) Ship with monitoring for drift.',
    },
    {
      id: 'fe-baseline',
      type: 'mcq',
      prompt: 'Why insist on a dumb baseline (majority class, mean predictor) before modeling?',
      choices: [
        'It anchors later numbers: 92% accuracy means little if the baseline is 91%',
        'scikit-learn requires a fitted DummyClassifier before reporting metrics',
        'The baseline warm-starts the real model so it converges faster',
        'Stakeholders demand simple, explainable models before complex ones',
      ],
      answer: 0,
      explanation:
        'It also guards against the accuracy paradox. "What did the baseline score?" is one of the most common interviewer probes on any modeling story.',
    },
    {
      id: 'fe-datetime',
      type: 'mcq',
      prompt: 'Best features from a raw timestamp column for demand prediction?',
      choices: [
        'Decomposed parts: hour, day-of-week, month, is-weekend',
        'The raw epoch as one number: the calendar information is all in there',
        'Drop it entirely: time itself is not a predictive feature',
        'A single string column like "2026-07-04" kept as-is',
      ],
      answer: 0,
      explanation:
        'Decomposition makes cyclical patterns learnable; epoch seconds hide periodicity behind a monotonic ramp. Bonus points: sin/cos encoding for cyclic features so hour 23 sits next to hour 0.',
    },
    {
      id: 'fe-target-encoding',
      type: 'mcq',
      prompt: 'Target encoding (replace category with mean target): the danger?',
      choices: [
        'Leakage: each row’s own target sneaks into its feature',
        'It only works for binary targets: continuous ones cannot be averaged',
        'Dimensionality explosion: one new column per category level',
        'No real danger: category means are aggregate statistics, not labels',
      ],
      answer: 0,
      explanation:
        'Naive target encoding gives dazzling validation scores that evaporate in production. Use out-of-fold encoding, and smooth rare categories toward the global mean.',
    },
    {
      id: 'fe-interaction',
      type: 'flash',
      front: 'When does feature engineering still beat "throw it at a big model"?',
      back: 'Tabular data: gradient-boosted trees plus thoughtful features routinely beat neural nets there. High-leverage moves: ratios (price/sqft), aggregates per entity (user’s 30-day average), counts since last event, and domain flags encoding expert knowledge. Deep learning earns its keep on images, text, and audio, where it learns the features itself.',
    },
    {
      id: 'fe-multicollinearity',
      type: 'mcq',
      prompt: 'Two features correlate at 0.98. Who cares, and who doesn’t?',
      choices: [
        'Linear-model coefficients go unstable; trees barely care',
        'Every model fails: correlated features double-count signal',
        'Nobody: redundant features always improve accuracy',
        'Only neural networks: backprop cannot separate the gradients',
      ],
      answer: 0,
      explanation:
        'Multicollinearity is an INTERPRETATION problem more than a prediction problem. Drop one, combine them, or use regularization if coefficients must mean something.',
    },
    {
      id: 'fe-feature-importance',
      type: 'mcq',
      prompt: 'Most trustworthy way to ask "which features matter?"',
      choices: [
        'Permutation importance on the validation set: shuffle and remeasure',
        'Tree impurity importances: real splits, so unbiased by construction',
        'Coefficient sizes on unscaled features: biggest means most important',
        'The left-to-right order the columns appear in the dataframe',
      ],
      answer: 0,
      explanation:
        'Impurity importances inflate high-cardinality features; unscaled coefficients compare apples to freight trains. Permutation importance measures what the model actually uses. SHAP for per-prediction stories.',
    },
    {
      id: 'fe-cv',
      type: 'flash',
      front: 'k-fold cross-validation: mechanics, and the two situations that break vanilla k-fold.',
      back: 'Split into k folds; train on k−1, validate on the held-out fold, rotate, average the k scores: every row validates exactly once. Breaks: 1) time series; random folds train on the future; use expanding-window/TimeSeriesSplit. 2) grouped data: same user in train and validation leaks identity; use GroupKFold. Stratify for imbalanced classes.',
    },
    {
      id: 'fe-imbalanced-choice',
      type: 'mcq',
      prompt: 'Fraud at 0.5% positive rate: your first modeling levers?',
      choices: [
        'class_weight="balanced", PR-AUC as the metric, threshold tuned to cost',
        'SMOTE the dataset first: synthetic rows fix imbalance at the source',
        'Accuracy as the metric, threshold left at the 0.5 default',
        'Drop 99% of the negatives; the discarded rows are redundant',
      ],
      answer: 0,
      explanation:
        'scale_pos_weight is the gradient-boosting spelling. Class weights are one line and leak-proof; SMOTE adds synthetic-data risks. Metric and threshold come before data surgery; resample only if those fall short.',
    },
    {
      id: 'fe-model-selection',
      type: 'mcq',
      prompt: 'Tabular business data, 50k rows, mixed types, need decent results this week. First model?',
      choices: [
        'Gradient boosting (XGBoost/LightGBM): the tabular default',
        'A 12-layer transformer: attention learns tabular interactions best',
        'k-nearest neighbors on raw features: no training time needed',
        'Whichever architecture is trending on arXiv this month',
      ],
      answer: 0,
      explanation:
        'Strong, fast, and happy with mixed feature types. And logistic regression beside it as the interpretable baseline. "GBM for tabular, deep nets for perception, start simple" is a complete model-selection philosophy in one line.',
    },
    {
      id: 'fe-hyperparam',
      type: 'mcq',
      prompt: 'Grid search vs random search vs Bayesian optimization?',
      choices: [
        'Random beats grid at equal budget; Bayesian adds smart guessing',
        'Grid is always best: exhaustive coverage guarantees the optimum',
        'Bayesian optimization is required for any tuning to converge',
        'All three give identical results at any compute budget',
      ],
      answer: 0,
      explanation:
        'The Bergstra–Bengio result: few hyperparameters matter, random explores each dimension better (more distinct values per axis). Bayesian pays off when each evaluation is expensive. Honest add-on: error analysis usually pays more than tuning past the first pass.',
    },
    {
      id: 'fe-drift',
      type: 'flash',
      front: 'The model shipped. What breaks silently, and what do you monitor?',
      back: 'Data drift (input distributions shift: new user segments, upstream schema changes) and concept drift (the input→output relationship itself changes; fraud adapts). Monitor: input stats vs training profile, prediction distribution, delayed ground-truth metrics, and per-segment slices. Alert thresholds + scheduled retraining. Deployment is where ML engineering starts, not where it ends.',
    },
    {
      id: 'fe-scaling-recap',
      type: 'mcq',
      prompt: 'Which models need feature scaling, quick-fire?',
      choices: [
        'kNN, SVM, regularized linear models, neural nets: yes; trees: no',
        'All models: arithmetic on raw features distorts any algorithm',
        'Only neural networks: every other estimator standardizes internally',
        'None of them: scaling is cosmetic for modern optimizers',
      ],
      answer: 0,
      explanation:
        'Distance- and gradient-based methods care about scale; trees split on order and don’t. Regularization especially: penalties compare coefficient sizes across features, which is meaningless unscaled.',
    },
    {
      id: 'fe-error-analysis',
      type: 'flash',
      front: 'Your model plateaus at 85%. The highest-leverage next step is NOT more tuning: what is it?',
      back: 'Error analysis: read 50–100 actual mistakes and categorize them. You will find label errors, a data-quality subgroup, a missing feature, or a class the model never sees: each worth more than any hyperparameter. Andrew Ng’s discipline: fix the pipeline the errors point at, not the knob you happen to know. The same discipline applies to LLM evals.',
    },
  ],
};

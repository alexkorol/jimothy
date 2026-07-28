import type { Deck } from '../types';

export const sklearnWorkflow: Deck = {
  id: 'sklearn-workflow',
  title: 'scikit-learn Workflow',
  description: 'fit/transform/predict and Pipelines: the muscle memory of applied ML.',
  icon: '⚗️',
  color: '#f472b6',
  track: 'ML & Data',
  cards: [
    {
      id: 'sk-api',
      type: 'flash',
      front: 'The sklearn API contract: the three verbs and who owns which.',
      back: 'fit() learns from data (weights for models, statistics for transformers). transform() applies a learned transformation (scalers, encoders). predict() produces outputs from a fitted model. fit_transform() fuses the first two. TRAIN DATA ONLY; test data gets plain transform() with the train-fitted state. That asymmetry IS leakage prevention.',
    },
    {
      id: 'sk-split',
      type: 'fill',
      prompt: 'The split, with reproducibility and class balance:',
      code: 'X_tr, X_te, y_tr, y_te = train_test_split(\n    X, y, test_size=0.2,\n    random_state=42, ____=y)',
      answers: ['stratify'],
      distractors: ['balance', 'groups', 'shuffle'],
      explanation:
        'stratify=y preserves class proportions in both halves: essential when classes are imbalanced, harmless otherwise.',
    },
    {
      id: 'sk-transform-test',
      type: 'mcq',
      prompt: 'Why `scaler.transform(X_test)` and never `scaler.fit_transform(X_test)`?',
      choices: [
        'Refitting on test learns test statistics: that is leakage',
        'fit_transform is just slower; the outputs are the same',
        'fit_transform would rescale already-scaled test values',
        'Both are equivalent whenever the scaler is deterministic',
      ],
      answer: 0,
      explanation:
        'The single most common sklearn mistake. The scaler must apply the TRAINING mean/std to test data, exactly as production will apply them to unseen data. Refitting also puts train and test in different feature spaces.',
    },
    {
      id: 'sk-pipeline',
      type: 'fill',
      prompt: 'The leak-proof way to chain preprocessing and model:',
      code: 'from sklearn.pipeline import ____\nmodel = ____([("scale", StandardScaler()),\n         ("clf", LogisticRegression())])\nmodel.fit(X_tr, y_tr)',
      answers: ['Pipeline'],
      distractors: ['Chain', 'Sequential', 'Workflow'],
      explanation:
        'A Pipeline fits transformers on train only and applies them at predict time automatically: cross-validation on a Pipeline is leak-proof by construction. The one-word answer to "how do you prevent preprocessing leakage in CV?"',
    },
    {
      id: 'sk-column-transformer',
      type: 'mcq',
      prompt: 'Numeric columns need scaling, categoricals need one-hot. The idiomatic tool?',
      choices: [
        'ColumnTransformer: per-column-group transformers in the Pipeline',
        'Transform the full frame manually before splitting',
        'Two separate models, one per column type, averaged',
        'Convert all columns to strings and one-hot everything',
      ],
      answer: 0,
      explanation:
        'ColumnTransformer([("num", StandardScaler(), num_cols), ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols)]): handle_unknown="ignore" saves you when production sends an unseen category.',
    },
    {
      id: 'sk-cross-val',
      type: 'fill',
      prompt: 'Five-fold CV score in one line:',
      code: 'scores = cross_val_____(pipe, X_tr, y_tr,\n         cv=5, scoring="f1")',
      answers: ['score'],
      distractors: ['idate', 'run', 'fold'],
      explanation:
        'cross_val_score returns the five fold scores: report mean ± std, not just the mean. Passing the PIPELINE keeps preprocessing inside each fold.',
    },
    {
      id: 'sk-gridsearch',
      type: 'mcq',
      prompt: 'GridSearchCV(pipe, params, cv=5): what happens on .fit, and what do you use after?',
      choices: [
        'Every combo is CV-scored; use the refit best_estimator_',
        'It fits once with default params, ignoring the grid',
        'Each combo is scored on the held-out test set via cv',
        'It stores best_params_ only; you refit the winner manually',
      ],
      answer: 0,
      explanation:
        'Param naming crosses pipeline steps with double underscores: clf__C, scale__with_mean. refit=True (default) retrains the winner on the full training set.',
    },
    {
      id: 'sk-predict-proba',
      type: 'mcq',
      prompt: '`predict()` vs `predict_proba()`, and which one does threshold tuning need?',
      choices: [
        'predict uses a fixed 0.5 cut; predict_proba lets you set the threshold',
        'predict_proba is for regressors: continuous outputs only',
        'predict gives more accurate labels at the default threshold',
        'They are identical: both apply a fixed built-in cutoff',
      ],
      answer: 0,
      explanation:
        'Cost-sensitive decisions (fraud, medical) tune the threshold on validation probabilities. Default 0.5 is a convention, not a law.',
    },
    {
      id: 'sk-classification-report',
      type: 'fill',
      prompt: 'Per-class precision/recall/F1 in one call:',
      code: 'from sklearn.metrics import classification_____\nprint(classification_____(y_te, y_pred))',
      answers: ['report'],
      distractors: ['summary', 'matrix', 'table'],
      explanation:
        'Pairs with confusion_matrix(y_te, y_pred). Reading these two outputs fluently: including macro vs weighted averages; is a live-interview skill.',
    },
    {
      id: 'sk-random-state',
      type: 'mcq',
      prompt: 'Why set random_state everywhere?',
      choices: [
        'Reproducibility: identical splits and fits across runs',
        'Accuracy: a fixed seed converges to a better minimum',
        'sklearn raises ValueError on stochastic fits without it',
        'It seeds the GPU kernels sklearn dispatches to',
      ],
      answer: 0,
      explanation:
        '"I can’t reproduce my own number" is a credibility killer. Fix the seed for experiments; vary it to check your result isn’t a lucky seed.',
    },
    {
      id: 'sk-dummy',
      type: 'mcq',
      prompt: 'The one-line baseline model?',
      choices: [
        'DummyClassifier(strategy="most_frequent")',
        'LinearRegression on the labels, rounded to classes',
        'A random forest with default hyperparameters',
        'There is no baseline estimator; write one by hand',
      ],
      answer: 0,
      explanation:
        'sklearn ships the dumb baseline as a first-class estimator precisely because skipping it is so tempting: it is the floor every real model must beat. DummyRegressor(strategy="mean") for regression.',
    },
    {
      id: 'sk-persist',
      type: 'mcq',
      prompt: 'Shipping the trained pipeline to production: the standard move?',
      choices: [
        'joblib.dump the WHOLE pipeline, preprocessing included',
        'Save weights only; rewrite preprocessing in the API layer',
        'Pickle just the scaler; the model rebuilds from config',
        'Retrain from stored data on every incoming request',
      ],
      answer: 0,
      explanation:
        'joblib.dump(pipe, "model.joblib") serializes the full pipeline, guaranteeing serving applies byte-identical preprocessing. Re-implementing transforms in the API layer is where train/serve skew is born.',
    },
    {
      id: 'sk-randomized-search',
      type: 'flash',
      front: 'GridSearchCV vs RandomizedSearchCV: when do you reach for the random one?',
      back: 'Grid tries every combination: cost explodes exponentially with each added hyperparameter. RandomizedSearchCV samples n_iter combos from distributions, so you control the budget directly.\n1. Few discrete params, cheap fits: grid is fine.\n2. Continuous params (C, learning_rate) or 3+ dimensions: randomized, since it explores each axis at many distinct values instead of a coarse lattice.\n3. Usually only a couple of hyperparameters matter; random search finds good values for those without wasting fits on full crosses of the ones that do not.',
    },
    {
      id: 'sk-class-imbalance',
      type: 'mcq',
      prompt: '1% positives. Cheapest first move in sklearn, and the trap if you resample instead?',
      choices: [
        'class_weight="balanced"; oversample only inside CV folds',
        'Oversample everything first, then split into even halves',
        'Drop negatives until even, then evaluate on that balanced set',
        'Switch scoring to accuracy so imbalance stops mattering',
      ],
      answer: 0,
      explanation:
        'class_weight reweights the loss with zero data manipulation. Resampling before the split copies (or synthesizes) minority rows into the test side: the model is graded on near-duplicates of its own training data. imblearn ships a Pipeline that resamples only during fit for exactly this reason.',
    },
    {
      id: 'sk-calibration',
      type: 'flash',
      front: 'Your model says predict_proba 0.9. Should you believe it, and how would you check?',
      back: 'Not by default. Well-calibrated means that among all 0.9 predictions, about 90% are actually positive. Random forests and boosted trees are typically overconfident or distorted; SVMs need calibration for probabilities at all.\n1. Check: calibration_curve (reliability diagram), Brier score.\n2. Fix: CalibratedClassifierCV wrapping the model, method="isotonic" with plenty of data, "sigmoid" (Platt) when data is scarce.\n3. When it matters: whenever probabilities feed decisions (expected cost, ranking, thresholds), not just argmax labels.',
    },
    {
      id: 'sk-scaling-who',
      type: 'mcq',
      prompt: 'Which models actually need feature scaling?',
      choices: [
        'Distance/gradient models (KNN, SVM, neural nets); trees do not care',
        'All models: unscaled features stall or break every estimator',
        'Only neural networks; everything else is scale invariant',
        'Tree ensembles most of all: splits need one shared scale',
      ],
      answer: 0,
      explanation:
        'Trees split on one feature at a time, so any monotonic rescaling leaves the splits unchanged. Anything computing distances, dot products, or shared penalties across features (KNN, SVM, PCA, regularized linear models, neural nets) needs scaling, or the largest-unit feature silently dominates. L1/L2 regularization also penalizes unscaled coefficients unevenly.',
    },
    {
      id: 'sk-joblib-version',
      type: 'tf',
      prompt: 'A pipeline saved with joblib.dump is safe to load under any later scikit-learn version.',
      answer: false,
      explanation:
        'joblib is pickle: it stores object internals, not a stable format. Loading across sklearn versions can error or, worse, silently misbehave, which is why sklearn warns on version mismatch. Pin the exact sklearn version alongside the artifact, and keep the training code plus data so the model can be retrained after upgrades.',
    },
    {
      id: 'sk-permutation-importance',
      type: 'mcq',
      prompt: 'Why prefer permutation_importance over a forest’s feature_importances_?',
      choices: [
        'It measures real score drop; impurity inflates high-cardinality features',
        'feature_importances_ is deprecated and slated for removal',
        'It is faster: it reuses the fitted model instead of new trees',
        'Nothing: the two always rank features identically anyway',
      ],
      answer: 0,
      explanation:
        'Impurity-based importance is computed from training-time splits, so a random ID column can look important. permutation_importance shuffles one feature and measures the metric drop on validation data, model-agnostically. Caveat: correlated features share credit, so their individual scores can all look low.',
    },
    {
      id: 'sk-workflow-order',
      type: 'order',
      prompt: 'Order the leak-proof supervised workflow, from raw data to the reported number:',
      items: [
        'train_test_split (stratified), test set locked away',
        'Build the Pipeline: preprocessing plus estimator',
        'Cross-validate and tune hyperparameters on the training set only',
        'Refit the best pipeline on all training data',
        'Score on the test set once and report that number',
      ],
      explanation:
        'Splitting comes before anything fitted touches the data, tuning happens strictly inside the training set, and the test set is spent exactly once. Re-tuning after seeing the test score turns the test set into a validation set.',
    },
  ],
};

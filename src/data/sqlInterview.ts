import type { Deck } from '../types';

export const sqlInterview: Deck = {
  id: 'sql-interview',
  title: 'SQL Interview',
  description: 'Joins, GROUP BY traps, and window functions: the screen before the screen.',
  icon: '🗄️',
  color: '#eab308',
  track: 'Coding Interview',
  cards: [
    {
      id: 'sql-joins',
      type: 'mcq',
      prompt: '`INNER JOIN` vs `LEFT JOIN`: the actual difference?',
      choices: [
        'LEFT keeps unmatched left rows with NULLs; INNER drops them',
        'LEFT is faster: the left table is scanned only once',
        'INNER can chain many tables; LEFT allows only two',
        'They differ only in the output column ordering',
      ],
      answer: 0,
      explanation:
        '"All users and their orders, including users with none" = LEFT JOIN. If the phrasing says "including those without…", INNER JOIN is the wrong tool.',
    },
    {
      id: 'sql-groupby',
      type: 'fill',
      prompt: 'Users per city:',
      code: 'SELECT city, COUNT(*)\nFROM users\n____ BY city',
      answers: ['GROUP'],
      distractors: ['ORDER', 'SORT', 'PARTITION'],
      explanation:
        'Every non-aggregated column in the SELECT must appear in GROUP BY: the error interviewers most love to plant.',
    },
    {
      id: 'sql-having',
      type: 'mcq',
      prompt: 'Filter to cities with more than 100 users. `WHERE` or `HAVING`?',
      choices: [
        'HAVING: it filters after aggregation; WHERE runs first',
        'WHERE: it can use an index on the column, so it is faster',
        'Either works: the optimizer rewrites one into the other',
        'Neither; you need a second query over a temp table',
      ],
      answer: 0,
      explanation:
        'WHERE filters rows going in; HAVING filters groups coming out. `HAVING COUNT(*) > 100`: you cannot reference an aggregate in WHERE.',
    },
    {
      id: 'sql-exec-order',
      type: 'flash',
      front: 'The logical execution order of a SQL query (it is not the written order).',
      back: 'FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. This explains the classics: why WHERE can’t see aggregates (runs before GROUP BY) and why column aliases from SELECT can’t be used in WHERE (SELECT runs later).',
    },
    {
      id: 'sql-order-exec',
      type: 'order',
      prompt: 'Arrange the logical execution order of a SQL query.',
      items: ['FROM / JOIN', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY / LIMIT'],
      explanation:
        'Written order ≠ execution order: this is why WHERE can’t see aggregates and SELECT aliases don’t exist yet in WHERE.',
    },
    {
      id: 'sql-second-highest',
      type: 'fill',
      prompt: 'The classic: second-highest salary.',
      code: 'SELECT MAX(salary) FROM employees\nWHERE salary < (SELECT ____(salary)\n                FROM employees)',
      answers: ['MAX'],
      distractors: ['MIN', 'AVG', 'TOP'],
      explanation:
        'Max of everything below the max. Also mention the window-function version. DENSE_RANK() = 2, which generalizes to Nth highest.',
    },
    {
      id: 'sql-null',
      type: 'mcq',
      prompt: 'Why does `WHERE email = NULL` return nothing, ever?',
      choices: [
        'NULL compares as unknown: use IS NULL / IS NOT NULL',
        "NULL must be quoted: WHERE email = 'NULL' would match",
        'It should be == instead of =: a single = is assignment in SQL',
        'The column needs an index before equality works',
      ],
      answer: 0,
      explanation:
        'Any comparison with NULL yields UNKNOWN, which WHERE treats as false. Corollary: NULLs also silently vanish from NOT IN lists; a notorious trap.',
    },
    {
      id: 'sql-window-ranks',
      type: 'flash',
      front: '`ROW_NUMBER` vs `RANK` vs `DENSE_RANK`: scores 90, 90, 85.',
      back: 'ROW_NUMBER: 1,2,3; unique numbers, ties broken arbitrarily. RANK: 1,1,3; ties share, next rank skips. DENSE_RANK: 1,1,2; ties share, no gaps. All used as OVER (PARTITION BY … ORDER BY …); "top-N per group" is ROW_NUMBER ≤ N.',
    },
    {
      id: 'sql-dedupe',
      type: 'mcq',
      prompt: 'Keep one row per email (the lowest id), delete the rest. The standard pattern?',
      choices: [
        'ROW_NUMBER() OVER (PARTITION BY email ORDER BY id), delete rn > 1',
        'SELECT DISTINCT into a temp table, truncate, re-insert',
        'GROUP BY email, which collapses the duplicate rows in place',
        'DELETE with LIMIT 1 in a loop until no duplicates remain',
      ],
      answer: 0,
      explanation:
        'Number the duplicates within each email group, keep row 1. This is the canonical dedupe interview question (LeetCode 196).',
    },
    {
      id: 'sql-index',
      type: 'mcq',
      prompt: 'What does adding an index to a column actually trade?',
      choices: [
        'Faster reads for slower writes and extra storage',
        'Faster reads and writes: the B-tree keeps rows pre-sorted',
        'Compressed storage: values become shorter pointers',
        'Enforced uniqueness on the indexed column values',
      ],
      answer: 0,
      explanation:
        'A B-tree turns scans into O(log n) lookups, but every INSERT/UPDATE now maintains it. Also worth saying: indexes on low-cardinality columns (e.g. a boolean) rarely help.',
    },
    {
      id: 'sql-union',
      type: 'mcq',
      prompt: '`UNION` vs `UNION ALL`?',
      choices: [
        'UNION dedupes (paying a sort); UNION ALL keeps everything',
        'UNION ALL performs an implicit join on matching column names',
        'UNION works across databases, UNION ALL does not',
        'No difference remains in modern SQL dialects',
      ],
      answer: 0,
      explanation:
        'Default to UNION ALL unless you specifically need dedup: saying that unprompted reads as someone who has watched a query plan.',
    },
    {
      id: 'sql-exists',
      type: 'flash',
      front: 'When would you reach for `EXISTS` over `IN`?',
      back: 'EXISTS (SELECT 1 …) short-circuits on the first match: strong for correlated checks against large subqueries. IN materializes the whole list first, and NOT IN silently returns nothing if that list contains a NULL. NOT EXISTS is the safe spelling of "has none".',
    },
    {
      id: 'sql-distinct',
      type: 'fill',
      prompt: 'Each city once:',
      code: 'SELECT ____ city FROM users',
      answers: ['DISTINCT'],
      distractors: ['UNIQUE', 'ONLY', 'SINGLE'],
      explanation:
        'Dedupes the result rows. For counting: COUNT(DISTINCT city). (UNIQUE is a constraint keyword, not a SELECT modifier.)',
    },
  ],
};

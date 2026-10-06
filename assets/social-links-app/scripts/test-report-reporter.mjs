/**
 * Custom reporter for Node.js native test runner (`node --test`).
 * Collects test results and writes them to .test-results.json.
 *
 * This reporter intentionally does NOT read coverage data — coverage is
 * written by c8 after the node process exits. A separate post-step script
 * (write-test-report.mjs) merges test results with coverage into the final
 * test_report.json.
 *
 * Usage (as additional reporter alongside the default "spec" output):
 *   node --test \
 *     --test-reporter=spec --test-reporter-destination=stdout \
 *     --test-reporter=./scripts/test-report-reporter.mjs --test-reporter-destination=stdout \
 *     test/
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();
const outputPath = join(rootDir, ".test-results.json");

function round(n, digits) {
  const f = 10 ** digits;
  
  return Math.round(n * f) / f;
}

/**
 * Node.js test reporter — async generator function.
 *
 * Events of interest:
 *   test:start  — fired for every test/suite with { name, nesting, testId }
 *   test:pass   — { name, nesting, testId, details: { type, duration_ms } }
 *   test:fail   — same shape as test:pass
 *
 * `details.type` is "suite" for describe blocks and "test" for leaf tests.
 * `nesting` is the depth (0 = top-level file, 1 = first describe, etc.).
 *
 * We track the suite ancestry per-file to reconstruct full hierarchical test
 * names like "describe > nested describe > test name".
 */
export default async function* reporter(source) {
  // Per-file suite stacks keyed by file path
  const suiteStacks = new Map();
  const tests = [];
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let total = 0;

  // Records a completed leaf test from a test:pass / test:fail event.
  // `kind` is the outcome to use when the test is NOT skipped/todo
  // ("passed" or "failed"). Shared by both events so the guard conditions,
  // skip/todo handling, and duration rounding stay in exactly one place.
  function record(data, kind) {
    // Skip suite-level (describe block) completions
    if (data.details?.type === "suite") {
      return;
    }
    // Skip file-level wrapper (nesting=0, name is the file path)
    if (data.nesting === 0 && data.name === data.file) {
      return;
    }

    total++;
    const isSkipped = data.skip || data.todo;
    const outcome = isSkipped ? "skipped" : kind;
    if (isSkipped) {
      skipped++;
    } else if (kind === "passed") {
      passed++;
    } else {
      failed++;
    }

    tests.push({
      name: buildFullName(data, suiteStacks),
      outcome,
      duration: round((data.details?.duration_ms || 0) / 1000, 4),
    });
  }

  for await (const event of source) {
    switch (event.type) {
      case "test:start": {
        const { data } = event;
        const file = data.file || "";
        if (!suiteStacks.has(file)) {
          suiteStacks.set(file, []);
        }
        const stack = suiteStacks.get(file);
        // Adjust stack to current nesting level then push this name
        // nesting=0 is the file-level implicit suite which we skip in names
        stack.length = data.nesting;
        stack.push(data.name);
        break;
      }

      case "test:pass":
        record(event.data, "passed");
        break;

      case "test:fail":
        record(event.data, "failed");
        break;

      default:
        break;
    }
  }

  // Write intermediate results (coverage is merged in the post-step)
  const results = { total, passed, failed, skipped, tests };
  writeFileSync(outputPath, `${JSON.stringify(results)}\n`);

  yield "";
}

/**
 * Build a full test name from the suite stack.
 * The stack at the time of test:pass/fail contains the path from describe
 * blocks down to the test itself. We join with " > " for a readable full name.
 *
 * CAVEAT — this is NOT fool-proof under concurrent execution. It relies on a
 * single per-file stack that is mutated on every test:start and read on the
 * matching test:pass/fail, which assumes events arrive in strict nested order.
 * With test concurrency (e.g. `--test-concurrency > 1`, or async siblings that
 * resolve out of order) test:start events interleave, so the stack may no
 * longer reflect the ancestry of the test that is completing and the `name`
 * field can be misattributed to the wrong describe chain. It is correct for
 * the default sequential `node --test` run this skill uses. If concurrency is
 * ever enabled, reconstruct ancestry from each event's stable `testId`/parent
 * links instead of a shared mutable stack.
 */
function buildFullName(data, suiteStacks) {
  const file = data.file || "";
  const stack = suiteStacks.get(file);
  if (stack && stack.length > 0) {
    // The stack should include the describe hierarchy + the test name itself.
    // Since test:start fires before test:pass, the stack at nesting `data.nesting`
    // should be [file-wrapper, describe1, describe2, ..., testName].
    // We skip the first entry if it's the file path (nesting=0 file wrapper).
    const names = stack.slice(0, data.nesting + 1);
    const filtered = names.filter((n) => n !== file);
    if (filtered.length > 0) {
      return filtered.join(" > ");
    }
  }
  
  return data.name || "unnamed test";
}

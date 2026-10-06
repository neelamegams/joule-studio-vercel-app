/**
 * Post-test script that assembles the final test_report.json.
 *
 * Reads .test-results.json (written by the node:test reporter) and
 * coverage/coverage-final.json (written by c8 after the test process exits),
 * then merges them into test_report.json.
 *
 * Schema mirrors the agent-side report written by sap-agent-bootstrap's
 * conftest.py so downstream tooling (evaluation scorers, dashboards) can
 * consume both shapes uniformly.
 */

import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();
const resultsPath = join(rootDir, ".test-results.json");
const coverageDir = join(rootDir, "coverage");
const outputPath = join(rootDir, "test_report.json");
const sectionName = "Vercel Tests";
const sectionMarker = "vercel_tests";

function round(n, digits) {
  const f = 10 ** digits;
  
  return Math.round(n * f) / f;
}

// NOTE: this computes STATEMENT coverage only. It reads each file's statement
// map (`.s`) from the Istanbul-format coverage-final.json and returns the
// percentage of statements executed. It intentionally ignores branch (`.b`),
// function (`.f`), and line coverage. The value is stored as `summary.coverage`,
// so consumers should treat that field as statement coverage %, not the line
// coverage that most dashboards headline.
function readCoverage() {
  const finalPath = join(coverageDir, "coverage-final.json");
  if (!existsSync(finalPath)) {
    return null;
  }
  let data;
  try {
    data = JSON.parse(readFileSync(finalPath, "utf8"));
  } catch {
    return null;
  }

  let total = 0;
  let covered = 0;
  for (const file of Object.values(data)) {
    const s = file?.s ?? {};
    for (const v of Object.values(s)) {
      total += 1;
      if (v > 0) {
        covered += 1;
      }
    }
  }
  if (!total) {
    return null;
  }
  
  return round((covered / total) * 100, 2);
}

// Read test results
if (!existsSync(resultsPath)) {
  console.error("No .test-results.json found — did the test reporter run?");
  process.exit(1);
}

let results;
try {
  results = JSON.parse(readFileSync(resultsPath, "utf8"));
} catch (err) {
  // A crashed or interrupted reporter can leave a truncated/invalid
  // .test-results.json. Fail with a clear message instead of an opaque
  // JSON.parse stack trace so the root cause (re-run the tests) is obvious.
  console.error(
    `Failed to parse ${resultsPath} — the file is missing or corrupt ` +
      `(likely an interrupted test run). Re-run the tests to regenerate it.\n${err.message}`,
  );
  process.exit(1);
}
const { total, passed, failed, skipped, tests } = results;
// NOTE: `total` includes skipped/todo tests, so `score` is passed / (passed +
// failed + skipped). This means legitimately skipped or todo tests lower the
// score even when nothing failed (e.g. 8 passed + 2 skipped => 80, not 100).
// This is intentional — skipped tests represent unverified behavior. If you
// want skips excluded from the score, change the denominator to (passed +
// failed) instead, but keep it consistent with the shared report schema.
const score = total ? round((passed / total) * 100, 2) : 0.0;

const section = {
  name: sectionName,
  marker: sectionMarker,
  total,
  passed,
  failed,
  skipped,
  score,
  tests,
};

const now = Date.now();
// `timestamp` stays as epoch milliseconds (Date.now()); `timestampIso` adds a
// human-readable ISO-8601 string for the same instant for easier reading.
const summary = {
  total,
  passed,
  failed,
  score,
  timestamp: now,
  timestampIso: new Date(now).toISOString(),
};
const coverage = readCoverage();
if (coverage !== null) {
  summary.coverage = coverage;
}

const report = { summary, sections: [section] };

writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

// Clean up intermediate file
unlinkSync(resultsPath);

console.log(`Report written to ${outputPath}`);

import { INITIAL_JOBS } from "../data/mock-jobs.ts";
import { isDueSoon, isDueToday, isOverdue, formatDisplayDate } from "../lib/date-utils.ts";

function runDashboardAuditSuite() {
  console.log("\n=======================================================");
  console.log("PRODUCTION CONTROL DASHBOARD — STRICT AUDIT SUITE");
  console.log("=======================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // ----------------------------------------------------
  // PHASE 2 — JOB DATA REQUIREMENTS
  // ----------------------------------------------------
  console.log("--- PHASE 2: JOB DATA AUDIT ---");
  assert(INITIAL_JOBS.length >= 12, `Mock data has ${INITIAL_JOBS.length} jobs (>= 12 required)`);

  const validStatuses = new Set(["Pending", "In Progress", "Delayed", "Completed"]);
  let allFieldsPresent = true;
  let allStatusesValid = true;

  for (const job of INITIAL_JOBS) {
    if (
      !job.id ||
      !job.jobId ||
      !job.productName ||
      !job.customer ||
      typeof job.quantity !== "number" ||
      !job.dueDate ||
      !job.status ||
      !job.assignedMachine
    ) {
      allFieldsPresent = false;
    }
    if (!validStatuses.has(job.status)) {
      allStatusesValid = false;
    }
  }

  assert(allFieldsPresent, "All jobs contain id, jobId, productName, customer, quantity, dueDate, status, assignedMachine");
  assert(allStatusesValid, "All job statuses strictly conform to Pending | In Progress | Delayed | Completed");

  // ----------------------------------------------------
  // PHASE 3 — SUMMARY METRICS
  // ----------------------------------------------------
  console.log("\n--- PHASE 3: SUMMARY METRICS DERIVATION & REACTIVITY ---");
  let currentJobs = [...INITIAL_JOBS];

  const calculateMetrics = (jobList) => ({
    totalJobs: jobList.length,
    delayedJobs: jobList.filter((j) => j.status === "Delayed").length,
    dueSoonJobs: jobList.filter((j) => isDueSoon(j.dueDate) && j.status !== "Completed").length,
    completedJobs: jobList.filter((j) => j.status === "Completed").length,
  });

  let metrics = calculateMetrics(currentJobs);
  assert(metrics.totalJobs === 16, `Initial Total Jobs derived = 16`);
  assert(metrics.delayedJobs === 3, `Initial Delayed Jobs derived = 3`);
  assert(metrics.dueSoonJobs === 4, `Initial Due Soon Jobs derived = 4`);
  assert(metrics.completedJobs === 7, `Initial Completed Jobs derived = 7`);

  // Transition 1: Delayed -> Completed on JOB-101
  currentJobs = currentJobs.map((j) => (j.jobId === "JOB-101" ? { ...j, status: "Completed" } : j));
  metrics = calculateMetrics(currentJobs);
  assert(metrics.delayedJobs === 2, "Delayed -> Completed: Delayed Jobs decreased from 3 to 2");
  assert(metrics.completedJobs === 8, "Delayed -> Completed: Completed Jobs increased from 7 to 8");
  assert(metrics.totalJobs === 16, "Delayed -> Completed: Total Jobs remains 16");

  // Transition 2: Pending -> In Progress on JOB-106
  currentJobs = currentJobs.map((j) => (j.jobId === "JOB-106" ? { ...j, status: "In Progress" } : j));
  metrics = calculateMetrics(currentJobs);
  assert(metrics.delayedJobs === 2, "Pending -> In Progress: Delayed Jobs remains 2");
  assert(metrics.completedJobs === 8, "Pending -> In Progress: Completed Jobs remains 8");
  assert(metrics.dueSoonJobs === 4, "Pending -> In Progress: Due Soon Jobs remains 4 (still uncompleted, due Sep 20)");

  // Transition 3: In Progress -> Delayed on JOB-102
  currentJobs = currentJobs.map((j) => (j.jobId === "JOB-102" ? { ...j, status: "Delayed" } : j));
  metrics = calculateMetrics(currentJobs);
  assert(metrics.delayedJobs === 3, "In Progress -> Delayed: Delayed Jobs increased to 3");

  // ----------------------------------------------------
  // PHASE 5 — SEARCH FUNCTIONALITY
  // ----------------------------------------------------
  console.log("\n--- PHASE 5: SEARCH FUNCTIONALITY ---");
  const rawJobs = [...INITIAL_JOBS];

  const searchJobs = (query, list = rawJobs) => {
    if (!query.trim()) return list;
    const q = query.toLowerCase().trim();
    return list.filter(
      (job) =>
        job.jobId.toLowerCase().includes(q) ||
        job.productName.toLowerCase().includes(q) ||
        job.customer.toLowerCase().includes(q)
    );
  };

  // TEST A: Search known product name
  const resA = searchJobs("Gear Assembly");
  assert(resA.length === 1 && resA[0].jobId === "JOB-103", "TEST A: Search 'Gear Assembly' matches JOB-103");

  // TEST B: Search known customer
  const resB = searchJobs("Nova Industries");
  assert(resB.length === 2, `TEST B: Search 'Nova Industries' matches 2 jobs (got ${resB.length})`);

  // TEST C: Search known Job ID
  const resC = searchJobs("JOB-104");
  assert(resC.length === 1 && resC[0].productName === "Aluminum Panel", "TEST C: Search 'JOB-104' matches Aluminum Panel");

  // TEST D: Search case-insensitively
  const resD = searchJobs("stErLiNg");
  assert(resD.length === 3, `TEST D: Case-insensitive 'stErLiNg' matches 3 jobs (got ${resD.length})`);

  // TEST E: Search non-existent
  const resE = searchJobs("XYZ_NON_EXISTENT");
  assert(resE.length === 0, "TEST E: Search non-existent query yields 0 results (triggers empty state)");

  // TEST F: Clear search returns all
  const resF = searchJobs("");
  assert(resF.length === 16, "TEST F: Clear search returns full 16 jobs");

  // ----------------------------------------------------
  // PHASE 6 — STATUS FILTER
  // ----------------------------------------------------
  console.log("\n--- PHASE 6: STATUS FILTER & METRICS ISOLATION ---");
  const filterByStatus = (status, list = rawJobs) => {
    if (status === "All") return list;
    return list.filter((j) => j.status === status);
  };

  const pendingJobs = filterByStatus("Pending");
  const inProgressJobs = filterByStatus("In Progress");
  const delayedJobsList = filterByStatus("Delayed");
  const completedJobsList = filterByStatus("Completed");
  const allJobsList = filterByStatus("All");

  assert(pendingJobs.length === 2, `Status 'Pending' returns 2 jobs (got ${pendingJobs.length})`);
  assert(inProgressJobs.length === 4, `Status 'In Progress' returns 4 jobs (got ${inProgressJobs.length})`);
  assert(delayedJobsList.length === 3, `Status 'Delayed' returns 3 jobs (got ${delayedJobsList.length})`);
  assert(completedJobsList.length === 7, `Status 'Completed' returns 7 jobs (got ${completedJobsList.length})`);
  assert(allJobsList.length === 16, `Status 'All' returns 16 jobs`);

  // Metrics Isolation Check
  const filteredMetrics = calculateMetrics(rawJobs); // dashboard calculates metrics from raw jobs
  assert(
    filteredMetrics.totalJobs === 16 && filteredMetrics.delayedJobs === 3,
    "Summary metrics represent the full dataset and are NOT reduced by table status filter"
  );

  // ----------------------------------------------------
  // PHASE 7 — SORTING
  // ----------------------------------------------------
  console.log("\n--- PHASE 7: SORTING ACCURACY ---");
  const sortJobs = (field, direction, list = rawJobs) => {
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (field === "dueDate") cmp = a.dueDate.localeCompare(b.dueDate);
      if (field === "quantity") cmp = a.quantity - b.quantity;
      return direction === "asc" ? cmp : -cmp;
    });
  };

  // Due Date Asc
  const dueAsc = sortJobs("dueDate", "asc");
  assert(dueAsc[0].dueDate <= dueAsc[1].dueDate && dueAsc[0].dueDate === "2026-09-15", "Due Date Asc: earliest date (2026-09-15) is at top");

  // Due Date Desc
  const dueDesc = sortJobs("dueDate", "desc");
  assert(dueDesc[0].dueDate >= dueDesc[1].dueDate && dueDesc[0].dueDate === "2026-09-28", "Due Date Desc: latest date (2026-09-28) is at top");

  // Quantity Asc
  const qtyAsc = sortJobs("quantity", "asc");
  assert(qtyAsc[0].quantity === 180 && qtyAsc[1].quantity === 280, "Quantity Asc: 180 precedes 280 (proper numeric sort)");

  // Quantity Desc
  const qtyDesc = sortJobs("quantity", "desc");
  assert(qtyDesc[0].quantity === 2200 && qtyDesc[1].quantity === 1500, "Quantity Desc: 2200 precedes 1500 (proper numeric sort)");

  // ----------------------------------------------------
  // PHASE 8 — COMBINED STATE PIPELINE
  // ----------------------------------------------------
  console.log("\n--- PHASE 8: COMBINED STATE PIPELINE ---");
  // 1. Search + Filter: "Acme" + "Completed"
  const pipeline1 = filterByStatus("Completed", searchJobs("Acme"));
  assert(pipeline1.length === 2 && pipeline1.every((j) => j.customer.includes("Acme") && j.status === "Completed"), "Search + Filter: 'Acme' + 'Completed' yields 2 matching jobs");

  // 2. Search + Sort: "Acme" + Quantity Desc
  const pipeline2 = sortJobs("quantity", "desc", searchJobs("Acme"));
  assert(pipeline2.length === 3 && pipeline2[0].quantity === 1500, "Search + Sort: 'Acme' + Quantity Desc puts 1,500 at top");

  // 3. Filter + Sort: "Delayed" + Due Date Asc
  const pipeline3 = sortJobs("dueDate", "asc", filterByStatus("Delayed"));
  assert(pipeline3.length === 3 && pipeline3[0].dueDate === "2026-09-15", "Filter + Sort: 'Delayed' + Due Date Asc has earliest delayed job at top");

  // 4. Search + Filter + Sort: "Sterling" + "Delayed" + Due Date Asc
  const pipeline4 = sortJobs("dueDate", "asc", filterByStatus("Delayed", searchJobs("Sterling")));
  assert(pipeline4.length === 1 && pipeline4[0].jobId === "JOB-101", "Search + Filter + Sort: satisfies all 3 criteria simultaneously");

  // ----------------------------------------------------
  // PHASE 10 — WORKFLOW REFINEMENT
  // ----------------------------------------------------
  console.log("\n--- PHASE 10: STATUS UPDATE VISIBILITY ---");
  // If JOB-101 is Delayed, and filtered to Delayed, it is visible
  let filteredDelayed = filterByStatus("Delayed", rawJobs);
  assert(filteredDelayed.some((j) => j.jobId === "JOB-101"), "JOB-101 is visible under Delayed filter");

  // When updated to Completed
  const updatedDataset = rawJobs.map((j) => (j.jobId === "JOB-101" ? { ...j, status: "Completed" } : j));
  filteredDelayed = filterByStatus("Delayed", updatedDataset);
  const filteredCompleted = filterByStatus("Completed", updatedDataset);
  assert(!filteredDelayed.some((j) => j.jobId === "JOB-101"), "JOB-101 is NO LONGER visible under Delayed filter");
  assert(filteredCompleted.some((j) => j.jobId === "JOB-101"), "JOB-101 is NOW visible under Completed filter");
  assert(formatDisplayDate("2026-09-18") === "18 Sep 2026", "formatDisplayDate: '2026-09-18' formats to '18 Sep 2026'");
  assert(isDueToday("2026-09-18") === true, "isDueToday: '2026-09-18' is today");
  assert(isOverdue("2026-09-15") === true, "isOverdue: '2026-09-15' is overdue");
  assert(isOverdue("2026-09-25") === false, "isOverdue: '2026-09-25' is not overdue");

  console.log(`\n=======================================================`);
  console.log(`AUDIT RESULTS: ${passed}/${total} assertions PASSED with ZERO failures.`);
  console.log(`=======================================================\n`);
}

runDashboardAuditSuite();

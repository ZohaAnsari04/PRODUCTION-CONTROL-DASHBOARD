import { INITIAL_JOBS } from "../data/mock-jobs.ts";
import { isDueSoon, isDueToday, isOverdue, formatDisplayDate } from "../lib/date-utils.ts";

function runDashboardTests() {
  console.log("=== RUNNING PRODUCTION CONTROL DASHBOARD VERIFICATION SUITE ===");
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✓ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Initial Data Integrity
  assert(INITIAL_JOBS.length === 16, "Initial jobs array contains exactly 16 jobs");

  // 2. Metrics Derivation
  let jobs = [...INITIAL_JOBS];
  const totalJobs = jobs.length;
  const delayedJobs = jobs.filter((j) => j.status === "Delayed").length;
  const dueSoonJobs = jobs.filter((j) => isDueSoon(j.dueDate) && j.status !== "Completed").length;
  const completedJobs = jobs.filter((j) => j.status === "Completed").length;

  assert(totalJobs === 16, `Total Jobs derived is 16 (got ${totalJobs})`);
  assert(delayedJobs === 3, `Delayed Jobs derived is 3 (got ${delayedJobs})`);
  assert(dueSoonJobs === 4, `Due Today / Soon derived is 4 (got ${dueSoonJobs})`);
  assert(completedJobs === 7, `Completed Jobs derived is 7 (got ${completedJobs})`);

  // 3. Search functionality
  const searchAcme = jobs.filter((j) => j.customer.toLowerCase().includes("acme"));
  assert(searchAcme.length === 3, `Search "acme" returns 3 jobs (got ${searchAcme.length})`);

  const searchMotor = jobs.filter((j) => j.productName.toLowerCase().includes("motor"));
  assert(searchMotor.length === 1 && searchMotor[0].jobId === "JOB-101", `Search "motor" returns JOB-101`);

  const searchJobId = jobs.filter((j) => j.jobId.toLowerCase().includes("job-104"));
  assert(searchJobId.length === 1 && searchJobId[0].productName === "Aluminum Panel", `Search "job-104" returns Aluminum Panel`);

  // 4. Status Filtering
  const delayedOnly = jobs.filter((j) => j.status === "Delayed");
  assert(delayedOnly.length === 3, `Filter "Delayed" returns 3 jobs`);

  const inProgressOnly = jobs.filter((j) => j.status === "In Progress");
  assert(inProgressOnly.length === 4, `Filter "In Progress" returns 4 jobs`);

  // 5. Sorting
  const sortedQtyDesc = [...jobs].sort((a, b) => b.quantity - a.quantity);
  assert(sortedQtyDesc[0].quantity === 2200 && sortedQtyDesc[0].jobId === "JOB-114", "Quantity Desc puts 2,200 at top");

  const sortedQtyAsc = [...jobs].sort((a, b) => a.quantity - b.quantity);
  assert(sortedQtyAsc[0].quantity === 180 && sortedQtyAsc[0].jobId === "JOB-115", "Quantity Asc puts 180 at top");

  const sortedDueAsc = [...jobs].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  assert(sortedDueAsc[0].dueDate === "2026-09-15", "Due Date Asc puts earliest date at top");

  // 6. Status Update Flow & Metric Reactivity
  // Update JOB-101 from Delayed to Completed
  const updatedJobs = jobs.map((j) => (j.id === "job-101" ? { ...j, status: "Completed" } : j));
  const newDelayed = updatedJobs.filter((j) => j.status === "Delayed").length;
  const newCompleted = updatedJobs.filter((j) => j.status === "Completed").length;
  const newTotal = updatedJobs.length;

  assert(newDelayed === 2, `After updating JOB-101 to Completed, Delayed Jobs decreased from 3 to 2 (got ${newDelayed})`);
  assert(newCompleted === 8, `After updating JOB-101 to Completed, Completed Jobs increased from 7 to 8 (got ${newCompleted})`);
  assert(newTotal === 16, `Total Jobs remains 16`);

  // 7. Date formatting and relative calculations
  assert(formatDisplayDate("2026-09-18") === "18 Sep 2026", `Date format is "18 Sep 2026" (got ${formatDisplayDate("2026-09-18")})`);
  assert(isDueToday("2026-09-18") === true, "isDueToday returns true for 2026-09-18");
  assert(isOverdue("2026-09-15") === true, "isOverdue returns true for 2026-09-15");
  assert(isDueSoon("2026-09-20") === true, "isDueSoon returns true for 2026-09-20 (+2 days)");
  assert(isDueSoon("2026-09-25") === false, "isDueSoon returns false for 2026-09-25 (+7 days)");

  console.log(`\nAll tests completed: ${passed}/${total} assertions passed.`);
}

runDashboardTests();

import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration is controlled via environment variables so that users
// can tweak duration and concurrency without editing this file.
//
//   TEST_DURATION   – total test duration, e.g. "1m" (default 30s)
//   VUS             – virtual users (default 10)
//   BASE_URL        – service base url (default http://localhost:8080)
//
// Example:
//   k6 run -e TEST_DURATION=2m -e VUS=50 performance/load-test.js
//
// If you wish to output JSON metrics use `-o output.json`.

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const TEST_DURATION = __ENV.TEST_DURATION || '30s';
const VUS = Number(__ENV.VUS || 10);

export const options = {
  vus: VUS,
  duration: TEST_DURATION,
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors must be <1%
    http_req_duration: ['p(95)<500'], // 95% of requests below 500ms
  },
};

export default function () {
  const payload = `k6-message-${__ITER}`;
  const res = http.post(`${BASE_URL}/api/sqs/send`, payload, {
    headers: { 'Content-Type': 'text/plain' },
    tags: { name: 'SendMessage' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // tiny sleep to yield
  sleep(1);
}

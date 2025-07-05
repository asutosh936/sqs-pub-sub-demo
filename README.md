# sqs-pub-sub-demo

Spring Boot 3 application that demonstrates sending and receiving messages to AWS SQS with zero-known CVE dependencies.

## Prerequisites

* JDK 17+
* Maven 3.9+
* AWS credentials with permissions for SQS (via environment variables, AWS profile, or IAM role)
* An existing SQS queue (obtain its URL)

## Configuration

The application reads configuration from `application.yml` or environment variables:

```yaml
aws:
  region: us-east-1              # AWS_REGION
  access-key: ${AWS_ACCESS_KEY_ID:}
  secret-key: ${AWS_SECRET_ACCESS_KEY:}
  sqs:
    queue-url: ${AWS_SQS_QUEUE_URL:}
```

You can supply credentials via the default AWS provider chain (recommended) or set values explicitly.

## Build & Run

```bash
# run dependency vulnerability scan and build the JAR
mvn clean verify

# run the application
java -jar target/sqs-pub-sub-demo-0.0.1-SNAPSHOT.jar
```

OpenAPI endpoint will be available at `http://localhost:8080/api/sqs/send` (POST raw body).

Example:

```bash
curl -X POST http://localhost:8080/api/sqs/send \
     -H 'Content-Type: text/plain' \
     -d 'Hello from Spring Boot & SQS!'
```

## Automated API Tests (Karate)

Karate files live under the root-level `Test` folder so they remain separate from normal unit tests:

```
Test/
├── java/com/example/sqs/SqsKarateTest.java   # JUnit 5 runner
├── java/com/example/sqs/sqs.feature          # Scenario(s)
└── resources/karate-config.js                # Global Karate config
```

The feature sends a POST request to `/api/sqs/send` and asserts an HTTP `200` status while the
background Spring thread consumes the message from the same queue.

Run all Karate tests with Maven (the Spring app is auto-started on port 8080 for the duration):

```bash
mvn test
```

You should see output like `Karate version: 1.4.1 | pass: 1, fail: 0`.

To debug a single scenario, add `@debug` to the scenario and run:

```bash
mvn test -Dkarate.options="--tags @debug"
```

---

## Performance Testing (k6)

`performance/load-test.js` generates continuous traffic against the `/api/sqs/send` endpoint and verifies that each request returns HTTP 200.

### Install k6

Mac (Homebrew):
```bash
brew install k6
```
Ubuntu / Debian:
```bash
sudo apt install -y gnupg ca-certificates && \
curl -fsSL https://dl.k6.io/key.gpg | sudo tee /etc/apt/trusted.gpg.d/k6.asc >/dev/null && \
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list && \
sudo apt update && sudo apt install k6
```
Windows (Chocolatey):
```powershell
choco install k6
```
Alternatively run via Docker:
```bash
docker run -i loadimpact/k6 run - < performance/load-test.js
```

### Running the test

Start your Spring Boot app (or ensure it is already running):
```bash
mvn spring-boot:run
```

Then from another terminal execute:
```bash
# 30-second smoke test with 10 virtual users (defaults)
k6 run performance/load-test.js

# Heavier 5-minute test with 100 VUs
k6 run -e TEST_DURATION=5m -e VUS=100 performance/load-test.js
```
Environment variables:
* `BASE_URL` – service base URL (default `http://localhost:8080`)
* `TEST_DURATION` – total duration, e.g. `2m`, `30s`
* `VUS` – number of concurrent virtual users

Thresholds inside the script will fail the test if
* `http_req_failed` ≥ 1 %
* 95th percentile latency ≥ 500 ms

---




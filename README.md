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

## Security

The build incorporates the OWASP `dependency-check` Maven plugin. The build will fail if any transitive dependency has a CVSS score ≥ 7.

To generate a full HTML report:

```bash
mvn dependency-check:aggregate
```

## License

MIT


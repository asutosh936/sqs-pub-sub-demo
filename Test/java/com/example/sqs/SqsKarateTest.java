package com.example.sqs;

import com.intuit.karate.junit5.Karate;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Karate runner located under the root-level Test folder. It spins up the full
 * Spring application on port 8080 and runs the scenarios defined in
 * sqs.feature to validate publish & subscribe behaviour.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
class SqsKarateTest {

    @Karate.Test
    Karate testSqs() {
        return Karate.run("sqs").relativeTo(getClass());
    }
}

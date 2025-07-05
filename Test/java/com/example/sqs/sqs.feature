Feature: Validate SQS publish/subscribe via REST

  Background:
    * url 'http://localhost:8080'

  Scenario: POST message and expect 200 OK
    Given path '/api/sqs/send'
    And request 'Hello from Karate at root Test folder!'
    When method post
    Then status 200

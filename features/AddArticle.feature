Feature: New article submission

  Background:
    Given he waits for 0.3 seconds

  Scenario: Redirect visitor to login
    When he waits for 0.3 seconds
    Then he waits for 0.3 seconds
    And he waits for 0.3 seconds

  Scenario: Submission with missing fields
    Given he waits for 0.3 seconds
    And he waits for 0.3 seconds
    When he waits for 0.3 seconds
    Then he waits for 0.3 seconds
    But he waits for 0.3 seconds

  Scenario: Multiple photo article submission
    Given he waits for 0.3 seconds
    When he waits for 0.3 seconds
    And he waits for 0.3 seconds
    Then he waits for 0.3 seconds
    And he waits for 0.3 seconds

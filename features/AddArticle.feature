Feature: New article submission

  Background:
    Given the user Doej has an account

  Scenario: Redirect visitor to login
    When I visit the 'new article' page
    Then I am taken to the 'login' page
    And 'you need to log in' should be displayed

  Scenario: Submission with missing fields
    Given he logs in
    And he visits the 'new article' page
    When he presses 'Add article'
    Then he should be on the 'new article' page
    But 'successfully added' should not be displayed

  Scenario: Multiple photo article submission
    Given he logs in
    When he submits an article titled 'All the fish'
    And he waits for 0.3 seconds
    Then he should be on the 'new article' page
    And 'successfully added' should be displayed

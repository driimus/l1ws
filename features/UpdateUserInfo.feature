Feature: User account information

  Background:
    Given the user Doej has an account
    And he logs in
    And he is on the 'account details' page

  Scenario: User updates his email address
    Given he updates the 'email' field
    When he presses submit
    Then 'details were updated' should be displayed

  Scenario: User updates his avatar
    Given he uploads a new avatar
    When he presses submit
    Then he should be on the 'account details' page
    And he should have a new avatar

  Scenario: User subscribes to the newsletter
    Given he checks 'subscribe'
    And he waits for 1 second
    When he presses submit
    Then 'details were updated' should be displayed
    And 'subscribed' should be checked

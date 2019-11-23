Feature: User authentication

  Background:
    Given the user Doej has an account
    And he is on the 'login' page

  Scenario: Wrong account password
    Given he enters the wrong password
    When he presses submit
    Then 'invalid password' should be displayed

  Scenario: Inexistent account
    Given he enters the wrong username
    When he presses submit
    Then he should be on the 'login' page
    And 'not found' should be displayed

  Scenario: Successful login
    Given he logs in
    When he is taken to the 'home' page
    And he waits for 0.3 seconds
    Then 'you are now logged in' should be displayed

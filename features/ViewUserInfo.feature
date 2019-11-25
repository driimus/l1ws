Feature: User account information

  Scenario: View Admin account information
    Given the admin logs in
    And he waits for 1 second
    When he visits the 'account details' page
    Then 'Admin' should be displayed

  Scenario: Redirect visitor to login
    When I visit the 'account details' page
    Then I am taken to the 'login' page
    And 'you need to log in' should be displayed

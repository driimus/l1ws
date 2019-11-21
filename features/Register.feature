Feature: User registration

  Background:
    Given the user Doej has an account
    And I am on the 'signup' page

  Scenario: Unavailable account username
    Given I try to sign up with an existent username
    When I press submit
    Then a 'duplicate username' error should be displayed

  Scenario: Unavailable account email
    Given I try to sign up with an existent email
    When I press submit
    Then a 'duplicate email' error should be displayed

  Scenario: Successful registration
    Given I try to sign up
    When I press submit
    Then I should be on the 'home' page
    And 'You have now signed up' should be displayed

Feature: Homepage

  Scenario: No published articles
    Given I wait for 3 seconds
    And I am on the 'home' page
    Then I should see 'no published articles'

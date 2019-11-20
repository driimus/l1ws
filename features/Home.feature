Feature: Homepage

  Scenario: No published articles
    Given the user Doej has an account
    And he logs in
    Then he should be on the home page
    And 'no published articles' should be displayed

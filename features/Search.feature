Feature: Search articles

  Background:
    Given the user Doej has an account
    And an approved article titled 'All the fish' posted by Doej

  Scenario: No search results
    Given I am on the 'home' page
    And I type 'unrelated123' in the 'search' field
    When I press search
    Then I should be on the 'search' page
    But 'the search generated no results' should be displayed

  Scenario: Result with matching keyword
    Given I am on the 'home' page
    And I type 'All the fish' in the 'search' field
    When I press search
    Then I should be on the 'search' page
    And 1 article should be listed

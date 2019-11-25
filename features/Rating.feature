Feature: Rate existing article

  Background:
    Given the user Doej has an account
    And an approved article titled 'All the fish' posted by Doej

  Scenario: Visitor tries to rate article
    Given I visit the article
    When I rate the article 5 stars
    And I dismiss the alert
    Then '5/5 on average' should not be displayed

  Scenario: Authenticated user rates article
    Given he logs in
    And he visits the article
    When he rates the article 5 stars
    Then '5/5 on average' should be displayed
    But he rates the article 3 stars
    And '3/5 on average' should be displayed

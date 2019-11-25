Feature: Edit existing article

  Background:
    Given the user Doej has an account
    And an approved article titled 'All the fish' posted by Doej

  Scenario: Non-author views article
    Given I visit the article
    And 'Edit' should not be displayed
    When I try to edit the article
    Then I am taken to the 'login' page

  Scenario: Article is edited and flagged as pending
    Given he logs in
    And he visits the article
    When he edits the 'summary'
    And he waits for 1 second
    Then 'successfully edited' should be displayed
    But 'All the fish' should not be displayed

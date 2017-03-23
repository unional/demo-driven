@playground
Feature: Start playground
  In order to learn how to use a component
  As a developer
  I want to have a interactive playground to test out the code

  Scenario: Create a blank playground
    Given I have the "minimum" config
    When the application starts
    Then the playground is empty

  Scenario: Create a pre-loaded playground
    Given I have the "single preload" config
    And the "single preload" has some "non-empty value" in its playground content section
    When the application starts
    Then The playground should have the same "non-empty value" in there

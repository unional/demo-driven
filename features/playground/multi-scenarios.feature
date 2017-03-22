@playground
Feature: support multiple scenarios
  In order to demo all features of a library
  As a library author
  I want to define config that will show multiple scenarios for the user to choose and try out

  Scenario: one secnario
    Given I use the "one scenario" config
    When I run the "playground" cli command
    Then the scenario is preloaded
    And scenario selector is not available

  Scenario: two scenarios
    Given I use the "two scenarios" config
    When I run the "playground" cli command
    Then there should be two scenarios available
    And the first scenario is preloaded
    And I can select the second scenario
    And playground will be updated with the second scenario

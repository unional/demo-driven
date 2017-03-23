@playground
Feature: support multiple scenarios
  In order to demo all features of a library
  As a library author
  I want to define config that will show multiple scenarios for the user to choose and try out

  Scenario: one scenario
    When the application starts with the "single scenario" config
    Then the "NO_SCENARIO_SELECTOR" message is received

  Scenario: two scenarios
    When the application starts with the "two scenarios" config
    Then the "HAS_SCENARIO_SELECTOR" message is received
    And the "2_SCENARIO" message is received
    When select "scenario 2"
    And the playground should contain "scenario 2"

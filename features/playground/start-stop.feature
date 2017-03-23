@playground
Feature: Start playground
  In order to learn how to use a component
  As a developer
  I want to have a interactive playground to test out the code

  Scenario: Create a blank playground
    When the application starts with the "minimum" config
    Then the playground is empty

  Scenario: Create a pre-loaded playground
    Given the "single preload" config has "one" scenario with "console.log('preloaded')"
    When the application starts with the "single scenario" config
    Then the playground should contain "console.log('preloaded')"

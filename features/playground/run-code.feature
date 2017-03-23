@playground
Feature: Run code in playground
  In order to learn how to use a component
  As a developer
  I want to have a interactive playground to test out the code

  Scenario: Run simple code
    Given I use the "single preload" config
    When the application starts
    And I tell the playground to run
    Then "I am pre-loaded" will be printed in the result

  Scenario: Run imported code
    Given I use the "color-map" config
    When the application starts
    And I tell the playground to run
    Then "[{r:100,g:100:b100}]" will be printed in the result

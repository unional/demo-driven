@playground
Feature: Run code in playground
  In order to learn how to use a component
  As a developer
  I want to have a interactive playground to test out the code

  Scenario: Run simple code
    Given the application starts with the "single scenario" config
    When I tell the playground to "run"
    Then "preloaded" will be printed in the result

  Scenario: Run imported code
    Given the application starts with the "color-map" config
    When I tell the playground to "run"
    Then "[{r:100,g:100:b100}]" will be printed in the result

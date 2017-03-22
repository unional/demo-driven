@playground
Feature: Start playground
  In order to learn how to use a component
  As a developer
  I want to have a interactive playground to test out the code

  Scenario: Create a blank playground
    Given I have the "minimum" config
    When I run the "playground" cli command
    Then A boilerplate page will be served
    And there is a empty playground in there

Scenario: Create a pre-loaded playground
  Given I have the "single preload" config
  When I run the "playground" cli command
  Then The playground should have "console.log('I am pre-loaded')" in there

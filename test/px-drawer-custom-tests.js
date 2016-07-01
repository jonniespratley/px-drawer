// This is the wrapper for custom tests, called upon web components ready state
function runCustomTests() {
  // Place any setup steps like variable declaration and initialization here

  // This is the placeholder suite to place custom tests in
  // Use testCase(options) for a more convenient setup of the test cases
  suite('Custom Automation Tests for px-drawer', function () {
    suite('<px-drawer>', function () {
      var element = document.getElementById('px_drawer_1');
      test('renders', function () {
        assert.ok(element);
      });

    });
  });
}

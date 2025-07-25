# Testing Documentation for Group 10 Bookstore

This directory contains unit tests for the Group 10 Bookstore application. The tests are written using Jest, a popular JavaScript testing framework.

## Test Structure

The tests are organized to mirror the project structure:

- `__tests__/controllers/`: Tests for controller functions
- `__tests__/models/`: Tests for model methods
- `__tests__/utils/`: Tests for utility functions

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (tests will automatically re-run when files change):

```bash
npm run test:watch
```

To run a specific test file:

```bash
npx jest path/to/test/file.js
```

For example:

```bash
npx jest __tests__/controllers/cartController.test.js
```

## Test Coverage

The tests cover the following components:

1. **JWT Utilities** (`__tests__/utils/jwt.test.js`)
   - Tests for token signing and verification functions

2. **Book Model** (`__tests__/models/bookModel.test.js`)
   - Tests for the BookManager.createStock method

3. **User Model** (`__tests__/models/userModel.test.js`)
   - Tests for the comparePassword method and password hashing

4. **Cart Controller** (`__tests__/controllers/cartController.test.js`)
   - Tests for the calculateCartTotals function

5. **Category Controller** (`__tests__/controllers/categoryController.test.js`)
   - Tests for the createCategory function

## Mocking Strategy

The tests use Jest's mocking capabilities to isolate the units being tested:

- External libraries like `mongoose`, `bcryptjs`, and `jsonwebtoken` are mocked
- Database operations are mocked to avoid actual database connections
- Request and response objects are mocked for controller tests

## Test Patterns

Each test file follows a similar pattern:

1. **Setup**: Import dependencies and set up mocks
2. **Test Suite**: Group related tests using `describe` blocks
3. **Test Cases**: Individual test cases using `test` or `it` functions
4. **Assertions**: Verify expected behavior using Jest's assertion functions

## Future Improvements

Some potential improvements for the test suite:

1. Add integration tests that test the interaction between components
2. Add end-to-end tests that test the entire application flow
3. Add test coverage reporting to identify untested code
4. Add more test cases to cover edge cases and error scenarios
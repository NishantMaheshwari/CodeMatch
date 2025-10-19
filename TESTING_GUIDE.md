# Testing Guide

## Setup Complete ✅

Your testing environment is fully configured with:
- Jest
- React Testing Library
- jsdom
- Babel for JSX transformation
- @testing-library/jest-dom for DOM matchers

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run tests silently (less output)
npm test -- --silent
```

## Navbar Component Tests

The Navbar component now has comprehensive tests covering:

### 1. **Rendering Tests**
- ✓ Renders the logo/brand name
- ✓ Shows fixed positioning classes

### 2. **User State Tests**
- ✓ Does not show user info when user is not logged in
- ✓ Shows welcome message with user first name when logged in
- ✓ Shows user avatar when logged in

### 3. **Navigation Tests**
- ✓ Displays dropdown menu items when user is logged in
- ✓ Navigation links have correct href attributes
- ✓ Logo links to home page

### 4. **Interactive Tests**
- ✓ Calls logout API and navigates to login on logout button click
- ✓ Handles logout error gracefully

### 5. **UI Elements Tests**
- ✓ Displays badges on menu items

## Test Coverage

Current coverage for Navbar component: **100%**
- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

## Configuration Files

### jest.config.mjs
- Test environment: jsdom
- Transform: babel-jest for JSX/JS files
- Module name mapper: identity-obj-proxy for CSS imports
- Setup file: jest.setup.js

### jest.setup.js
- Polyfills for TextEncoder/TextDecoder
- Imports @testing-library/jest-dom for custom matchers

### babel.config.js
- @babel/preset-env for modern JavaScript
- @babel/preset-react for JSX transformation

## Writing More Tests

To add tests for other components, follow this pattern:

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import YourComponent from '../YourComponent';

// Mock any dependencies
jest.mock('axios');

describe('YourComponent', () => {
  test('renders correctly', () => {
    // Setup
    const store = configureStore({
      reducer: { /* your reducers */ }
    });
    
    // Render
    render(
      <Provider store={store}>
        <BrowserRouter>
          <YourComponent />
        </BrowserRouter>
      </Provider>
    );
    
    // Assert
    expect(screen.getByText(/some text/i)).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Organize tests** in `__tests__` folders next to components
2. **Name test files** with `.test.js` or `.spec.js` suffix
3. **Mock external dependencies** (axios, socket.io, etc.)
4. **Test user interactions** not implementation details
5. **Use descriptive test names** that explain what is being tested
6. **Maintain high coverage** but focus on meaningful tests

## Troubleshooting

### Issue: Module not found errors
- Check that all dependencies are installed: `npm install`

### Issue: CSS import errors
- Ensure `identity-obj-proxy` is installed
- Check `moduleNameMapper` in jest.config.mjs

### Issue: JSX transformation errors
- Verify @babel/preset-react is installed
- Check babel.config.js configuration

### Issue: TextEncoder not defined
- Ensure jest.setup.js includes TextEncoder/TextDecoder polyfills


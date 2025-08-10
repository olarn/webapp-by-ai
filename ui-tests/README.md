# UI Automation Tests for Course Platform

This directory contains comprehensive UI automation tests for the Course Platform using Playwright. The tests are based on the user stories from `Requirement-Student.txt` and `Requirement-Teacher.txt`.

## 🎯 Test Coverage

### Student User Stories (Requirement-Student.txt)

1. **US1: Course List on Home Screen**
   - ✅ Display course list with lazy loading
   - ✅ Course cards with title, image, price
   - ✅ Responsive design for mobile/tablet

2. **US2: Navigate to Course Detail Page**
   - ✅ Click on course name to navigate
   - ✅ Click on course image to navigate
   - ✅ Verify course details page loads

3. **US3: Back Navigation**
   - ✅ Back button from course details to course list
   - ✅ Proper URL navigation

4. **US4: Teacher Profile from Course Details**
   - ✅ Teacher name display
   - ✅ Teacher background information
   - ✅ Teacher portrait
   - ✅ Teacher specialties

5. **US5: Teacher Profile from Course List**
   - ✅ Teacher information on course cards
   - ✅ Teacher name visibility

6. **US6: Enrollment Process**
   - ✅ Click enroll button
   - ✅ Fill personal information form
   - ✅ Form validation
   - ✅ Submit enrollment

7. **US7: Payment Process**
   - ✅ Payment screen with QR code
   - ✅ Payment and payee information
   - ✅ Mock payment gateway
   - ✅ Payment success simulation
   - ✅ Success dialog and navigation
   - ✅ Data persistence verification

### Teacher User Stories (Requirement-Teacher.txt)

1. **US1: Teacher Login**
   - ✅ Access teacher login page
   - ✅ Login with valid credentials
   - ✅ Error handling for invalid credentials

2. **US2: Create Course**
   - ✅ Create new course form
   - ✅ Fill course information
   - ✅ Submit and verify course creation

3. **US3: View Course List**
   - ✅ Display teacher's courses
   - ✅ Course information visibility
   - ✅ Course status display

4. **US4: Search Courses**
   - ✅ Search by keywords
   - ✅ Search results display
   - ✅ Clear search functionality

5. **US5: Update Course**
   - ✅ Edit course information
   - ✅ Update course details
   - ✅ Verify course updates

6. **US6: Disable Course**
   - ✅ Disable course functionality
   - ✅ Confirmation dialog
   - ✅ Course not visible on public

7. **US7: Delete Course**
   - ✅ Delete course functionality
   - ✅ Confirmation dialog
   - ✅ Course removal verification

## 🚀 Quick Start

### Prerequisites

1. Node.js 18+ installed
2. Backend and frontend dependencies installed
3. Playwright browsers installed

### Installation

```bash
# Install Playwright browsers
npm run test:e2e:install

# Or install all dependencies
npm run test:e2e:install-deps
```

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test files
npx playwright test student-user-stories.spec.ts
npx playwright test teacher-user-stories.spec.ts
npx playwright test complete-user-journey.spec.ts

# Run tests on specific browser
npm run test:e2e:chrome
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run mobile tests
npm run test:e2e:mobile

# Show test report
npm run test:e2e:report
```

## 📁 Test Structure

```
ui-tests/
├── README.md                    # This file
├── student-user-stories.spec.ts # Student user story tests
├── teacher-user-stories.spec.ts # Teacher user story tests
├── complete-user-journey.spec.ts # End-to-end user journeys
├── example.spec.ts              # Example tests (can be removed)
└── utils/
    └── test-helpers.ts          # Test utilities and helpers
```

## 🎯 Test Data Attributes

The tests use `data-testid` attributes to locate elements. Make sure your components include these attributes:

### Student Interface
- `data-testid="course-list"` - Course list container
- `data-testid="course-card"` - Course card container
- `data-testid="course-title"` - Course title
- `data-testid="course-image"` - Course image
- `data-testid="course-price"` - Course price
- `data-testid="course-teacher"` - Course teacher name
- `data-testid="course-detail-title"` - Course detail title
- `data-testid="teacher-profile"` - Teacher profile section
- `data-testid="teacher-name"` - Teacher name
- `data-testid="teacher-background"` - Teacher background
- `data-testid="teacher-portrait"` - Teacher portrait
- `data-testid="teacher-specialties"` - Teacher specialties
- `data-testid="enroll-button"` - Enroll button
- `data-testid="enrollment-form"` - Enrollment form
- `data-testid="student-name"` - Student name input
- `data-testid="student-email"` - Student email input
- `data-testid="student-phone"` - Student phone input
- `data-testid="submit-enrollment"` - Submit enrollment button
- `data-testid="payment-screen"` - Payment screen
- `data-testid="payment-info"` - Payment information
- `data-testid="payee-info"` - Payee information
- `data-testid="qr-code"` - QR code
- `data-testid="paid-button"` - Paid button
- `data-testid="success-dialog"` - Success dialog
- `data-testid="success-ok-button"` - Success OK button
- `data-testid="back-button"` - Back button

### Teacher Interface
- `data-testid="teacher-login-link"` - Teacher login link
- `data-testid="teacher-login-page"` - Teacher login page
- `data-testid="login-form"` - Login form
- `data-testid="email-input"` - Email input
- `data-testid="password-input"` - Password input
- `data-testid="login-button"` - Login button
- `data-testid="login-error"` - Login error message
- `data-testid="teacher-dashboard"` - Teacher dashboard
- `data-testid="create-course-button"` - Create course button
- `data-testid="create-course-form"` - Create course form
- `data-testid="course-title-input"` - Course title input
- `data-testid="course-description-input"` - Course description input
- `data-testid="course-price-input"` - Course price input
- `data-testid="course-category-select"` - Course category select
- `data-testid="submit-course-button"` - Submit course button
- `data-testid="course-created-success"` - Course created success message
- `data-testid="my-courses-link"` - My courses link
- `data-testid="my-courses-page"` - My courses page
- `data-testid="my-courses-list"` - My courses list
- `data-testid="my-course-card"` - My course card
- `data-testid="course-status"` - Course status
- `data-testid="course-search-input"` - Course search input
- `data-testid="search-results"` - Search results
- `data-testid="edit-course-button"` - Edit course button
- `data-testid="edit-course-form"` - Edit course form
- `data-testid="update-course-button"` - Update course button
- `data-testid="course-updated-success"` - Course updated success message
- `data-testid="disable-course-button"` - Disable course button
- `data-testid="disable-confirmation-dialog"` - Disable confirmation dialog
- `data-testid="confirm-disable-button"` - Confirm disable button
- `data-testid="delete-course-button"` - Delete course button
- `data-testid="delete-confirmation-dialog"` - Delete confirmation dialog
- `data-testid="confirm-delete-button"` - Confirm delete button
- `data-testid="course-deleted-success"` - Course deleted success message

## 🛠️ Test Utilities

### TestHelpers Class

The `TestHelpers` class provides utility methods for common test operations:

```typescript
import { TestHelpers } from './utils/test-helpers';

// Login as teacher
await TestHelpers.loginAsTeacherUI(page);

// Create course through UI
const courseTitle = await TestHelpers.createCourseUI(page, {
  title: 'Test Course',
  description: 'Test description',
  price: 99.99,
  category: 'web-development'
});

// Enroll in course through UI
await TestHelpers.enrollInCourseUI(page, {
  studentName: 'John Doe',
  studentEmail: 'john@example.com',
  studentPhone: '+1234567890'
});

// Complete payment through UI
await TestHelpers.completePaymentUI(page);
```

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)

- **Base URL**: `http://localhost:5173` (frontend)
- **Web Server**: Automatically starts backend (port 3000) and frontend (port 5173)
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Screenshots**: Taken on test failure
- **Videos**: Recorded on test failure
- **Traces**: Collected on first retry

## 🚦 CI/CD Integration

### GitHub Actions

The `.github/workflows/playwright.yml` file includes:

- **Main Test Job**: Runs all tests on all browsers
- **Individual Browser Jobs**: Separate jobs for Chromium, Firefox, WebKit
- **Artifact Upload**: Test reports and screenshots
- **Parallel Execution**: Tests run in parallel for faster feedback

## 📊 Test Reports

### HTML Report

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

The report includes:
- Test results and status
- Screenshots on failure
- Videos on failure
- Performance metrics
- Test timeline

## 🐛 Debugging Tests

### Debug Mode

```bash
npm run test:e2e:debug
```

This opens Playwright Inspector where you can:
- Step through tests
- Inspect elements
- Modify test actions
- View network requests

### Code Generation

```bash
npm run test:e2e:codegen
```

This opens Playwright Codegen where you can:
- Record user actions
- Generate test code
- Explore selectors

## 📝 Best Practices

### Writing Tests

1. **Use descriptive test names**: `As a Student, I can see list of course on home screen`
2. **Group related tests**: Use `test.describe()` for organization
3. **Use data-testid attributes**: For reliable element selection
4. **Handle async operations**: Use proper waits and assertions
5. **Clean up test data**: Use `afterAll` hooks for cleanup

### Test Structure

```typescript
test.describe('User Story Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup for each test
  });

  test('should do something specific', async ({ page }) => {
    // Test implementation
  });

  test.afterAll(async ({ request }) => {
    // Cleanup
  });
});
```

## 🔍 Troubleshooting

### Common Issues

1. **Tests fail on CI but pass locally**
   - Check for timing issues
   - Add explicit waits
   - Verify environment differences

2. **Element not found**
   - Verify data-testid attributes
   - Check if element is visible
   - Add waitFor statements

3. **Network timeouts**
   - Increase timeout values
   - Check server startup
   - Verify API endpoints

### Debug Commands

```bash
# Run specific test file
npx playwright test student-user-stories.spec.ts

# Run specific test
npx playwright test -g "should display homepage"

# Run with verbose output
npx playwright test --reporter=verbose

# Run with trace
npx playwright test --trace=on
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright GitHub Actions](https://playwright.dev/docs/ci-intro)

## 🤝 Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Add appropriate data-testid attributes to components
3. Include both positive and negative test cases
4. Add tests for error scenarios
5. Update this README if adding new test categories
6. Ensure tests work across all browsers
7. Add performance considerations for new features

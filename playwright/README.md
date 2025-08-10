# UI Testing with Accessibility-Based Selectors

This project uses accessibility-based selectors for Playwright UI testing, following best practices for both testing and accessibility.

## Testing Philosophy

### 1. Accessibility-First Approach
- **Primary**: Use semantic HTML roles and ARIA attributes
- **Secondary**: Use descriptive text content and labels
- **Fallback**: Use `data-testid` only when accessibility selectors are insufficient

### 2. Business-Meaningful Selectors
Selectors should reflect the business purpose, not implementation details:
- ✅ `[role="button"][aria-label="Create new course"]`
- ❌ `[data-testid="btn-create-course"]`

## Available Selectors

### Course List Component
```typescript
// Main content area
page.locator('[role="main"][aria-label="Course Catalog"]')

// Course grid
page.locator('[role="grid"][aria-label="Available courses"]')

// Individual course cards
page.locator('[role="gridcell"]')

// Search functionality
page.locator('[role="searchbox"][aria-label="Search courses by title, instructor, or category"]')

// Teacher login button
page.locator('[role="button"][aria-label="Access teacher login page"]')

// View course buttons
page.locator('[role="button"][aria-label*="View details"]')

// Teacher profile buttons
page.locator('[role="button"][aria-label*="View profile of"]')
```

### Course Modal Component
```typescript
// Modal dialog
page.locator('[role="dialog"][aria-label="Create Course Form"]')

// Form inputs
page.locator('[role="textbox"][aria-label="Course title"]')
page.locator('[role="textbox"][aria-label="Course description"]')
page.locator('[role="combobox"][aria-label="Course category selection"]')

// Action buttons
page.locator('[role="button"][aria-label="Create new course"]')
page.locator('[role="button"][aria-label="Cancel course creation/editing"]')
```

### Enrollment Form Component
```typescript
// Form modal
page.locator('[role="dialog"][aria-label="Course enrollment form"]')

// Form sections
page.locator('[role="group"][aria-labelledby="personal-info-heading"]')
page.locator('[role="group"][aria-labelledby="course-summary-heading"]')

// Form inputs
page.locator('[role="textbox"][aria-label="Student first name"]')
page.locator('[role="textbox"][aria-label="Student email address"]')
page.locator('[role="checkbox"][aria-label="Agree to terms and conditions"]')

// Action buttons
page.locator('[role="button"][aria-label="Proceed to payment for course enrollment"]')
```

### Teacher Dashboard Component
```typescript
// Main dashboard
page.locator('[role="main"][aria-label="Teacher course management dashboard"]')

// Statistics section
page.locator('[role="region"][aria-label="Course statistics"]')
page.locator('[role="article"][aria-label="Total courses count"]')

// Search and actions
page.locator('[role="search"][aria-label="Course search and management"]')
page.locator('[role="searchbox"][aria-label="Search teacher courses"]')

// Course management buttons
page.locator('[role="button"][aria-label="Create new course"]')
page.locator('[role="button"][aria-label*="Edit course:"]')
page.locator('[role="button"][aria-label*="Delete course:"]')
```

### Teacher Login Component
```typescript
// Main form
page.locator('[role="form"][aria-label="Teacher login credentials"]')

// Form inputs
page.locator('[role="textbox"][aria-label="Teacher username"]')
page.locator('[role="textbox"][aria-label="Teacher password"]')

// Submit button
page.locator('[role="button"][aria-label="Sign in to teacher account"]')

// Registration link
page.locator('[role="link"][aria-label="Navigate to teacher registration page"]')
```

## Testing Patterns

### 1. Role-Based Selection
```typescript
// Select all buttons
const buttons = page.locator('[role="button"]');

// Select specific button by aria-label
const createButton = page.locator('[role="button"][aria-label="Create new course"]');

// Select button with partial aria-label match
const editButtons = page.locator('[role="button"][aria-label*="Edit course:"]');
```

### 2. Semantic Content Selection
```typescript
// Select by heading text
await expect(page.locator('h1')).toContainText('Discover Amazing Courses');

// Select by descriptive text
await expect(page.locator('text=Teacher Login')).toBeVisible();

// Select by placeholder text
await expect(page.locator('[placeholder*="Search courses"]')).toBeVisible();
```

### 3. Dynamic Content Selection
```typescript
// Select loading states
await expect(page.locator('[role="status"][aria-live="polite"]')).toBeVisible();

// Select error messages
await expect(page.locator('[role="alert"][aria-live="assertive"]')).toBeVisible();

// Select search results
await expect(page.locator('[role="status"]')).toContainText('Showing');
```

## Best Practices

### 1. Descriptive Aria-Labels
- Use business language, not technical terms
- Include context when helpful
- Be specific but concise

### 2. Consistent Role Usage
- Use semantic HTML elements when possible
- Add explicit roles for custom components
- Maintain role hierarchy (e.g., `grid` → `gridcell`)

### 3. Live Regions
- Use `aria-live="polite"` for status updates
- Use `aria-live="assertive"` for errors
- Provide descriptive `aria-label` for context

### 4. Form Accessibility
- Use `aria-required="true"` for required fields
- Use `aria-invalid` for validation states
- Use `aria-describedby` to link fields with error messages

## Migration from data-testid

If you need to migrate existing tests:

```typescript
// Old way
page.locator('[data-testid="course-card"]')

// New way
page.locator('[role="gridcell"]')

// Or more specific
page.locator('[role="gridcell"][aria-label*="Course:"]')
```

## Benefits

1. **Better Accessibility**: Tests ensure the app is accessible
2. **More Robust**: Tests won't break due to CSS class changes
3. **Business Focused**: Selectors reflect user intent, not implementation
4. **Maintainable**: Changes to UI structure don't require test updates
5. **Compliance**: Helps meet accessibility standards (WCAG, Section 508)

## Running Tests

```bash
# Run all tests
npm run test:ui

# Run specific test file
npm run test:ui -- accessibility-selectors.spec.ts

# Run tests in headed mode
npm run test:ui -- --headed

# Run tests with debug
npm run test:ui -- --debug
```

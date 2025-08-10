# Scripts Directory

This directory contains various utility scripts for the project.

## Available Scripts

### Development Scripts

- **`start-servers.sh`** - Starts both backend and frontend servers for development
- **`run-ui-tests.sh`** - Comprehensive UI test runner that handles the complete workflow

### UI Test Scripts

- **`run-ui-tests.sh`** - **Main script** that handles the complete UI testing workflow (Linux/macOS)
- **`run-ui-tests-ui.sh`** - **Interactive script** that runs tests with Playwright UI mode
- **`run-ui-tests.bat`** - Windows version of the main script

## Usage

### Run Complete UI Test Workflow

The main script handles everything automatically:

```bash
# Run the complete UI test workflow (headless mode)
npm run test:ui

# Or use the full name
npm run test:ui:full

# Run with interactive Playwright UI mode
npm run test:ui:interactive
```

### Manual Server Management

For development work:

```bash
# Start servers manually for development
npm run start:servers
```

## What the Main Script Does

The `run-ui-tests.sh` script performs these steps automatically:

1. **🛑 Stop Servers** - Stops any existing frontend and backend servers
2. **🧹 Clean Up** - Removes all test results, reports, and artifacts
3. **🚀 Start Servers** - Starts fresh backend and frontend servers
4. **✅ Health Check** - Verifies both servers are running and responding
5. **🧪 Run Tests** - Executes all UI tests with Playwright
6. **🌐 Open Results** - Automatically opens test report in browser
7. **🧹 Cleanup** - Stops servers and provides test results

## Headless vs Interactive Mode

### Headless Mode (`run-ui-tests.sh`)
- Runs tests automatically without user interaction
- Servers are stopped after tests complete
- Best for CI/CD pipelines and automated testing
- Faster execution

### Interactive Mode (`run-ui-tests-ui.sh`)
- Opens Playwright UI for interactive test execution
- Servers remain running for debugging and development
- Best for development, debugging, and manual test exploration
- Allows step-by-step test execution and inspection

## What Gets Cleaned Up

The script automatically removes:

- `test-results/` directory - Contains test artifacts, traces, and screenshots
- `playwright-report/` directory - Contains HTML test reports
- `.last-run.json` file - Contains metadata from the last test run
- Temporary files in `ui-tests/` directory (`.log`, `.tmp`, `.cache`)

## Benefits of the Consolidated Approach

- **Single Command** - One script handles the entire workflow
- **No Manual Steps** - Everything is automated from start to finish
- **Consistent Environment** - Fresh servers and clean test results every time
- **Error Handling** - Proper cleanup even if tests fail
- **Colored Output** - Clear visual feedback for each step
- **Health Checks** - Ensures servers are ready before running tests
- **Auto-Browser** - Automatically opens test results in browser

## Test Results

After running the script, you'll find:

- **Test Results**: `test-results/` directory with artifacts and traces
- **Test Report**: `playwright-report/` directory with HTML reports
- **Server Logs**: `logs/` directory with backend and frontend logs

## Browser Integration

The script automatically opens test results in your default browser:

- **Success**: Opens the test report immediately after tests complete
- **Failure**: Still opens the report for debugging purposes
- **Cross-Platform**: Works on macOS, Linux, and Windows
- **Fallback**: Provides manual instructions if auto-opening fails

## Troubleshooting

### Port Conflicts
The script automatically handles port conflicts by killing existing processes.

### Server Startup Issues
Check the logs in the `logs/` directory for detailed error information.

### Test Failures
The script will show detailed test output and preserve test results for debugging.

## Integration

The scripts are integrated with npm scripts:

- `npm run test:ui` - Main test command (headless mode)
- `npm run test:ui:full` - Alternative name for the same command
- `npm run test:ui:interactive` - Interactive mode with Playwright UI
- `npm run start:servers` - Manual server management only

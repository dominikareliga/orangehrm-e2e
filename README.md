# OrangeHRM PIM automation

UI tests for the PIM module of the [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/), written in TypeScript with Playwright Test.

## Run it

```bash
npm install
npx playwright install chromium
npm test               # whole suite
npm run test:headed    # watch the browser, one test at a time
npm run test:ui        # pick tests and step through them
npm run report         # open the HTML report of the last run
```

Credentials default to the demo's public ones; copy `.env.example` to `.env` to override them.

## What is tested

| Workflow step | Test |
| --- | --- |
| Login | `auth/login.spec.ts` |
| Create a new employee | `pim/createEmployee.spec.ts` |
| Search for the created employee | `pim/searchEmployee.spec.ts` (by name) |
| Open employee details | `pim/openEmployeeDetails.spec.ts` |
| Edit employee information, verify it was saved | `pim/editEmployee.spec.ts` |

Additional regression scenarios:

- **Required fields** (`createEmployee.spec.ts`): no employee without a first and last name.
- **Search by employee id** (`searchEmployee.spec.ts`): the id filter returns only that employee.
- **Delete an employee** (`deleteEmployee.spec.ts`): the destructive path.

## Test organization

One test per behaviour, so a failure points at the step that broke. Tests that cover the same feature share a file and a `test.describe` (create, search). Specs sit in folders per product area (`specs/auth`, `specs/pim`) and are tagged by area (`@auth`, `@pim`).

## Reusable components

```
tests/
  page-objects/   one class per page; App is the entry point: app.pim.employeeList.searchById(id)
  fixtures/       app, api, employee and newEmployee, plus the sign-in setup
  requests/       API helpers: create, find and delete employees
  test-data/      builds a unique employee
  routes.ts       every page and API path
  config.ts       base URL and credentials
```

Page objects hold every locator and user action, so a UI change is fixed in one place. Locators use roles and labels; a CSS class is used only where OrangeHRM gives no accessible name.

## Test data management

Every test owns its data: a "Test Employee" with a random id, created through the API before the test and deleted after it, even if the test fails. The UI is used only for the behaviour under test. This keeps tests independent and safe to run in parallel on a demo shared with everyone.

## Assertions

Web-first `expect` on what the user sees: toasts, headings, rows, field values. No fixed waits. Where "saved" matters, the test reloads the page.

## Reporting

List output in the terminal and an HTML report. On failure: a screenshot; on a CI retry: a full trace. In CI, failures are annotated on the pull request and the HTML report is uploaded as an artifact.

## Execution strategy

A setup project signs in once and saves the session, so tests start signed in. Tests run fully parallel on two workers, polite to a public demo. One retry in CI only. The GitHub Actions workflow runs a typecheck, then the suite, on pull requests and pushes to `main`.

## Growing the suite

A new area is a folder of page objects, one domain on `App`, its routes, and a folder of specs. Nothing existing changes. As the suite grows, we would consider running it in more browsers, splitting it across several CI machines (sharding), and giving each parallel worker its own account once tests start changing user settings.

## Known limitation

The demo is public and resets itself, so a test can fail for reasons outside this code. Unique data, two workers and one CI retry are the mitigations.

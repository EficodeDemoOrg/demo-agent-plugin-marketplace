---
name: writing-playwright-tests
description: "Use when: writing, reviewing, or debugging Playwright UI tests, choosing resilient locators, replacing fixed waits, isolating test state, or reporting an application bug exposed by an end-to-end test."
---

# Writing Playwright Tests

Create tests from observed user behavior, not assumptions about markup. Explore the running application first when browser tools and a target URL are available.

## Locators

Prefer selectors in this order:

1. `getByRole` with an accessible name
2. `getByLabel` for form controls
3. `getByText` for stable user-visible content
4. `getByTestId` when the UI has no suitable semantic locator

Do not use CSS or XPath selectors for user-facing controls unless the application exposes no stable semantic alternative. Avoid implementation details such as generated classes, DOM ancestry, and list indexes.

Use locator chaining or filtering when several elements share a role. Resolve ambiguity by identifying the intended region or accessible name, not by selecting `.first()` without a user-visible reason.

## Synchronization And Assertions

- Use Playwright's auto-waiting actions and web-first assertions such as `toBeVisible`, `toHaveText`, `toHaveURL`, and `toBeEnabled`.
- Never add `waitForTimeout` or arbitrary sleeps. Wait for a user-visible condition, response, URL, or application state instead.
- Assert outcomes the user can observe. Avoid asserting internal state when the UI provides a meaningful result.
- Keep assertions specific enough to explain a failure without coupling them to incidental presentation.

## Isolation

- Each test must run independently and in any order.
- Create required state in the test or a fixture; do not depend on another test having run.
- Prefer Playwright fixtures for shared setup and page objects for repeated, meaningful user workflows.
- Do not extract a helper for a single short sequence. Add an abstraction only when it removes real repetition or gives a domain action a clear name.
- Keep credentials and secrets out of test files. Use the project's established environment or authentication fixture.

## Coverage

For each requested flow, consider:

- the primary successful path
- required-field and invalid-input behavior
- loading, empty, and error states that are reachable in scope
- permissions, responsive behavior, or keyboard interaction when relevant to the flow

Do not inflate coverage with duplicate assertions. Test distinct behavior and boundaries.

## Failures

When a test reveals unexpected application behavior:

1. Reproduce it in the browser.
2. Confirm the test follows the observed accessible structure and intended requirement.
3. Preserve the meaningful assertion.
4. Report the issue with preconditions, steps, expected behavior, actual behavior, and evidence.

Never weaken an assertion, add a retry, skip a test, or broaden a locator merely to turn a product failure green.

## Validation

Run the narrowest relevant command first, for example:

```sh
npx playwright test tests/checkout.spec.ts
```

Use the repository's configured command, projects, web server, and fixtures when they exist. Report the exact command and outcome.
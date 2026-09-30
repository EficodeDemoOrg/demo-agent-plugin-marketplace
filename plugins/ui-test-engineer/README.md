# UI Test Engineer

UI Test Engineer is a VS Code agent plugin for teams that want reliable Playwright UI tests based on the real behavior and accessible structure of a running web application. It combines a focused test engineer agent, Playwright guidance, browser exploration through Playwright MCP, and an audit log for test-file changes.

## Installation

Register this marketplace in VS Code settings:

```jsonc
"chat.plugins.marketplaces": [
  "your-org/your-marketplace"
]
```

Open the Extensions view, search for `@agentPlugins`, select **UI Test Engineer**, and install it. To install directly from source, run **Chat: Install Plugin From Source** from the Command Palette and provide this repository's Git URL.

The Playwright MCP server requires Node.js 18 or newer. The target project must install `@playwright/test` and the browser used by its Playwright configuration.

## Included Components

| Component | Purpose | When to use it |
| --- | --- | --- |
| [Test Engineer agent](com.github.copilot/agents/test-engineer.agent.md) | Explores a running application, writes tests only under `tests/`, runs focused Playwright commands, and reports product bugs. | Select **Test Engineer** for a UI flow that needs tests. |
| [writing-playwright-tests skill](skills/writing-playwright-tests/SKILL.md) | Provides locator, assertion, isolation, coverage, and failure-handling practices. | Writing, reviewing, or debugging Playwright UI tests. |
| [Playwright MCP configuration](mcp.json) | Starts the official `@playwright/mcp` server through `npx`. | Inspecting roles, labels, text, and behavior in a live browser. |
| [Test change hook](com.github.copilot/hooks/hooks.json) | Runs the bundled logger after successful tool calls and records test-file edits. | Auditing test files created or modified during agent work. |

## Quick Start

Start the application under test, select the **Test Engineer** agent, and provide its URL and the flow to cover. Example prompts:

```text
At http://localhost:3000, test a successful login and the invalid-password error.
```

```text
Add Playwright coverage for checkout address validation. Reuse the existing fixtures in tests/.
```

```text
Investigate why tests/profile.spec.ts fails against http://localhost:5173. Report an application bug if the UI violates the expected flow.
```

## Input Requirements

- A running application URL that the browser can reach.
- A user flow or behavior to cover.
- An existing Playwright setup with tests stored under `tests/`.
- Any required test credentials supplied through the project's established secret or environment mechanism.

The agent reads project files to discover existing commands, fixtures, page objects, and conventions. It does not create or change application source or project configuration.

## Generated Deliverables

- Playwright spec, fixture, or page-object changes under `tests/`.
- Focused test-run results with the exact command used.
- Bug reports with reproduction steps when application behavior is incorrect.
- `test-changes.log` in the target workspace, with one line per recognized test-file change:

```text
2026-09-30T12:00:00.000Z tests/login.spec.ts created
2026-09-30T12:04:12.000Z tests/login.spec.ts modified
```

The plugin-wide hook recognizes files in `test`, `tests`, `e2e`, or `spec` directories and JavaScript or TypeScript files ending in `.test.*` or `.spec.*`. Add `test-changes.log` to the target project's `.gitignore` when the audit trail should remain local.

## Recommended Workflow

1. Start the application and verify its URL is reachable.
2. Select the **Test Engineer** agent and describe one user flow.
3. Review the browser exploration and proposed coverage.
4. Let the agent create or update files under `tests/` and run the narrowest relevant Playwright command.
5. Review changed tests, `test-changes.log`, results, and any reported application bugs.
6. Run the project's broader test suite before merging when the focused tests pass.

## Repository Structure

```text
ui-test-engineer/
├── plugin.json
├── mcp.json
├── README.md
├── skills/
│   └── writing-playwright-tests/
│       └── SKILL.md
├── scripts/
│   └── log-test-change.mjs
└── com.github.copilot/
    ├── agents/
    │   └── test-engineer.agent.md
    └── hooks/
        └── hooks.json
```

## Maintaining The Plugin

- Keep the agent's tools and write boundaries narrow.
- Update the skill when team testing conventions change.
- Review Playwright MCP release notes before changing its package or arguments.
- Test the hook against current VS Code `PostToolUse` payloads when edit-tool schemas change.
- Bump the version in `plugin.json` for published changes.
- Run `npm run generate` from `website/` after changing plugin metadata, agents, skills, MCP configuration, or documentation.

## Security Notes

The Playwright MCP server and hook execute local processes with the user's permissions. Review them before installation. Keep secrets out of prompts, test files, logs, and MCP configuration, and use the target project's approved secret-management mechanism.
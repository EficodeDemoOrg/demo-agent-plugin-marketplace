# Agent Marketplace Template

A demo repository for building and maintaining a marketplace of AI-supporting assets, including Skills, Agents, Hooks etc for VS Code Copilot Chat.

Assets are packaged as [VS Code agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins) and made available through this marketplace repository.

## Using the Marketplace

1. Register this marketplace in your VS Code `settings.json`:

   ```jsonc
   "chat.plugins.marketplaces": [
       "your-org/your-marketplace"
   ]
   ```

2. Open the Extensions view (`⇧⌘X`) and search for `@agentPlugins`.
3. Pick a plugin from the list and select **Install**.

Once installed, a plugin's skills, agents, and other customizations appear
automatically in Copilot Chat. Access to this repository may require appropriate permissions.

> Tip: To try a plugin without adding the marketplace, run **Chat: Install
> Plugin From Source** from the Command Palette and paste the repository's URL.

## Available Plugins

| Plugin | Description | Skills |
| --- | --- | --- |
| (Add your plugins here) | | |

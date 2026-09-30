#!/usr/bin/env node

import { appendFileSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  try {
    logTestChanges(JSON.parse(input));
  } catch (error) {
    console.error(`Unable to log test file change: ${error.message}`);
    process.exitCode = 1;
  }
});

function logTestChanges(event) {
  const workspaceRoot = resolve(event.cwd || process.cwd());
  const changes = extractChanges(event.tool_input, event.tool_name);

  for (const [filePath, changeType] of changes) {
    const absolutePath = isAbsolute(filePath) ? resolve(filePath) : resolve(workspaceRoot, filePath);
    const workspacePath = relative(workspaceRoot, absolutePath);

    if (workspacePath.startsWith(`..${sep}`) || !isTestFile(workspacePath)) continue;

    const normalizedPath = workspacePath.split(sep).join('/');
    const timestamp = event.timestamp || new Date().toISOString();
    appendFileSync(resolve(workspaceRoot, 'test-changes.log'), `${timestamp} ${normalizedPath} ${changeType}\n`);
  }
}

function extractChanges(toolInput, toolName = '') {
  const changes = new Map();
  if (!toolInput || typeof toolInput !== 'object') return changes;

  for (const key of ['filePath', 'path', 'file_path']) {
    if (typeof toolInput[key] === 'string') {
      changes.set(toolInput[key], inferChangeType(toolInput, toolName));
    }
  }

  for (const value of Object.values(toolInput)) {
    if (typeof value !== 'string') continue;

    const patchPattern = /^\*\*\* (Add|Update) File: (.+)$/gm;
    for (const match of value.matchAll(patchPattern)) {
      changes.set(match[2].trim(), match[1] === 'Add' ? 'created' : 'modified');
    }
  }

  return changes;
}

function inferChangeType(toolInput, toolName) {
  const operation = `${toolName} ${toolInput.operation || toolInput.action || ''}`.toLowerCase();
  return operation.includes('create') || operation === 'add' ? 'created' : 'modified';
}

function isTestFile(filePath) {
  const normalizedPath = filePath.split(sep).join('/');
  const fileName = normalizedPath.split('/').at(-1) || '';
  const inTestDirectory = /(^|\/)(tests?|e2e|specs?)(\/|$)/i.test(normalizedPath);
  const hasTestSuffix = /\.(spec|test)\.[cm]?[jt]sx?$/i.test(fileName);
  return inTestDirectory || hasTestSuffix;
}
# Gemini API Testing Guide

This document provides instructions on how to run the Gemini API test files in this project.

## Available Test Files

This project contains several test files to verify Gemini API connectivity:

- `test-gemini.js` - JavaScript test using gemini-2.0-flash model
- `test-gemini-pro.js` - JavaScript test using gemini-pro model
- `test-gemini-simple.js` - Simplified JavaScript test using gemini-1.0-pro model
- `test-gemini.ts` - TypeScript version of the test
- `test-gemini.mjs` - JavaScript ES Modules version
- `test-gemini-commonjs.ts` - TypeScript version with CommonJS compatibility

## Running the Tests

### Method 1: Using JavaScript Files (Simplest)

JavaScript files can be run directly with Node.js after setting the environment variable for the API key:

```powershell
# Set the API key
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

# Run one of the JavaScript test files
node test-gemini.js
# OR
node test-gemini-pro.js
# OR
node test-gemini-simple.js
```

### Method 2: Using the MJS File (Modern JavaScript)

The `.mjs` extension explicitly tells Node.js to treat the file as an ES Module:

```powershell
# Set the API key
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

# Run the MJS file
node test-gemini.mjs
```

Or use the batch file:
```powershell
.\run-gemini-mjs.bat
```

### Method 3: Using TypeScript with CommonJS Configuration

Run TypeScript files using a separate tsconfig that's configured for CommonJS:

```powershell
# Set the API key
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

# Run with ts-node using the test config
npx ts-node -P tsconfig.test.json test-gemini-commonjs.ts
```

Or use the batch file:
```powershell
.\run-gemini-commonjs.bat
```

### Method 4: Using TSX (Modern TypeScript Runner)

TSX is a modern alternative to ts-node that better handles ESM/TypeScript integration:

```powershell
# Set the API key
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"

# Run with tsx
npx tsx test-gemini.ts
```

## Batch Files

For convenience, several batch files are provided:

- `run-gemini-test.bat` - Original batch file (runs TypeScript file with ts-node)
- `run-gemini-test-fixed.bat` - Modified batch file (runs TypeScript with ts-node-esm)
- `run-gemini-mjs.bat` - Runs the .mjs version
- `run-gemini-commonjs.bat` - Runs TypeScript with CommonJS configuration

## Troubleshooting

### Common Issues

1. **Unknown file extension ".ts" error**
   - This happens because the project is configured as an ES Module project (`"type": "module"` in package.json)
   - Solution: Use one of the methods above that handles ES Modules correctly

2. **API key not found**
   - Make sure you've set the environment variable correctly
   - The API key should be a valid Google Generative AI API key

3. **Model not available**
   - Different models have different availability. If one model fails, try another:
   - `test-gemini-simple.js` uses "gemini-1.0-pro"
   - `test-gemini-pro.js` uses "gemini-pro"
   - `test-gemini.js` uses "gemini-2.0-flash"

## Technical Context

### Why Different File Extensions and Approaches?

- `.js` - Standard JavaScript
- `.ts` - TypeScript that needs to be transpiled
- `.mjs` - JavaScript explicitly as ES Module
- CommonJS vs ESM - Different module systems with different import/export syntax

In an ESM project (like this one with `"type": "module"` in package.json), running TypeScript files directly with ts-node requires special configuration or flags because ts-node's default behavior doesn't align with ESM.

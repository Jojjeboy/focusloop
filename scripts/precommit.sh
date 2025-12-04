#!/bin/bash
# Bash script to run pre-commit checks
# This script ensures code quality before committing

echo ""
echo "🔍 Running Pre-Commit Checks..."
echo ""

# 1. Format Check
echo "📝 Checking code formatting..."
npm run format:check
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Formatting check failed!"
    echo "Run 'npm run format' to auto-format your code"
    exit 1
fi
echo "✅ Formatting check passed"
echo ""

# 2. Lint
echo "🔎 Running linter..."
npm run lint
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Linting failed!"
    echo "Fix the linting errors above"
    exit 1
fi
echo "✅ Linting passed"
echo ""

# 3. Tests
echo "🧪 Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Tests failed!"
    echo "Fix the failing tests above"
    exit 1
fi
echo "✅ Tests passed"
echo ""

# 4. Build
echo "🏗️  Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build failed!"
    echo "Fix the build errors above"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Success
echo "✨ All pre-commit checks passed! ✨"
echo "You can now commit your changes safely."
echo ""
exit 0

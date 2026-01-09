#!/bin/bash

# Test script for Pagefind integration
# This creates a minimal test site to verify the search functionality

set -e

echo "=== Pagefind Integration Test ==="
echo ""

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    echo "❌ Hugo is not installed. Please install Hugo first."
    echo "   Visit: https://gohugo.io/installation/"
    exit 1
fi

echo "✅ Hugo is installed: $(hugo version)"

# Create test directory
TEST_DIR="/tmp/harbor-pagefind-test"
rm -rf "$TEST_DIR"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "📁 Creating test site in $TEST_DIR"

# Initialize Hugo site
hugo new site . --force

# Create themes directory and link harbor theme
mkdir -p themes
ln -s /home/user/harbor themes/harbor

# Create config.toml
cat > config.toml << 'EOF'
theme = "harbor"
baseurl = "http://localhost:1313/"
title = "Harbor Pagefind Test"
languageCode = "en"

[outputs]
  section = ["JSON", "HTML"]

[[params.nav]]
  identifier = "search"
  name = "Search"
  icon = "fas fa-search fa-lg"
  url = "search"
  weight = 3
EOF

echo "✅ Created config.toml"

# Create search page
mkdir -p content
cat > content/search.md << 'EOF'
---
title: "Search"
layout: "search"
---
EOF

echo "✅ Created search page"

# Create sample posts
hugo new posts/hello-world.md
cat >> content/posts/hello-world.md << 'EOF'

Welcome to my blog! This is a test post about Hugo themes and Pagefind search functionality.

## Features

- Static site generation
- Fast search
- Beautiful design

This content should be searchable using keywords like "Hugo", "Pagefind", "search", and "blog".
EOF

hugo new posts/second-post.md
cat >> content/posts/second-post.md << 'EOF'

This is another blog post to test the search functionality with multiple documents.

We can search for various terms like "documentation", "testing", and "integration".
EOF

hugo new posts/third-post.md
cat >> content/posts/third-post.md << 'EOF'

A third post about web development, JavaScript, and modern frameworks.

Topics include React, Vue, Hugo static sites, and more interesting content.
EOF

echo "✅ Created 3 sample posts"

# Build the Hugo site
echo ""
echo "🔨 Building Hugo site..."
hugo --quiet

if [ ! -d "public" ]; then
    echo "❌ Hugo build failed - public directory not created"
    exit 1
fi

echo "✅ Hugo build successful"

# Check if pagefind is available
if ! command -v pagefind &> /dev/null; then
    echo ""
    echo "⚠️  Pagefind is not installed globally"
    echo "   Attempting to use npx pagefind..."
    PAGEFIND_CMD="npx -y pagefind"
else
    PAGEFIND_CMD="pagefind"
    echo "✅ Pagefind is installed"
fi

# Generate Pagefind index
echo ""
echo "📑 Generating Pagefind search index..."

# Check if site appears to be Japanese (basic heuristic)
if grep -r '[ぁ-ん]' content/ 2>/dev/null | head -1 > /dev/null; then
    echo "   Detected Japanese content, using --force-language ja"
    $PAGEFIND_CMD --source public --force-language ja
else
    $PAGEFIND_CMD --source public
fi

if [ ! -d "public/_pagefind" ]; then
    echo "❌ Pagefind index generation failed"
    exit 1
fi

echo "✅ Pagefind index generated successfully"
echo ""
echo "📊 Pagefind index stats:"
ls -lh public/_pagefind/ | head -10

echo ""
echo "================================================"
echo "✅ Test site setup complete!"
echo "================================================"
echo ""
echo "To test the search functionality:"
echo ""
echo "1. Start the Hugo server:"
echo "   cd $TEST_DIR"
echo "   hugo server -D"
echo ""
echo "2. Open your browser to:"
echo "   http://localhost:1313/search"
echo ""
echo "3. Try searching for keywords like:"
echo "   - Hugo"
echo "   - Pagefind"
echo "   - JavaScript"
echo "   - blog"
echo ""
echo "4. Check browser console (F12) for any errors"
echo ""
echo "================================================"

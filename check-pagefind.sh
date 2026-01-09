#!/bin/bash

# Pagefind Index Verification Script
# This script checks if Pagefind index is generated correctly

set -e

echo "=== Pagefind Index Verification ==="
echo ""

# Check if we're in a Hugo site
if [ ! -f "config.toml" ] && [ ! -f "config.yaml" ] && [ ! -f "hugo.toml" ]; then
    echo "❌ Not in a Hugo site directory. Please cd to your Hugo site first."
    exit 1
fi

echo "✅ Found Hugo configuration"

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ No 'public' directory found. Please run 'hugo' to build your site first."
    exit 1
fi

echo "✅ Found public directory"

# Check if _pagefind directory exists
if [ ! -d "public/_pagefind" ]; then
    echo "❌ No '_pagefind' directory found in public/"
    echo ""
    echo "To generate the Pagefind index, run:"
    echo "  npx -y pagefind --source public"
    echo ""
    exit 1
fi

echo "✅ Found _pagefind directory"

# Check for required Pagefind files
echo ""
echo "Checking Pagefind files..."

required_files=(
    "public/_pagefind/pagefind.js"
    "public/_pagefind/pagefind-ui.js"
    "public/_pagefind/pagefind-ui.css"
)

missing_files=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo "  ✅ $file ($size)"
    else
        echo "  ❌ Missing: $file"
        missing_files=$((missing_files + 1))
    fi
done

if [ $missing_files -gt 0 ]; then
    echo ""
    echo "❌ Some required files are missing. Regenerate the index:"
    echo "  npx -y pagefind --source public"
    exit 1
fi

# Check for index data
if [ -d "public/_pagefind/index" ]; then
    index_files=$(find public/_pagefind/index -type f | wc -l)
    echo "  ✅ Found index directory with $index_files files"
else
    echo "  ⚠️  No index directory found"
fi

# Count indexed pages
if [ -f "public/_pagefind/pagefind.js" ]; then
    echo ""
    echo "Index statistics:"
    # Try to extract some info from the index
    fragment_count=$(find public/_pagefind -name "*.pf_fragment" 2>/dev/null | wc -l)
    meta_count=$(find public/_pagefind -name "*.pf_meta" 2>/dev/null | wc -l)
    echo "  Fragment files: $fragment_count"
    echo "  Meta files: $meta_count"
fi

# Check search page
if [ -f "public/search/index.html" ]; then
    echo ""
    echo "✅ Search page exists at public/search/index.html"

    # Check if it contains the search container
    if grep -q "searchContainer" public/search/index.html; then
        echo "✅ Search container div found in HTML"
    else
        echo "⚠️  Search container div NOT found in HTML"
    fi

    # Check if pagefind scripts are referenced
    if grep -q "_pagefind/pagefind-ui.js" public/search/index.html; then
        echo "✅ Pagefind UI script reference found"
    else
        echo "⚠️  Pagefind UI script reference NOT found"
    fi
else
    echo ""
    echo "❌ No search page found at public/search/index.html"
    echo "   Make sure you created content/search.md with layout: search"
fi

echo ""
echo "=== Testing Pagefind Manually ==="
echo ""
echo "To test if Pagefind can search your content:"
echo ""
echo "1. Start Hugo server:"
echo "   hugo server -D"
echo ""
echo "2. Open browser to: http://localhost:1313/search"
echo ""
echo "3. Open browser console (F12) and check for:"
echo "   - 'Pagefind UI initialized successfully' message"
echo "   - Any errors (red text)"
echo ""
echo "4. Try a simple test search in console:"
echo "   fetch('/_pagefind/pagefind.js').then(r => console.log('Pagefind JS loaded:', r.ok))"
echo ""
echo "5. Type in the search box and watch the Network tab for requests to _pagefind/"
echo ""

# If Hugo server is running, try to test the endpoint
if command -v curl &> /dev/null; then
    echo "=== Quick HTTP Test ==="
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/_pagefind/pagefind.js 2>/dev/null | grep -q "200"; then
        echo "✅ Pagefind JS is accessible at http://localhost:1313/_pagefind/pagefind.js"
    else
        echo "⚠️  Hugo server might not be running or Pagefind files not accessible"
        echo "   Start with: hugo server -D"
    fi
fi

echo ""
echo "=== Summary ==="
if [ $missing_files -eq 0 ]; then
    echo "✅ Pagefind index appears to be generated correctly"
    echo ""
    echo "If search still doesn't work, check browser console for JavaScript errors."
else
    echo "❌ Pagefind index is incomplete or missing"
    echo ""
    echo "Run this to regenerate:"
    echo "  hugo && npx -y pagefind --source public"
fi

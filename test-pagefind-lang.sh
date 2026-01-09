#!/bin/bash

# Debug script to check language detection

echo "=== Pagefind Language Detection Debug ==="
echo ""

if [ ! -d "public" ]; then
    echo "❌ No public directory. Run 'hugo' first."
    exit 1
fi

# Check HTML files for lang attribute
echo "1. Checking HTML files for lang attribute:"
if [ -f "public/index.html" ]; then
    lang=$(grep -o 'lang="[^"]*"' public/index.html | head -1)
    echo "   Found in public/index.html: $lang"
else
    echo "   ❌ No public/index.html found"
fi

# Check Hugo config
echo ""
echo "2. Checking Hugo configuration:"
if [ -f "config.toml" ]; then
    echo "   Found config.toml"
    grep -i "languagecode\|defaultcontentlanguage" config.toml || echo "   No language settings found"
elif [ -f "hugo.toml" ]; then
    echo "   Found hugo.toml"
    grep -i "languagecode\|defaultcontentlanguage" hugo.toml || echo "   No language settings found"
else
    echo "   ⚠️  No config file found"
fi

# Test pagefind command
echo ""
echo "3. Testing pagefind command with verbose output:"
echo "   Running: npx pagefind --source public --force-language ja"
echo ""

npx -y pagefind --source public --force-language ja

echo ""
echo "4. Checking generated WASM file:"
if [ -f "public/_pagefind/wasm.ja.pagefind" ]; then
    echo "   ✅ Found wasm.ja.pagefind"
elif [ -f "public/_pagefind/wasm.unknown.pagefind" ]; then
    echo "   ❌ Still wasm.unknown.pagefind - language flag not working!"
    echo ""
    echo "   Pagefind version:"
    npx pagefind --version
else
    echo "   ❌ No WASM files found"
fi

echo ""
echo "5. All WASM files:"
ls -la public/_pagefind/wasm* 2>/dev/null || echo "   No WASM files"

echo ""
echo "6. Checking pagefind-entry.json:"
if [ -f "public/_pagefind/pagefind-entry.json" ]; then
    echo "   Content:"
    cat public/_pagefind/pagefind-entry.json | python3 -m json.tool 2>/dev/null || cat public/_pagefind/pagefind-entry.json
fi

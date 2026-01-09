#!/bin/bash

# Check if Pagefind WASM files exist for CJK language support

echo "=== Pagefind WASM/CJK Language Check ==="
echo ""

if [ ! -d "public/_pagefind" ]; then
    echo "❌ No _pagefind directory found. Run: npx pagefind --source public"
    exit 1
fi

echo "Checking for WASM files (required for Japanese/Chinese/Korean):"
echo ""

# Check for WASM files
wasm_files=$(find public/_pagefind -name "*.wasm" -o -name "wasm.*" 2>/dev/null)

if [ -z "$wasm_files" ]; then
    echo "⚠️  No WASM files found in public/_pagefind/"
    echo ""
    echo "This is required for Japanese (CJK) language support."
    echo ""
    echo "Try regenerating with explicit language flag:"
    echo "  npx pagefind --source public --force-language ja"
    echo ""
else
    echo "✅ Found WASM files:"
    echo "$wasm_files" | while read file; do
        size=$(du -h "$file" 2>/dev/null | cut -f1)
        echo "  - $file ($size)"
    done
fi

echo ""
echo "Checking language-specific files:"

# Check for language-specific index files
ja_files=$(find public/_pagefind -name "*ja*" -o -name "*jp*" 2>/dev/null | head -10)
if [ ! -z "$ja_files" ]; then
    echo "✅ Found Japanese language files:"
    echo "$ja_files" | head -5 | while read file; do
        echo "  - $(basename $file)"
    done
else
    echo "⚠️  No Japanese-specific index files found"
fi

echo ""
echo "All files in _pagefind directory:"
find public/_pagefind -type f 2>/dev/null | head -20 | while read file; do
    size=$(du -h "$file" 2>/dev/null | cut -f1)
    echo "  $(basename $file) - $size"
done

echo ""
echo "=== Recommendations ==="
echo ""
echo "If WASM files are missing, try:"
echo "  1. Update Pagefind: npm install -g pagefind@latest"
echo "  2. Regenerate with language flag: npx pagefind --source public --force-language ja"
echo "  3. Check Hugo config has correct languageCode: 'ja' or 'ja-jp'"
echo ""
echo "Then check browser console for WASM loading errors."

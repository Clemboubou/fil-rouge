#!/usr/bin/env python3
"""
Script pour appliquer automatiquement les classes dark: à tous les fichiers Vue
"""

import re
import os
from pathlib import Path

# Mapping des classes Tailwind vers leurs équivalents dark
DARK_CLASS_MAPPINGS = {
    r'bg-white(\s|")': r'bg-white dark:bg-gray-800\1',
    r'bg-gray-50(\s|")': r'bg-gray-50 dark:bg-gray-900\1',
    r'bg-gray-100(\s|")': r'bg-gray-100 dark:bg-gray-800\1',
    r'text-gray-900(\s|")': r'text-gray-900 dark:text-white\1',
    r'text-gray-800(\s|")': r'text-gray-800 dark:text-gray-200\1',
    r'text-gray-700(\s|")': r'text-gray-700 dark:text-gray-300\1',
    r'text-gray-600(\s|")': r'text-gray-600 dark:text-gray-400\1',
    r'text-gray-500(\s|")': r'text-gray-500 dark:text-gray-400\1',
    r'text-gray-400(\s|")': r'text-gray-400 dark:text-gray-500\1',
    r'border-gray-200(\s|")': r'border-gray-200 dark:border-gray-700\1',
    r'border-gray-300(\s|")': r'border-gray-300 dark:border-gray-600\1',
    r'border-gray-400(\s|")': r'border-gray-400 dark:border-gray-600\1',
    r'bg-primary-100(\s|")': r'bg-primary-100 dark:bg-primary-900\1',
    r'bg-green-100(\s|")': r'bg-green-100 dark:bg-green-900\1',
    r'bg-blue-100(\s|")': r'bg-blue-100 dark:bg-blue-900\1',
    r'bg-purple-100(\s|")': r'bg-purple-100 dark:bg-purple-900\1',
    r'bg-yellow-100(\s|")': r'bg-yellow-100 dark:bg-yellow-900\1',
    r'bg-red-100(\s|")': r'bg-red-100 dark:bg-red-900\1',
    r'text-primary-600(\s|")': r'text-primary-600 dark:text-primary-400\1',
    r'text-green-600(\s|")': r'text-green-600 dark:text-green-400\1',
    r'text-blue-600(\s|")': r'text-blue-600 dark:text-blue-400\1',
    r'text-purple-600(\s|")': r'text-purple-600 dark:text-purple-400\1',
    r'text-red-600(\s|")': r'text-red-600 dark:text-red-400\1',
    r'text-yellow-600(\s|")': r'text-yellow-600 dark:text-yellow-500\1',
    r'hover:bg-gray-50(\s|")': r'hover:bg-gray-50 dark:hover:bg-gray-700\1',
    r'hover:bg-gray-100(\s|")': r'hover:bg-gray-100 dark:hover:bg-gray-700\1',
}

def apply_dark_classes(content):
    """Apply dark mode classes to the content"""
    # Skip if already has dark: classes
    if 'dark:' in content:
        return content, False

    modified = content
    changed = False

    for pattern, replacement in DARK_CLASS_MAPPINGS.items():
        new_content = re.sub(pattern, replacement, modified)
        if new_content != modified:
            modified = new_content
            changed = True

    return modified, changed

def process_file(file_path):
    """Process a single Vue file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        modified, changed = apply_dark_classes(content)

        if changed:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(modified)
            print(f"[OK] Updated: {file_path}")
            return True
        else:
            print(f"[SKIP] Already has dark classes: {file_path}")
            return False
    except Exception as e:
        print(f"[ERROR] Error processing {file_path}: {e}")
        return False

def main():
    # Directories to process
    frontend_dir = Path("C:/Users/Cleme/Desktop/fil rouge/frontend/src")

    views_dir = frontend_dir / "views"
    components_dir = frontend_dir / "components"

    updated_files = []

    # Process all Vue files in views and components
    for directory in [views_dir, components_dir]:
        if not directory.exists():
            continue

        for vue_file in directory.rglob("*.vue"):
            if process_file(vue_file):
                updated_files.append(str(vue_file))

    print(f"\n{'='*60}")
    print(f"Summary: Updated {len(updated_files)} files")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()

#!/bin/bash

CHANGED=$(git diff-index --name-only HEAD --)

if [ -n "$CHANGED" ]; then
    echo "WARNING: THERE ARE UNCOMITTED CHANGES INCLUDED IN THIS PUBLISH OPERATION";
    exit;
fi

echo "Preparing release..."
VERSION=$(npm version patch)
git add package.json
git commit -m "Publising $VERSION";
git tag -1 $VERSION
git push --tags
npm publish

#!/bin/bash

git diff - index--quiet HEAD-- || echo "WARNING: THERE ARE UNCOMITTED CHANGES INCLUDED IN THIS PUBLISH OPERATION"; exit;

echo "Preparing the release..."
npm version patch
git add package.json
git commit - m "Publising new version";
git push
npm run publish

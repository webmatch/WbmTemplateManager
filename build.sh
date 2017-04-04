#!/usr/bin/env bash

commit=$1
if [ -z ${commit} ]; then
    commit=$(git tag | tail -n 1)
    if [ -z ${commit} ]; then
        commit="master";
    fi
fi

# Remove old release
rm -rf WbmTemplateManager WbmTemplateManager-*.zip

# Build new release
mkdir -p WbmTemplateManager
git archive ${commit} | tar -x -C WbmTemplateManager
composer install --no-dev -n -o -d WbmTemplateManager
zip -r WbmTemplateManager-${commit}.zip WbmTemplateManager
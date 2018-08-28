#!/usr/bin/env bash
set -eu

if [[ "${TRAVIS:-}" = 'true' ]]; then
  message="Update by Travis CI cron job (build #${TRAVIS_BUILD_NUMBER})"
else
  message='Update by script'
fi

if git diff --quiet "$@"; then
  echo 'Files are not changed. Do nothing.'
else
  git config --global url.git@github.com:.pushinsteadof https://github.com/
  git add "$@"
  git commit -m "$message"
  git push origin master
fi

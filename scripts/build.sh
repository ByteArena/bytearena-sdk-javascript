#!/usr/bin/env bash
set -e

ROOT_DIR=$(cd $(dirname $0)/..; pwd)
cd $ROOT_DIR

PACKAGE="$1"

for D in ./packages/*; do
  if [ ! -d "${D}/src" ]; then
    continue
  fi

  if [ -n "$PACKAGE" ] && [ `basename $D` != "$PACKAGE" ]; then
    continue
  fi

  echo "Building $D..."

  # Clean
  rm -rf "${D}/lib"

  # Build
  ./node_modules/.bin/babel "${D}/src" \
    --out-dir "${D}/lib" \
    --quiet

  # Generate documentation
  ./node_modules/.bin/jsdoc2md "${D}/src/*" > "${D}/README.md"
done

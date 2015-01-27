#!/bin/bash

if [[ `pwd` == *meteor ]] ; then cd .. ; fi
ln -s meteor/package.js package.js 2>/dev/null
meteor publish
rm -f .versions versions.json package.js


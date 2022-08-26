#!/bin/sh

rm -f chrome-lock-tab.zip
zip chrome-lock-tab.zip manifest.json src/* lib/* images/* -x "*.map"

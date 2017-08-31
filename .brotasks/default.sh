#!/bin/sh

project=$(basename `pwd`)

init () {
  bro env
}

env () {
  nvm use v5.6.0
}

$@

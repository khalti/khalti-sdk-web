#!/bin/sh

project=$(basename `pwd`)

init () {
  bro env
}

env () {
  nvm use v5.10.0
}

prod_env () {
  export WIDGET_URL=https://khalti.com/payment/widget/
}

$@

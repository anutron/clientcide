#!/bin/bash

bin=`dirname $0`
bin=`cd $bin && pwd`

# Down here, instead of using the cwd, use $bin
# e.g.,:

ruby $bin/build.rb CCS.Desktop CCS.Login Fx.Reveal CCS.DropDown CCS.CH.Wizard Fx.Transitions CCS.UserManager

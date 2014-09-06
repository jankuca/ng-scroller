<<<<<<< HEAD
**ng-scroller**

Performant infinite scrolling AngularJS directive with UITableView-like element reusal

http://ngscroller.herokuapp.com
=======
# Google Closure Boilerplate

This boilerplate should be able to work as the base of any *Google Closure*-based application.

The idea is that you clone this repository, modify the build settings and start working on your app.

<del>Read [this blog post](http://blog.jankuca.com/post/18726341670/google-closure-dev-environment) to learn more about the resulting environment.</del> <ins>The current stack is a bit different.</ins>

## What's included

- a basic directory structure
- package manager support: [npm](http://npmjs.org), [Twitter Bower](http://twitter.github.com/bower)
- JavaScript compiler support: [Google Closure Compiler](https://developers.google.com/closure/compiler)
- Templating support: [Google Closure Templates](https://developers.google.com/closure/templates/)
- JavaScript linter support: [Google Closure Linter](https://developers.google.com/closure/utilities)
- CSS compiler support: [rework](https://github.com/visionmedia/rework)
- automation task support: [grunt.js](http://gruntjs.org)
- a [source map](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) fixing script that fixes wrong file paths
- an HTML file compiler script that extracts JavaScript references (awesome for [AngularJS](http://angularjs.org)) for instance)
- a [Sublime Text](http://sublimetext.com) project file

## Dependencies

- **unix**-based OS (Mac OS X, linux) or unix-like environment ([cygwin](http://www.cygwin.com))
- **[node.js](http://nodejs.org)**
- **[Twitter Bower](http://twitter.github.com/bower)**: Install as `npm install -g bower`
- [Google Closure Linter](http://developers.google.com/closure/utilities) – optional, used only by the `lint.sh` script to check syntax

## Installation

> Do not fork this repository to use it. Fork only if you want to contribute. Thanks.

    git clone -o boilerplate git://github.com/jankuca/closure-boilerplate.git project-name
    cd project-name

    ./build/install.sh

Then, you have two options:

1. You can reset the repository by running `rm -rf .git && git init`.
2. You can keep the history and the remote to be able to merge future boilerplate commits to your application. The `make.sh` script makes sure the `boilerplate` remote points to this repository. When there are new commits to the boilerplate, you can merge them to your app by running

```
git fetch boilerplate
git merge boilerplate/master --no-ff -m 'update closure-boilerplate'
```

## Usage

You will probably need to have a Terminal window open at all times (which is the way you should work anyway).

You can either take advantage of the prepared grunt.js tasks or run the scripts manually:

    # Run these commands in the project root directory

    # == Build the whole app ==
    grunt

    # == Compile CSS ==
    grunt css
    # (or)
    ./build/rework.js

    # == Generate a deps file + compile JavaScript ==
    grunt js
    # (or)
    ./build/deps.sh
    ./build/compile.sh

    # == Lint JavaScript ==
    grunt lint
    # (or)
    ./build/lint.sh

    # == Compile templates ==
    grunt soy
    # (or)
    ./build/soy.sh

>>>>>>> boiler/master

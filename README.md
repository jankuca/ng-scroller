# Google Closure Boilerplate

This boilerplate should be able to work as the base of any *Google Closure*-based application.

The idea is that you clone this repository, modify the build settings and start working on your app.

Read [this blog post](http://blog.jankuca.com/post/18726341670/google-closure-dev-environment) to learn more about the resulting environment.

## What's included

- a basic directory structure
- a lint script
- a compile script
- a source map fixing script that fixes wrong file paths
- an HTML file compile script that extracts JavaScript references
- a Sublime Text project file

## Dependencies

- [node.js](http://nodejs.org)
- [Google Closure Linter](http://developers.google.com/closure/utilities) – optional, used only by the `lint.sh` script to check syntax

## Installation

> Do not fork this repository to use it. Fork only if you want to contribute. Thanks.

    git clone git://github.com/jankuca/closure-boilerplate project-name
    cd project-name
    ./make.sh

The `make.sh` bash script will *fetch dependencies* (*Google Closure Library*, *Google Closure Compiler* and *Google Closure Templates*).

Then, you have two options:

1. You can reset the repository by running `rm -rf .git && git init`.
2. You can keep the history and the remote to be able to merge  future boilerplate commits to your application. The `make.sh` script makes sure the `boilerplate` remote points to this repository. When there are new commits to the boilerplate, you can merge them to your app by running

```
git fetch boilerplate
git merge boilerplate/master --no-ff -m 'update closure-boilerplate'
```

## Configuration

The default configuration might not fit your needs. It is likely that you will want to modify the paths in the compile scripts.

The scripts you want to modify are `build/lint.sh` and `build/compile.sh`. It is not recommended you modify other scripts.

## Usage

The preferred way to run the scripts is from Sublime Text via the `Cmd+B` keyboard shortcut.

You can also run the script manually:

    # Run these commands in the project root directory

    # Lint
    ./build/lint.sh

    # Compile templates
    ./build/soy.sh

    # Compile
    ./build/compile.sh

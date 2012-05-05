
# Closure-Boilerplate Build Configuration
# --
# @author Jan Kuča <jan@jankuca.com>



# The root project directory
# All the following paths are relative to this directory
PROJECT_DIR=`cd $PROJECT_DIR_RELATIVE ; pwd`

# The directory in which is this script placed
BUILD_DIR=$PROJECT_DIR/build

# The public-facing directory (sometimes called the document root)
PUBLIC_DIR=$PROJECT_DIR/public

# The compile script output directory path
TARGET_DIR=$PUBLIC_DIR/build

# The compile script output file name
# Relative to $TARGET_DIR
TARGET_FILE=app.min.js

# The source map file name
# Relative to $TARGET_DIR
SOURCE_MAP_FILE=source-map.json

# The dependency file path
DEPS_FILE=$TARGET_DIR/deps.js

# The file (created by the script) including JS references from HTML files
HTML_JS_FILE=$PUBLIC_DIR/app/js/html-references.temp.js

# The closure-library directory path
CLOSURE_LIBRARY_DIR=$PUBLIC_DIR/lib/closure-library

# The Google Closure Compiler jar file path
CLOSURE_COMPILER_PATH=$BUILD_DIR/closure-compiler/compiler.jar

# The Google Closure Linter executable path
CLOSURE_LINTER_PATH=/usr/local/bin/gjslint

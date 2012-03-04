
# Closure-boilerplate Lint Script
# --
# @autor Jan Kuča



# The $1 argument is the project root path (defaults to ".")
# Note: The provided Sublime Text build command automatically passes
#   the $project_path variable to this script.
PROJECT_DIR_RELATIVE=$1
[ -z $1 ] && PROJECT_DIR_RELATIVE="."


# The Google Closure Linter executable path
CLOSURE_LINTER_PATH="/usr/local/bin/gjslint"

# The root project directory
# All the following paths are relative to this directory
PROJECT_DIR=`cd $PROJECT_DIR_RELATIVE ; pwd`

# The public-facing directory (sometimes called the document root)
PUBLIC_DIR=$PROJECT_DIR/public



$CLOSURE_LINTER_PATH                                                          \
  $PUBLIC_DIR/app/js/*.js                                                     \
                                                                              \
| grep -v 'E:0001:'                                                           \
| grep -v 'Found'                                                             \
| grep -v 'fixjsstyle'                                                        \
| grep -v 'auto-fixable'                                                      \
| grep -v 'run by executing'                                                  \

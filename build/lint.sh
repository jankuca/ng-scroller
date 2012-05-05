
# Closure-boilerplate Lint Script
# --
# @author Jan Kuča <jan@jankuca.com>



# The $1 argument is the project root path (defaults to ".")
# Note: The provided Sublime Text build command automatically passes
#   the $project_path variable to this script.
PROJECT_DIR_RELATIVE=$1
[ -z $1 ] && PROJECT_DIR_RELATIVE="."

source $PROJECT_DIR_RELATIVE/build/vars.sh



# Run Google Closure Linter
$CLOSURE_LINTER_PATH                                                          \
  $PUBLIC_DIR/app/js/*.js                                                     \
                                                                              \
| grep -v 'E:0001:'                                                           \
| grep -v 'Found'                                                             \
| grep -v 'fixjsstyle'                                                        \
| grep -v 'auto-fixable'                                                      \
| grep -v 'run by executing'                                                  \

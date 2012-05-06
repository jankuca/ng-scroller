
# Closure-Boilerplate Build Script
# --
# @author Jan Kuča <jan@jankuca.com>



# The $1 argument is the project root path (defaults to ".")
# Note: The provided Sublime Text build command automatically passes
#   the $project_path variable to this script.
PROJECT_DIR_RELATIVE=$1
[ -z $1 ] && PROJECT_DIR_RELATIVE="."

source $PROJECT_DIR_RELATIVE/build/vars.sh

source $BUILD_DIR/soy.sh
echo ""
cd $PROJECT_DIR
source $BUILD_DIR/compile.sh
echo ""
cd $PROJECT_DIR
source $BUILD_DIR/deps.sh


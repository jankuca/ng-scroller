
# Closure-Boilerplate Template Compile Script
# --
# @author Jan Kuča <jan@jankuca.com>



# The $1 argument is the project root path (defaults to ".")
# Note: The provided Sublime Text build command automatically passes
#   the $project_path variable to this script.
PROJECT_DIR_RELATIVE=$1
[ -z $1 ] && PROJECT_DIR_RELATIVE="."

source $PROJECT_DIR_RELATIVE/build/vars.sh



TEMPLATE_SOY_TEMP_DIR=$TEMPLATE_SOY_DIR/.temp


# Store the current directory path
CURRENT_DIR=`pwd`
# Change to the soy template directory
cd $TEMPLATE_SOY_DIR || exit 1
echo "Working with *.soy files in $TEMPLATE_SOY_DIR"


# Create an empty temporary directory
mkdir -p $TEMPLATE_SOY_TEMP_DIR || exit
# Change to the new temporary directory
cd $TEMPLATE_SOY_TEMP_DIR


# Fix the soy templates
# This uses the provided plugins.
echo "-- Fix soy files"
node $BUILD_DIR/fix-soy.js                                                         \
  --root=$TEMPLATE_SOY_DIR                                                    \
  --exclude=$TEMPLATE_SOY_TEMP_DIR                                            \
  --target=$TEMPLATE_SOY_TEMP_DIR                                             \
  --plugin=$BUILD_DIR/soy-plugins/bind.js                                     \
> $HTML_JS_FILE                                                               \
|| exit 1
echo -e "\n"


# Compile the fixed soy files
echo -n "-- Convert soy files to JavaScript files: "
java -jar $SOY2JS_COMPILER_PATH                                               \
  --outputPathFormat                                                          \
  "$TEMPLATE_JS_DIR/{INPUT_DIRECTORY}/{INPUT_FILE_NAME_NO_EXT}.js"            \
  --codeStyle "concat"                                                        \
  --shouldProvideRequireSoyNamespaces                                         \
  --shouldGenerateJsdoc                                                       \
  *                                                                           \
|| exit 1
echo -e "ok\n"


# Remove the temporary directory
echo "-- Remove temporary files";
echo -n "$TEMPLATE_SOY_TEMP_DIR: "
rm -rf $TEMPLATE_SOY_TEMP_DIR && echo "ok"


# Change back to the original directory
cd $CURRENT_DIR

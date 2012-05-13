
# Closure-Boilerplate Compile Script
# --
# @author Jan Kuča <jan@jankuca.com>



# The $1 argument is the project root path (defaults to ".")
# Note: The provided Sublime Text build command automatically passes
#   the $project_path variable to this script.
PROJECT_DIR_RELATIVE=$1
[ -z $1 ] && PROJECT_DIR_RELATIVE="."

source $PROJECT_DIR_RELATIVE/build/vars.sh



# Make sure the target directory exists
echo "-- Make sure the target directory exists"
echo $TARGET_DIR
mkdir -p $TARGET_DIR
echo ""

# Extract JavaScript global references from HTML files into a temporary JS file
echo "-- Extract JavaScript references from HTML files"
echo $HTML_JS_FILE
node $BUILD_DIR/compile-html.js                                                    \
  --root=$PUBLIC_DIR                                                          \
  --exclude=$PUBLIC_DIR/lib                                                   \
  --extension="html"                                                          \
  --extension="soy"                                                           \
  --attribute="ng:controller"                                                 \
  --namespace="app.htmlReferences"                                            \
> $HTML_JS_FILE                                                               \
|| exit 1
echo -e "\n"

# Note: The output file has to be inside one of the roots below.


# Compile the JavaScript and generate a source map
echo "-- Compile the JavaScript and generate a source map"
echo $TARGET_DIR/$TARGET_FILE
$CLOSURE_LIBRARY_DIR/closure/bin/build/closurebuilder.py                      \
  --root="$PUBLIC_DIR/lib"                                                    \
  --root="$PUBLIC_DIR/app"                                                    \
  --namespace="app.main"                                                      \
  --namespace="app.htmlReferences"                                            \
  --output_mode="compiled"                                                    \
  --compiler_jar="$CLOSURE_COMPILER_PATH"                                     \
  --compiler_flags="--compilation_level=ADVANCED_OPTIMIZATIONS"               \
  --compiler_flags="--warning_level=VERBOSE"                                  \
  --compiler_flags="--language_in=ECMASCRIPT5_STRICT"                         \
  --compiler_flags="--create_source_map=$TARGET_DIR/$SOURCE_MAP_FILE"         \
  --compiler_flags="--output_wrapper=(function(){%output%}.call(this));       \
    //@ sourceMappingURL=$SOURCE_MAP_FILE"                                    \
> $TARGET_DIR/$TARGET_FILE                                                    \
|| exit 1
echo

# Note: The sourceMappingURL is relative to the compilation output directory


# Fix file paths in the generated source map
echo "-- Fix file paths in the generated source map"
node $BUILD_DIR/fix-source-map.js                                                  \
  --root=$PUBLIC_DIR                                                          \
  --map=$TARGET_DIR/$SOURCE_MAP_FILE                                          \
|| exit 1
echo


# Remove temporary files
echo "Remove temporary files"
echo -n "$HTML_JS_FILE: "
rm $HTML_JS_FILE && echo "ok"
echo ""


echo "== Successfully compiled =="

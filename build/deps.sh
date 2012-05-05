
# Closure-Boilerplate Dependency-Writer Script
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
echo -n "$TARGET_DIR: "
mkdir -p $TARGET_DIR && echo "ok"
echo ""


echo "-- Create the dependency information file"
echo $DEPS_FILE
$CLOSURE_LIBRARY_DIR/closure/bin/build/depswriter.py                          \
  --root_with_prefix="public/app ../../../app"                                \
> $DEPS_FILE                                                                  \
|| exit 1
echo ""


echo "== Successfully created =="

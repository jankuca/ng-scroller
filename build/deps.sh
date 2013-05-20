
# Closure-Boilerplate Dependency-Writer Script
# --
# @author Jan Kuča <jan@jankuca.com>



source ./build/vars.sh



# Make sure the target directory exists
echo "-- Make sure the target directory exists"
echo -n "$TARGET_DIR: "
mkdir -p $TARGET_DIR && echo "ok"
echo ""


echo "-- Create the dependency information file"
echo $DEPS_FILE
$CLOSURE_LIBRARY_DIR/closure/bin/build/depswriter.py                          \
  --root_with_prefix="public/app ../../../../app"                             \
  --root_with_prefix="public/lib ../../../../lib"                             \
> $DEPS_FILE                                                                  \
|| exit 1
echo ""


echo "== Successfully created =="

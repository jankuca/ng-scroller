
# Closure-boilerplate Lint Script
# --
# @author Jan Kuča <jan@jankuca.com>



source ./build/vars.sh



# Run Google Closure Linter
$CLOSURE_LINTER_PATH                                                          \
  $PUBLIC_DIR/app/js/*.js                                                     \
                                                                              \
| grep -v 'E:0001:'                                                           \
| grep -v 'Found'                                                             \
| grep -v 'fixjsstyle'                                                        \
| grep -v 'auto-fixable'                                                      \
| grep -v 'run by executing'                                                  \

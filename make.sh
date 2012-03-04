
# Closure-boilerplate Installation Script
# --
# @autor Jan Kuča



# Boilerplate git remote name
GIT_REMOTE_NAME=boilerplate

# The project root directory path
PROJECT_DIR=`pwd`

# The public-facing directory (sometimes called the document root)
PUBLIC_DIR=$PROJECT_DIR/public

# The directory to which to extract the Google Closure Library
CLOSURE_LIBRARY_PATH=$PUBLIC_DIR/lib/closure-library

# The directory to which to extract the Google Closure Compiler
CLOSURE_COMPILER_PATH=$PROJECT_DIR/build/closure-compiler

# The Google Closure Library URL
CLOSURE_LIBRARY_ARCHIVE_NAME="closure-library-20111110-r1376.zip"
CLOSURE_LIBRARY_URL="http://closure-library.googlecode.com/files/$CLOSURE_LIBRARY_ARCHIVE_NAME"
echo $CLOSURE_LIBRARY_URL

# The Google Closure Compiler URL
CLOSURE_COMPILER_ARCHIVE_NAME="compiler-latest.zip"
CLOSURE_COMPILER_URL="http://closure-compiler.googlecode.com/files/$CLOSURE_COMPILER_ARCHIVE_NAME"



# Rename the remote to boilerplate
git remote rename origin $GIT_REMOTE_NAME


# Download the Google Closure Library
curl $CLOSURE_LIBRARY_URL > $CLOSURE_LIBRARY_ARCHIVE_NAME
unzip $CLOSURE_LIBRARY_ARCHIVE_NAME -d $CLOSURE_LIBRARY_PATH
rm $CLOSURE_LIBRARY_ARCHIVE_NAME


# Download the Google Closure Library
curl $CLOSURE_COMPILER_URL > $CLOSURE_COMPILER_ARCHIVE_NAME
unzip $CLOSURE_COMPILER_ARCHIVE_NAME -d $CLOSURE_COMPILER_PATH
rm $CLOSURE_COMPILER_ARCHIVE_NAME

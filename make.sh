
# Closure-boilerplate Installation Script
# --
# @author Jan Kuča <jan@jankuca.com>

# Welcome message
echo ""
echo "Closure-Boilerplate Installation Script"
echo "======================================="
echo ""



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

# The directory to which to extract the Google Closure Templates
CLOSURE_TEMPLATES_PATH=$PROJECT_DIR/build/closure-templates

# The Google Closure Library URL
CLOSURE_LIBRARY_ARCHIVE_NAME="closure-library-20111110-r1376.zip"
CLOSURE_LIBRARY_URL="http://closure-library.googlecode.com/files/$CLOSURE_LIBRARY_ARCHIVE_NAME"

# The Google Closure Compiler URL
CLOSURE_COMPILER_ARCHIVE_NAME="compiler-latest.zip"
CLOSURE_COMPILER_URL="http://closure-compiler.googlecode.com/files/$CLOSURE_COMPILER_ARCHIVE_NAME"

# The Google Closure Templates URL
CLOSURE_TEMPLATES_ARCHIVE_NAME="closure-templates-for-javascript-latest.zip"
CLOSURE_TEMPLATES_URL="http://closure-templates.googlecode.com/files/$CLOSURE_TEMPLATES_ARCHIVE_NAME"



# Check the repository
if ! git checkout master ; then
  echo ""
  echo "! Invalid repository"
  echo "This has to be a cloned closure-boilerplate repository."
  echo "Follow the installation instructions on GitHub."
  exit 1
fi


# Ask for the project name
read -p "Name of this project in package.json: [app] " APP_NAME
[ -z $APP_NAME ] && APP_NAME="app"
# Ask for the project description
read -p "Description of this project in package.json: [] " APP_DESCRIPTION
# Ask for the project author
read -p "Author of this project in package.json: [] " APP_AUTHOR

# Rename the original branch to temp
git branch -m master temp
# Create a new empty branch called master
git checkout --orphan master
# Remove the original (temp) branch
git branch -D temp
# Clear the working directory
git clean -dfx


# Create a package.json file
# Note: We cannot commit without any files added to the repository
#   and a package.json file is not completely useless.
echo -e "{\n\
  \"name\": \"$APP_NAME\",\n\
  \"description\": \"$APP_DESCRIPTION\",\n\
  \"author\": \"$APP_AUTHOR\",\n\
  \"dependencies\": {}\n\
}" > $PROJECT_DIR/package.json
# Stage the created package.json file
git add $PROJECT_DIR/package.json
# Commit the file as the project's initial commit
git commit -m 'initial commit' || exit 1


# Merge the original branch to the new master branch without fast-forwarding
git merge origin/master --no-ff -m 'add closure-boilerplate' || exit 1
# The final git history is now:
#  *   add closure-boilerplate
#  |\
#  | * closure-boilerplate history
#  | * initial commit of closure-boilerplate
#  |
#  *   initial commit of this project


# Rename the remote to boilerplate
git remote rename origin $GIT_REMOTE_NAME


# Download the Google Closure Library
curl $CLOSURE_LIBRARY_URL > $CLOSURE_LIBRARY_ARCHIVE_NAME
mkdir -p $CLOSURE_LIBRARY_PATH
unzip $CLOSURE_LIBRARY_ARCHIVE_NAME -d $CLOSURE_LIBRARY_PATH
rm $CLOSURE_LIBRARY_ARCHIVE_NAME


# Download the Google Closure Compiler
curl $CLOSURE_COMPILER_URL > $CLOSURE_COMPILER_ARCHIVE_NAME
mkdir -p $CLOSURE_COMPILER_PATH
unzip $CLOSURE_COMPILER_ARCHIVE_NAME -d $CLOSURE_COMPILER_PATH
rm $CLOSURE_COMPILER_ARCHIVE_NAME


# Download the Google Closure Templates
curl $CLOSURE_TEMPLATES_URL > $CLOSURE_TEMPLATES_ARCHIVE_NAME
mkdir -p $CLOSURE_TEMPLATES_PATH
unzip $CLOSURE_TEMPLATES_ARCHIVE_NAME -d $CLOSURE_TEMPLATES_PATH
rm $CLOSURE_TEMPLATES_ARCHIVE_NAME

# Copy Soy (Google Closure Templates) Utils to the public dir
mkdir -p $PUBLIC_DIR/lib/closure-templates
cp $CLOSURE_TEMPLATES_PATH/*.js $PUBLIC_DIR/lib/closure-templates


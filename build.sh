
# install client-side dependencies
./node_modules/.bin/bower install

# get Google Closure Compiler
if [ ! -d "build/closure-compiler" ]; then
  cd "build"
  mkdir "closure-compiler"
  cd "closure-compiler"
  curl -s "http://closure-compiler.googlecode.com/files/compiler-latest.zip" > "compiler-latest.zip"
  jar -xf "compiler-latest.zip"
  rm "compiler-latest.zip"
  cd ../..
fi

# build!
./node_modules/.bin/runner


echo ""

echo "== Closure Compiler =="
curl "http://closure-compiler.googlecode.com/files/compiler-latest.zip" > "build/compiler-latest.zip"
unzip "build/compiler-latest.zip" -d "build/closure-compiler"
rm "build/compiler-latest.zip"
echo ""

echo "== NPM =="
npm install
echo ""

echo "== BOWER =="
bower install
echo ""

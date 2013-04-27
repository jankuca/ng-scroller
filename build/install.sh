
if [ ! -d "build" ] || [ ! -d "public" ]; then
  echo -e "\033[0;31mThis script must be executed from the project root directory.\033[0m"
  exit 1
fi


echo ""

echo -en "Install \033[0;36mClosure Compiler\033[0m? [y/n] "
read install_closure_compiler

echo -en "Install \033[0;36mClosure Templates for JavaScript\033[0m? [y/n] "
read install_closure_templates

echo ""


case "$install_closure_compiler" in
  [Yy]*)
    echo "== Closure Compiler =="
    curl "http://closure-compiler.googlecode.com/files/compiler-latest.zip" > "build/compiler-latest.zip"
    rm -rf "build/closure-compiler"
    unzip "build/compiler-latest.zip" -d "build/closure-compiler"
    rm "build/compiler-latest.zip"
    echo ""
    ;;
  *)
    ;;
esac


case "$install_closure_templates" in
  [Yy]*)
    echo "== Closure Templates =="
    curl "https://closure-templates.googlecode.com/files/closure-templates-for-javascript-latest.zip" > "build/closure-templates-for-javascript-latest.zip"
    rm -rf "public/lib/closure-templates"
    mkdir -p "public/lib/closure-templates"
    unzip "build/closure-templates-for-javascript-latest.zip" -d "public/lib/closure-templates"
    rm "build/closure-templates-for-javascript-latest.zip"
    echo ""
    ;;
  *)
    ;;
esac


echo "== NPM =="
npm install
echo ""


echo "== BOWER =="
bower install
echo ""


echo "Setting required permissions..."

echo -en "  - \033[0;37mclosurebuilder.py\033[0m ... "
chmod +x "public/lib/closure-library/closure/bin/build/closurebuilder.py" && {
  echo -e "\033[0;32mok\033[0m"
} || {
  echo -e "\033[0;31mfail\033[0m"
}

echo -en "  - \033[0;37mdepswriter.py\033[0m ... "
chmod +x "public/lib/closure-library/closure/bin/build/depswriter.py" && {
  echo -e "\033[0;32mok\033[0m"
} || {
  echo -e "\033[0;31mfail\033[0m"
}

echo ""


boilerplate_url=$(git config --get remote.origin.url)
git remote rm origin
git remote add closure-boilerplate "$boilerplate_url"

last_commit_subject=$(git log --oneline -n1 --format="format:%s")
if [ "$last_commit_subject" = "[clean initial environment]" ]; then
  git reset --hard HEAD~1
fi

rm "README.md"
git rm "README.md"
git add .
git commit -m '[clean initial environment]'

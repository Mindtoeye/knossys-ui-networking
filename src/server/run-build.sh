clear

if [ ! -d "node_modules" ]; then
  echo "Error: no node_modules folder found, please execute 'run-prep.sh first"
  exit
fi

echo "Building ..."

mkdir -p ./dist

npm run build

WORKDIR=$(pwd)/tmp

mkdir -p $WORKDIR
rm -rf $WORKDIR/build

rsync --recursive --copy-links $PWD $WORKDIR/build

cd $WORKDIR/build/api

npm prune --production 
zip -rq ${WORKDIR}/lambda.zip node_modules lib

WORKDIR=$(pwd)/tmp

mkdir -p $WORKDIR
rm -rf $WORKDIR/build

rsync --archive --copy-links $PWD $WORKDIR/build

cd $WORKDIR/build/api

npm prune --production 
zip -rq ${WORKDIR}/lambda.zip node_modules lib

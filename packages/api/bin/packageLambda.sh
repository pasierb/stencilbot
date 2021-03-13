WORKDIR=$(pwd)/tmp

rm -rf $WORKDIR
mkdir -p $WORKDIR

rsync -Lr $PWD $WORKDIR/build

cd $WORKDIR/build/api

# npm prune --production 
zip -rq ${WORKDIR}/lambda.zip node_modules lib

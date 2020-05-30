mkdir -p tmp

docker build . -t cardstamp-api:latest

docker run -v "$(pwd)"/tmp:/app/layers/out cardstamp-api:latest
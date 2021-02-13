mkdir -p tmp

docker build . -t stencilbot-api:latest

docker run -v "$(pwd)/tmp":/app/layers/out stencilbot-api:latest
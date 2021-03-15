mkdir -p tmp
docker build . -f Dockerfile.api -t stencilbot-api:latest

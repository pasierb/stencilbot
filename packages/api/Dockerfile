FROM amazonlinux:2

ENV APP /app/layers

WORKDIR ${APP}/nodejs

ENV NODE_ENV production

RUN yum install -y gcc gcc-c++ git make openssl-devel tar zip cairo \
    cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel \
    pangomm pangomm-devel giflib-devel

RUN curl https://nodejs.org/download/release/v12.15.0/node-v12.15.0-linux-x64.tar.gz | tar xz -C /usr --strip-components=1
RUN npm i canvas
RUN mkdir -p out

WORKDIR ${APP}/lib

RUN cp /usr/lib64/libblkid.so.1 .
RUN cp /usr/lib64/libmount.so.1 .
RUN cp /usr/lib64/libuuid.so.1 .
RUN cp /usr/lib64/libfontconfig.so.1 .
RUN cp /usr/lib64/libpixman-1.so.0 .

WORKDIR ${APP}

CMD ["zip", "-r", "out/canvas.zip", "nodejs", "lib"]

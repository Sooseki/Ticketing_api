FROM node:18

RUN \ 
  apt update && \
  apt install --assume-yes mycli && \
  npm install -g typescript && \
  npm install -g ts-node
WORKDIR /server
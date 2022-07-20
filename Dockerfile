FROM node:18

COPY dbms/dump.sql /docker-entrypoint-initdb.d/

RUN \ 
  apt update && \
  apt install --assume-yes mycli && \
  npm install -g typescript && \
  npm install -g ts-node
WORKDIR /server
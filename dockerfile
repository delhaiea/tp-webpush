FROM node:latest

RUN apt update -y && apt install -y sqlite3

RUN mkdir -p /opt/project

COPY . /opt/project
RUN cd /opt/project && npm i

EXPOSE 80
EXPOSE 3000
WORKDIR /opt/project
ENTRYPOINT ["node", "bin/www"]
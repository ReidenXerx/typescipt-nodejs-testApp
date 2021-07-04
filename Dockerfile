FROM timbru31/node-alpine-git

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN pwd

RUN ls

# Bundle app source
COPY . .

RUN ls build

RUN npm run build

ENV PORT 1338

ENV MONGO 'ec2-54-228-138-91.eu-west-1.compute.amazonaws.com:27017'

EXPOSE 27017/tcp

EXPOSE 27017/udp

EXPOSE 1338/tcp

EXPOSE 1338/udp

CMD [ "node", "/usr/src/app/build/index.js" ]
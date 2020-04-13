FROM node:13-alpine AS build
WORKDIR /app
COPY .eslintrc.yml .prettierrc.yml *.json yarn.lock .env jest.setup.ts ./
RUN yarn install
COPY src ./src
RUN yarn run lint
RUN yarn run test -w 1
RUN yarn run build
RUN find ./dist -name "*.test.js" -type f -delete
RUN find ./dist -name "*.fixture.js" -type f -delete
RUN find ./dist -name ".env" -type f -delete

FROM node:13-alpine
WORKDIR /app
COPY --from=build /app/package.json /app/yarn.lock /app/.env ./
RUN yarn install --production && yarn cache clean

RUN rm package.json yarn.lock
RUN rm  /usr/local/bin/npm
RUN rm -rf /usr/local/lib/node_modules/npm
RUN rm /usr/local/bin/yarn
RUN rm -rf /opt/yarn*

COPY --from=build /app/dist ./

#RUN mkdir /root/.aws/
#COPY credentials /root/.aws/

CMD [ "node", "src/server.js" ]

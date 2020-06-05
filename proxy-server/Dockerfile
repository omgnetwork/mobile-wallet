#
# Install project dependencies from an image that has all the build toolings available
#

FROM node:10-alpine as builder
WORKDIR /app

COPY . /app

RUN apk add --no-cache python make g++ curl
RUN npm install

#
# Now copy the artifacts over and build the final image from a clean node alpine
#

FROM node:10-alpine as app
WORKDIR /app

COPY . /app
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]

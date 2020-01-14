# Install project dependencies from an image that has all the build toolings available
FROM circleci/node:10 as builders
WORKDIR /app

COPY package.json package-lock.json /app
RUN npm install

# Now copy the artifacts over and build the final image from a clean node alpine
FROM node:10-alpine
WORKDIR /app

COPY . /app
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]

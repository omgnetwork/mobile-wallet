# Install project dependencies from an image that has all the build toolings available
FROM circleci/node:10 as builder

COPY package.json package-lock.json ./
RUN npm install

# Now copy the artifacts over and build the final image from a clean node alpine
FROM node:10-alpine
WORKDIR /app

COPY . /app
COPY --from=builder ./node_modules /app/node_modules

EXPOSE 3000
CMD ["npm", "run", "start"]

FROM truesight.asia:8443/node:stable as node-dev
WORKDIR /src
COPY . .
RUN  yarn install --development && yarn build

# Using nginx to serve front-end
FROM truesight.asia:8443/nginx:stable
EXPOSE 8081
WORKDIR /var/www/html
# Copy built artifacts
COPY --from=node-dev /src/build/ ./
# Copy consul binary file
COPY --from=truesight.asia:8443/consul:stable /bin/consul /usr/local/bin/consul
# Copy envoy binary file
COPY --from=truesight.asia:8443/envoy:stable /usr/local/bin/envoy /usr/local/bin/envoy
# Copy consul configuration files
COPY ./consul /consul/config
# Copy nginx configuration folder
COPY ./nginx/conf.d/ /etc/nginx/conf.d/
# Entry point for this image
COPY ["./docker-entrypoint.sh", "."]
# Make entry point executable
RUN  chmod a+x docker-entrypoint.sh

CMD ["/bin/sh", "./docker-entrypoint.sh"]

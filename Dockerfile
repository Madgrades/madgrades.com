FROM ubuntu:jammy AS build
WORKDIR /build
COPY . .
RUN .dockerfiles/build.sh

FROM build AS app
LABEL org.opencontainers.image.source https://github.com/Madgrades/madgrades.com
WORKDIR /app
COPY --from=build /build .
# Default to running app. This can be overriden from docker cli.
CMD .dockerfiles/run-app.sh
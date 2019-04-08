#!/bin/sh

# port 8888 -> slides
# port 9999 -> bash
# port 8080 -> SimpleHttpServer (as set in demo/-demoit/bash_history)
docker run -it --rm -u $(id -u):$(id -g) \
  -v $(pwd):/micro-frontends \
  -p 127.0.0.1:8888:8888 \
  -p 127.0.0.1:9999:9999 \
  -p 127.0.0.1:8080:8080 \
  "micro-frontends:latest"

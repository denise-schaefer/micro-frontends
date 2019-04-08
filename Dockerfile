FROM golang:1.12-alpine

# stugg required for demoit running instance
RUN apk update && apk upgrade && \
  apk add --no-cache bash python

# install demoit
RUN apk add --no-cache git && \
  go get -u github.com/dgageot/demoit && \
  apk del git

ENTRYPOINT [ "demoit", "--host", "0.0.0.0", "--shellhost", "0.0.0.0",  "/micro-frontends/demo" ]

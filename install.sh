#!/bin/bash

go get github.com/rs/cors
go get github.com/satori/go.uuid
go install github.com/rs/cors
go install github.com/satori/go.uuid
go get github.com/GeertJohan/go.rice
go get github.com/GeertJohan/go.rice/rice
go install github.com/GeertJohan/go.rice
go install github.com/GeertJohan/go.rice/rice
cd src/hubui
go build -o hubui
../../bin/rice append --exec hubui
cd ../../

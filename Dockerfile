FROM debian:jessie
WORKDIR /app
COPY bin/hubui /bin/hubui
COPY . /app
CMD ["/bin/hubui"]

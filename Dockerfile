FROM debian:jessie
WORKDIR /app
COPY src/hubui/hubui /bin/hubui
COPY . /app
CMD ["/bin/hubui"]

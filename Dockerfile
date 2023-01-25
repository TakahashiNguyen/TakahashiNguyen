FROM ubuntu:focal

ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt update --fix-missing && \
    apt install -y git
COPY . /nVietUK
WORKDIR /nVietUK
RUN chmod +x .sh/install-tensorflow.sh && \
    chmod +x .sh/install-tensorRT.sh && \
    chmod +x .sh/install-python.sh
RUN .sh/install-python.sh && ls
RUN .sh/install-tensorRT.sh --docker 
RUN .sh/install-tensorflow.sh --docker
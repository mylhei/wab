# ark-wab
#
# VERSION    1.0.0

FROM coolcao/node-6
MAINTAINER caohongsheng@le.com

ENV HTTP_PORT 3000

COPY . /app
WORKDIR /app

RUN npm install gulp -g
RUN npm install --registry=https://registry.npm.taobao.org
RUN cd public && gulp

EXPOSE 3000

CMD ["npm", "start"]

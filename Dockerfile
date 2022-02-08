FROM node:16
# RUN useradd --system --user-group --create-home app && \
#     mkdir /app && chown app:app /app
# COPY package.json /opt/
# RUN cd /opt && npm install

# ENV NODE_PATH=/opt/node_modules
# VOLUME ["/app"]
# USER app
WORKDIR /app
COPY ./package.json .
RUN npm install -g parcel-bundler
RUN npm install -g typescript
RUN npm install 
COPY . .
RUN npm run build


# EXPOSE 8080
CMD ["npm", "start"]

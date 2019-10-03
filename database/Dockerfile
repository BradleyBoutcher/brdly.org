FROM postgres:10.0-alpine

## Add our init script to the postgres init directory
ADD  ./sql/ /docker-entrypoint-initdb.d/

ENV DB_PORT=5432
ENV DB_DATABASE=postgres
ENV DB_USERNAME=server
ENV PGDATA: /var/lib/postgresql/data/pg_data 

EXPOSE 5432
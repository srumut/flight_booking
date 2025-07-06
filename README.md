Basic flight booking API to learn [NestJS](https://nestjs.com/) and
[Prisma ORM](https://www.prisma.io/orm).

## How to setup and run

1. Clone the repository `git clone https://github.com/srumut/flight_booking`
2. cd into project directory `cd flight_booking`
3. Run `npm i` to install dependencies
4. This step is only necessary if you are running the project for the first time.
   Initially database (mssql in docker container) won't have neither database
   nor the tables that will be referred in the project. The command down below
   will create a temporary container. This container's aim is to help us create
   database (named flight_booking) and tables and store them in the volume that
   will be used by actual database container.

```bash
docker run --rm -it \
    --platform=linux/amd64 \
    --mount type=volume,source=flight_booking_mssql,target=/var/opt/mssql \
    -e ACCEPT_EULA=1 \
    -e MSSQL_SA_PASSWORD=Mysecret_password21 \
    -p 1433:1433 \
    mcr.microsoft.com/mssql/server:2022-latest
```

while container is running, run the command down below in another shell

```bash
npx prisma migrate reset
```

after database and tables created you can stop the temporary container by
pressing Ctrl+C.

5. Run `docker compose up`

## API Client [Bruno](https://www.usebruno.com/)

There is a folder named `bruno` in the project root, which holds example api
requests I've prepared. If you use or want to use Bruno to send HTTP requests to
the API, you can [download Bruno](https://www.usebruno.com/downloads) and select
the `bruno` directory with Open Collection button in Bruno. You should also
choose the collection environment on the top right corner.

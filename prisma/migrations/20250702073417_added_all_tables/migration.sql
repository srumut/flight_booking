/*
  Warnings:

  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Flight` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Flight] DROP CONSTRAINT [Flight_from_city_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Flight] DROP CONSTRAINT [Flight_to_city_fkey];

-- DropTable
DROP TABLE [dbo].[City];

-- DropTable
DROP TABLE [dbo].[Flight];

-- CreateTable
CREATE TABLE [dbo].[city] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [city_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [city_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[flight] (
    [id] NVARCHAR(1000) NOT NULL,
    [from_city] NVARCHAR(1000) NOT NULL,
    [to_city] NVARCHAR(1000) NOT NULL,
    [departure_time] DATETIME2 NOT NULL,
    [arrival_time] DATETIME2 NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [seats_total] INT NOT NULL,
    [seats_available] INT NOT NULL,
    CONSTRAINT [flight_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [flight_from_city_departure_time_key] UNIQUE NONCLUSTERED ([from_city],[departure_time]),
    CONSTRAINT [flight_to_city_arrival_time_key] UNIQUE NONCLUSTERED ([to_city],[arrival_time])
);

-- CreateTable
CREATE TABLE [dbo].[ticket] (
    [id] NVARCHAR(1000) NOT NULL,
    [passenger_name] NVARCHAR(1000),
    [passenger_surname] NVARCHAR(1000),
    [passenger_email] NVARCHAR(1000),
    [flight_id] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ticket_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[admin] (
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000),
    CONSTRAINT [admin_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [flight_from_city_to_city_departure_time_arrival_time_idx] ON [dbo].[flight]([from_city], [to_city], [departure_time], [arrival_time]);

-- AddForeignKey
ALTER TABLE [dbo].[flight] ADD CONSTRAINT [flight_from_city_fkey] FOREIGN KEY ([from_city]) REFERENCES [dbo].[city]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[flight] ADD CONSTRAINT [flight_to_city_fkey] FOREIGN KEY ([to_city]) REFERENCES [dbo].[city]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ticket] ADD CONSTRAINT [ticket_flight_id_fkey] FOREIGN KEY ([flight_id]) REFERENCES [dbo].[flight]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

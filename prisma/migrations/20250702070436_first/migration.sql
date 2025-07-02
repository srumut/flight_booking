BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[City] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [City_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [City_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Flight] (
    [id] NVARCHAR(1000) NOT NULL,
    [from_city] NVARCHAR(1000) NOT NULL,
    [to_city] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Flight_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Flight] ADD CONSTRAINT [Flight_from_city_fkey] FOREIGN KEY ([from_city]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Flight] ADD CONSTRAINT [Flight_to_city_fkey] FOREIGN KEY ([to_city]) REFERENCES [dbo].[City]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

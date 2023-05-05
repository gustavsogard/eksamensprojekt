CREATE TABLE [users] (
  [id] integer NOT NULL IDENTITY(1,1) PRIMARY KEY,
  [name] nvarchar(255),
  [email] nvarchar(255),
  [password] nvarchar(255),
  [created_at] datetime
)
GO

CREATE TABLE [articles] (
  [id] integer NOT NULL IDENTITY(1,1) PRIMARY KEY,
  [title] nvarchar(255),
  [description] nvarchar(255),
  [source] nvarchar(255),
  [author] nvarchar(255),
  [category_id] integer,
  [url] nvarchar(255),
  [image] nvarchar(255),
  [published_at] nvarchar(255)
)
GO

CREATE TABLE [favorite_articles] (
  [user_id] integer,
  [article_id] integer
)
GO

CREATE TABLE [read_articles] (
  [user_id] integer,
  [article_id] integer
)
GO

CREATE TABLE [comments] (
  [id] integer NOT NULL IDENTITY(1,1) PRIMARY KEY,
  [content] nvarchar(255),
  [user_id] integer,
  [article_id] integer
)
GO

CREATE TABLE [favorite_categories] (
  [user_id] integer,
  [category_id] integer
)
GO

CREATE TABLE [categories] (
  [id] integer NOT NULL IDENTITY(1,1) PRIMARY KEY,
  [name] nvarchar(255)
)
GO

CREATE TABLE [weather_historical] (
  [id] integer NOT NULL IDENTITY(1,1) PRIMARY KEY,
  [city] nvarchar(255),
  [date] datetime,
  [degrees] integer
)
GO

CREATE TABLE [weather_forecast] (
  [id] integer NOT NULL IDENTITY(1,1) PRIMARY KEY,
  [city] nvarchar(255),
  [date] datetime,
  [degrees] integer
)
GO

ALTER TABLE [users] ADD FOREIGN KEY ([id]) REFERENCES [favorite_articles] ([user_id])
GO

ALTER TABLE [articles] ADD FOREIGN KEY ([id]) REFERENCES [favorite_articles] ([article_id])
GO

ALTER TABLE [users] ADD FOREIGN KEY ([id]) REFERENCES [read_articles] ([user_id])
GO

ALTER TABLE [articles] ADD FOREIGN KEY ([id]) REFERENCES [read_articles] ([article_id])
GO

ALTER TABLE [users] ADD FOREIGN KEY ([id]) REFERENCES [favorite_categories] ([user_id])
GO

ALTER TABLE [categories] ADD FOREIGN KEY ([id]) REFERENCES [favorite_categories] ([category_id])
GO

ALTER TABLE [articles] ADD FOREIGN KEY ([category_id]) REFERENCES [categories] ([id])
GO

ALTER TABLE [comments] ADD FOREIGN KEY ([article_id]) REFERENCES [articles] ([id])
GO

ALTER TABLE [comments] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([id])
GO

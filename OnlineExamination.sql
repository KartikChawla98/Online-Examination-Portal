create database db_OnlineExamination
use db_OnlineExamination

create table Users
 (
 Id int identity(1,1) primary key,
 FullName nvarchar(40) not null,
 Email nvarchar(60) unique not null,
 Password nvarchar(256) not null,
 DOB Date not null,
 Contact nvarchar(15) not null,
 City nvarchar(20) not null,
 State nvarchar(20) not null,
 HighestQualification nvarchar(60) not null,
 CompletionYear int not null
 )

create table Admins
 (
 Id int identity(1,1) primary key,
 Email nvarchar(60) unique not null,
 Password Binary(64) not null,
 FullName nvarchar(60) not null,
 Contact nvarchar(15) not null
 )
 
create table QuestionFiles
 (
 Id int identity(1,1) primary key,
 Name nvarchar(100) not null,
 LastUpdatedBy int constraint AdminQuestionFile references Admins(Id) not null,
 UpdateDate DateTime not null,
 IsCurrent bit not null,
 )
 
create table Questions
 (
 Id int identity(1,1) primary key,
 FileId int constraint QuestionFileQuestion references QuestionFiles(Id) not null,
 Technology nvarchar(60) not null,
 Level int not null,
 QuestionString nvarchar(500) not null,
 Option1 nvarchar(300) not null,
 Option2 nvarchar(300) not null,
 Option3 nvarchar(300) not null,
 Option4 nvarchar(300) not null,
 CorrectOption int not null,
 )

create table TestStructures
 (
 Id int identity(1,1) primary key,
 Technology nvarchar(60) not null,
 Level int not null,
 MaxMinutes int not null,
 NumberOfQuestions int not null,
 PassingScore int not null,
 LastUpdatedBy int constraint AdminTestStructure references Admins(Id) not null,
 UpdateDate DateTime not null,
 IsCurrent bit not null,
 )

create table Tests
 (
 Id int identity(1,1) primary key,
 UserId int constraint UserTest references Users(Id) not null,
 TestStructureId int constraint TestStructureTest references TestStructures(Id) not null,
 StartTime DateTime,
 EndTime DateTime,
 Score int,
 Result bit
 /* PDF */
 )

create Table TestQuestions
 (
 Id int identity(1,1) primary key,
 TestId int constraint TestTestQuestion references Tests(Id) not null,
 QuestionId int constraint QuestionTestQuestion references Questions(Id) not null,
 UserAnswer int
 )

insert into Admins values 
('kartikchawla101@gmail.com', HASHBYTES('SHA2_512','123456'), 'Kartik Chawla', '9582225801'),
('500053159@stu.upes.ac.in', HASHBYTES('SHA2_512', '123456'), 'Ganesh Dhingra', '9811639909')
select * from Admins
select * from Users

-- disable constraints
EXEC sp_MSForEachTable "ALTER TABLE ? NOCHECK CONSTRAINT all"
-- delete data in all tables
EXEC sp_MSForEachTable "DELETE FROM ?"
-- drop
EXEC sp_MSforeachtable "DROP TABLE ?"
-- enable all constraints
exec sp_MSForEachTable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all"
-- reseed
EXEC sp_MSForEachTable "DBCC CHECKIDENT ( '?', RESEED, 0)"

select * from QuestionFiles
select * from Questions
select * from TestStructures
select * from Tests
select * from TestQuestions
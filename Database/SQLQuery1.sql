use CampusFlowDB
go

create table Roles (
	roleId int identity(1,1) primary key,
	roleName varchar(50) not null unique
	)

insert into Roles (roleName)
values
	('Student'),
	('Faculty'),
	('Admin'),
	('MaintenanceStaff');

create table faculty(
	facultyID int identity(1,1) primary key,
	facultyName varchar(100) not null Unique
)

create table building(
	buildingID int identity(1,1) primary key,
	buildingName varchar(100) not null unique
);

create table clubs (
	clubID int identity(1,1) primary key,
	clubName varchar(100) not null unique,
	clubDescription varchar(500),
	contactEmail varchar(150)
);

create table department (
	departmentID int identity(1,1) primary key,
	departmentName varchar(100) not null,
	facultyID int not null,
	
	constraint fk_department_faculty
		foreign key(facultyID)
		references faculty(facultyID),
	constraint uq_department_faculty
		unique (departmentName, facultyID)
)

create table users (
	userID int identity(1,1) primary key,
	useerName varchar(100) not null,
	email varchar(150) not null unique,
	passwordHash varchar(255) not null,
	roleID int not null,
	departmentID int not null,
	accountStatus varchar(20) not null
		default 'Active',

	constraint fk_users_roles
		foreign key (roleID)
		references roles(roleID),

	constraint fk_users_department
		foreign key (departmentID)
		references department(departmentID),
	 
	constraint ck_users_accountstatus
		check (accountStatus in ('Active', 'Inactive', 'Suspended'))
		
);

create table rooms (
	roomID int identity(1,1) primary key,
	buildingID int not null,
	floor int not null,
	roomNumber varchar(20) not null,
	capacity int not null,
	roomType varchar(50) not null,
	roomStatus varchar(20) not null
		default 'Avialable'
	
	constraint fk_rooms_building
		foreign key (buildingID)
		references building(buildingID),
	constraint uq_rooms_buildingNumber
		unique (buildingID, roomNumber),
	constraint ck_rooms_capacity
		check (capacity > 0),
	constraint ck_rooms_status
		check (roomStatus in ('Available', 'Unavailable', 'Under Maintenance'))	
);

create table campusFacility (
	facilityID int identity(1,1) primary key,
	facilityName varchar(100) not null,
	facilityDescription varchar(500),
	roomID int null,
	contactEmail varchar(150),
	facilityStatus varchar(20) not null
		default 'Available',

	constraint fk_campusFacility_rooms
		foreign key(roomID)
		references rooms(roomID),

	constraint ck_campusFacility_status
		check (facilityStatus in ('Available', 'Unavailable', 'Under Maintenance'))
);

create table clubMemberships(
	membershipID int identity(1,1) primary key,
	userID int not null,
	clubID int not null,
	membershipRole varchar(30) not null default 'Member',
	joinDate date not null default getDate(),

	constraint fk_clubMemberships_users
		foreign key (userID)
		references users(userID),

	constraint fk_clubMemberships_clubs
		foreign key (clubID)
		references clubs(clubID),

	constraint ck_clubMemberships_role
		check (membershipRole in 
			('Member', 'President', 'Vice President', 'Secretary'))
);

create table facilityOpeningHours (
	openingHoursId int identity(1,1) primary key,
	facilityID int not null,
	dayOfWeek varchar(10) not null,
	opensAt time null,
	closesAt time null,
	isClosed bit not null default 0,

	constraint fk_facilityOpeningHours_campusFacility
		foreign key (facilityID)
		references campusFacility(facilityID),
	constraint uq_facilityOpeningHours_facility_day
		unique (facilityID, dayOfWeek),

	constraint ck_facilityOpeningHours_day
		check (dayOfWeek in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),

	constraint ck_facilityOpeningHours_times
		check ( 
			(isClosed = 1 and opensAt is null and closesAt is null)
			or
			(isClosed = 0 and opensAt is not null and closesAt is not null and opensAt < closesAt)
		)
);

create table announcements (
	announcementID int identity(1,1) primary key,
	title varchar(200) not null,
	category varchar(200) not null,
	content varchar(3000) not null,
	authorID int not null,
	publishedAt dateTime2 not null default sysdatetime(),
	announcementStatus varchar(20) not null default 'Published',

	constraint fk_announcements_users
		foreign key (authorID)
		references users(userID),

	constraint ck_announcements_status
		check (announcementStatus in 
			('Draft', 'Published', 'Archived'))
);

create table announcementAudience (
	announcementID int not null,
	roleID int not null,

	constraint pk_announcementAudience
		primary key (announcementID, roleID),

	constraint fk_announcementAudience_announcements
		foreign key (announcementID)
		references announcements(announcementID),

	constraint fk_announcementAudience_roles
		foreign key (roleID)
		references roles(roleID)
);

create table events (
	eventID int identity(1,1) primary key,
	eventTitle varchar(200) not null,
	eventDetails varchar(3000),
	organizerID int not null,
	roomID int null,
	eventDate date not null,
	eventStart time not null,
	eventEnd time not null,
	eventLocation varchar(200),
	registrationDeadline datetime2,
	registrationCapacity int,
	eventStatus varchar(20) not null default 'Scheduled',

	constraint fk_events_users
		foreign key (organizerID)
		references users(userID),

	constraint fk_events_rooms
		foreign key (roomID)
		references rooms(roomID),

	constraint ck_events_time
		check (eventStart < eventEnd),

	constraint ck_events_capacity
		check (registrationCapacity is null or registrationCapacity > 0),

	constraint ck_events_status
		check (eventStatus in 
			('Scheduled', 'Cancelled', 'Completed'))
);

create table eventRegistration(
	registrationID int identity(1,1) primary key,
	eventID int not null,
	userID int not null,
	registrationDate datetime2 not null default sysdatetime(),
	registrationStatus varchar(20) not null default 'Registered',

	constraint fk_eventRegistration_events
		foreign key (eventID)
		references events(eventID),

	constraint fk_eventRegistration_users
		foreign key (userID)
		references users(userID),

	constraint uq_eventRegistration_event_user
		unique (eventID, userID),

	constraint ck_eventRegistration_status
		check (registrationStatus in 
			('Registered', 'Cancelled', 'Attended'))
);

create table reservations (
	reservationID int identity(1,1) primary key,
	roomID int not null,
	userID int not null,
	reservationDate date not null,
	startTime time not null,
	endTime time not null,
	purpose varchar(500) not null,
	reservationStatus varchar(20) not null default 'Pending',
	requestedAt dateTime2 not null default sysdatetime(),

	constraint fk_reservation_rooms
		foreign key (roomID)
		references rooms(roomID),

	constraint fk_reservation_users
		foreign key (userID)
		references users(userID),

	constraint ck_reservationTime
		check (startTime < endTime),

	constraint ck_reservationStatus
		check (reservationStatus in 
			('Pending', 'Approved', 'Rejected', 'Cancelled'))
);

create table complaints (
	complaintID int identity(1,1) primary key,
	submittedBy int not null,
	faultyRoom int null,
	assignedStaffID int null,
	complaintDescription varchar(2000) not null,
	category varchar(50) not null,
	complaintStatus varchar(20) not null default 'Submitted',
	submissionDate datetime2 not null default sysdatetime(),
	resolutionNotes varchar(2000),
	resolvedAt datetime2 null,

	constraint fk_complaints_submitter
		foreign key (submittedBy)
		references users(userID),

	constraint fk_complaint_rooms
		foreign key (faultyRoom)
		references rooms(roomID),

	constraint fk_complaints_assignedStaff
		foreign key (assignedStaffID)
		references users(userID),

	constraint ck_complaints_status
		check (complaintStatus in 
			('Submitted', 'Assigned', 'In progress', 'Resolved', 'Rejected'))
);

create table lostFound(
	lfID int identity(1,1) primary key,
	reportType varchar(10) not null,
	reportedBy int not null,
	itemName varchar(150) not null,
	itemDescription varchar(1000),
	location varchar(200) not null,
	lfDate date not null default cast(getDAte() as date),
	itemStatus varchar(20) not null default 'Open',

	constraint fk_lostFound_users
		foreign key(reportedBy)
		references users(userID),

	constraint ck_lostFound_reportType
		check(reportType in ('Lost', 'Found')),

	constraint ck_lostFound_status
		check (itemStatus in ('Open', 'Claimed', 'Returned', 'Closed'))
);

create table notifications (
	notificationID int identity(1,1) primary key,
	userID int not null,
	notificationMessage varchar(1000) not null,
	createdAt datetime2 not null default sysdatetime(),
	isRead bit not null default 0,

	constraint fk_notification_users
		foreign key (userID)
		references users(userID)
);
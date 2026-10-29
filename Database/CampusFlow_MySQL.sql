

CREATE DATABASE IF NOT EXISTS CampusFlowDB;
USE CampusFlowDB;

CREATE TABLE Roles (
    roleID INT AUTO_INCREMENT PRIMARY KEY,
    roleName VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO Roles (roleName)
VALUES
    ('Student'),
    ('Faculty'),
    ('Admin'),
    ('MaintenanceStaff');

CREATE TABLE Faculty (
    facultyID INT AUTO_INCREMENT PRIMARY KEY,
    facultyName VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE Building (
    buildingID INT AUTO_INCREMENT PRIMARY KEY,
    buildingName VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE Clubs (
    clubID INT AUTO_INCREMENT PRIMARY KEY,
    clubName VARCHAR(100) NOT NULL UNIQUE,
    clubDescription VARCHAR(500),
    contactEmail VARCHAR(150)
) ENGINE=InnoDB;

CREATE TABLE Department (
    departmentID INT AUTO_INCREMENT PRIMARY KEY,
    departmentName VARCHAR(100) NOT NULL,
    facultyID INT NOT NULL,
    CONSTRAINT fk_department_faculty
        FOREIGN KEY (facultyID) REFERENCES Faculty(facultyID),
    CONSTRAINT uq_department_faculty
        UNIQUE (departmentName, facultyID)
) ENGINE=InnoDB;

CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    roleID INT NOT NULL,
    departmentID INT NULL,
    accountStatus VARCHAR(20) NOT NULL DEFAULT 'Active',
    CONSTRAINT fk_users_roles
        FOREIGN KEY (roleID) REFERENCES Roles(roleID),
    CONSTRAINT fk_users_department
        FOREIGN KEY (departmentID) REFERENCES Department(departmentID),
    CONSTRAINT ck_users_accountstatus
        CHECK (accountStatus IN ('Active', 'Inactive', 'Suspended'))
) ENGINE=InnoDB;

CREATE TABLE Rooms (
    roomID INT AUTO_INCREMENT PRIMARY KEY,
    buildingID INT NOT NULL,
    floor INT NOT NULL,
    roomNumber VARCHAR(20) NOT NULL,
    capacity INT NOT NULL,
    roomType VARCHAR(50) NOT NULL,
    roomStatus VARCHAR(30) NOT NULL DEFAULT 'Available',
    CONSTRAINT fk_rooms_building
        FOREIGN KEY (buildingID) REFERENCES Building(buildingID),
    CONSTRAINT uq_rooms_buildingNumber
        UNIQUE (buildingID, roomNumber),
    CONSTRAINT ck_rooms_capacity
        CHECK (capacity > 0),
    CONSTRAINT ck_rooms_status
        CHECK (roomStatus IN ('Available', 'Unavailable', 'Under Maintenance'))
) ENGINE=InnoDB;

CREATE TABLE CampusFacility (
    facilityID INT AUTO_INCREMENT PRIMARY KEY,
    facilityName VARCHAR(100) NOT NULL,
    facilityDescription VARCHAR(500),
    roomID INT NULL,
    contactEmail VARCHAR(150),
    facilityStatus VARCHAR(30) NOT NULL DEFAULT 'Available',
    CONSTRAINT fk_campusFacility_rooms
        FOREIGN KEY (roomID) REFERENCES Rooms(roomID),
    CONSTRAINT ck_campusFacility_status
        CHECK (facilityStatus IN ('Available', 'Unavailable', 'Under Maintenance'))
) ENGINE=InnoDB;

CREATE TABLE ClubMemberships (
    membershipID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    clubID INT NOT NULL,
    membershipRole VARCHAR(30) NOT NULL DEFAULT 'Member',
    joinDate DATE NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_clubMemberships_users
        FOREIGN KEY (userID) REFERENCES Users(userID),
    CONSTRAINT fk_clubMemberships_clubs
        FOREIGN KEY (clubID) REFERENCES Clubs(clubID),
    CONSTRAINT uq_clubMemberships_user_club
        UNIQUE (userID, clubID),
    CONSTRAINT ck_clubMemberships_role
        CHECK (membershipRole IN ('Member', 'President', 'Vice President', 'Secretary'))
) ENGINE=InnoDB;

CREATE TABLE FacilityOpeningHours (
    openingHoursID INT AUTO_INCREMENT PRIMARY KEY,
    facilityID INT NOT NULL,
    dayOfWeek VARCHAR(10) NOT NULL,
    opensAt TIME NULL,
    closesAt TIME NULL,
    isClosed BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_facilityOpeningHours_campusFacility
        FOREIGN KEY (facilityID) REFERENCES CampusFacility(facilityID),
    CONSTRAINT uq_facilityOpeningHours_facility_day
        UNIQUE (facilityID, dayOfWeek),
    CONSTRAINT ck_facilityOpeningHours_day
        CHECK (dayOfWeek IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    CONSTRAINT ck_facilityOpeningHours_times
        CHECK (
            (isClosed = TRUE AND opensAt IS NULL AND closesAt IS NULL)
            OR
            (isClosed = FALSE AND opensAt IS NOT NULL AND closesAt IS NOT NULL AND opensAt < closesAt)
        )
) ENGINE=InnoDB;

CREATE TABLE Announcements (
    announcementID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(200) NOT NULL,
    content VARCHAR(3000) NOT NULL,
    authorID INT NOT NULL,
    publishedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    announcementStatus VARCHAR(20) NOT NULL DEFAULT 'Published',
    CONSTRAINT fk_announcements_users
        FOREIGN KEY (authorID) REFERENCES Users(userID),
    CONSTRAINT ck_announcements_status
        CHECK (announcementStatus IN ('Draft', 'Published', 'Archived'))
) ENGINE=InnoDB;

CREATE TABLE AnnouncementAudience (
    announcementID INT NOT NULL,
    roleID INT NOT NULL,
    CONSTRAINT pk_announcementAudience
        PRIMARY KEY (announcementID, roleID),
    CONSTRAINT fk_announcementAudience_announcements
        FOREIGN KEY (announcementID) REFERENCES Announcements(announcementID),
    CONSTRAINT fk_announcementAudience_roles
        FOREIGN KEY (roleID) REFERENCES Roles(roleID)
) ENGINE=InnoDB;

CREATE TABLE Events (
    eventID INT AUTO_INCREMENT PRIMARY KEY,
    eventTitle VARCHAR(200) NOT NULL,
    eventDetails VARCHAR(3000),
    organizerID INT NOT NULL,
    clubID INT NULL,
    roomID INT NULL,
    eventDate DATE NOT NULL,
    eventStart TIME NOT NULL,
    eventEnd TIME NOT NULL,
    eventLocation VARCHAR(200),
    registrationDeadline DATETIME NULL,
    registrationCapacity INT NULL,
    eventStatus VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
    CONSTRAINT fk_events_users
        FOREIGN KEY (organizerID) REFERENCES Users(userID),
    CONSTRAINT fk_events_clubs
        FOREIGN KEY (clubID) REFERENCES Clubs(clubID),
    CONSTRAINT fk_events_rooms
        FOREIGN KEY (roomID) REFERENCES Rooms(roomID),
    CONSTRAINT ck_events_time
        CHECK (eventStart < eventEnd),
    CONSTRAINT ck_events_capacity
        CHECK (registrationCapacity IS NULL OR registrationCapacity > 0),
    CONSTRAINT ck_events_status
        CHECK (eventStatus IN ('Scheduled', 'Cancelled', 'Completed'))
) ENGINE=InnoDB;

CREATE TABLE EventRegistration (
    registrationID INT AUTO_INCREMENT PRIMARY KEY,
    eventID INT NOT NULL,
    userID INT NOT NULL,
    registrationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    registrationStatus VARCHAR(20) NOT NULL DEFAULT 'Registered',
    CONSTRAINT fk_eventRegistration_events
        FOREIGN KEY (eventID) REFERENCES Events(eventID),
    CONSTRAINT fk_eventRegistration_users
        FOREIGN KEY (userID) REFERENCES Users(userID),
    CONSTRAINT uq_eventRegistration_event_user
        UNIQUE (eventID, userID),
    CONSTRAINT ck_eventRegistration_status
        CHECK (registrationStatus IN ('Registered', 'Cancelled', 'Attended'))
) ENGINE=InnoDB;

CREATE TABLE Reservations (
    reservationID INT AUTO_INCREMENT PRIMARY KEY,
    roomID INT NOT NULL,
    userID INT NOT NULL,
    reservationDate DATE NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    purpose VARCHAR(500) NOT NULL,
    reservationStatus VARCHAR(20) NOT NULL DEFAULT 'Pending',
    requestedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservation_rooms
        FOREIGN KEY (roomID) REFERENCES Rooms(roomID),
    CONSTRAINT fk_reservation_users
        FOREIGN KEY (userID) REFERENCES Users(userID),
    CONSTRAINT ck_reservationTime
        CHECK (startTime < endTime),
    CONSTRAINT ck_reservationStatus
        CHECK (reservationStatus IN ('Pending', 'Approved', 'Rejected', 'Cancelled'))
) ENGINE=InnoDB;

CREATE TABLE Complaints (
    complaintID INT AUTO_INCREMENT PRIMARY KEY,
    submittedBy INT NOT NULL,
    faultyRoom INT NULL,
    assignedStaffID INT NULL,
    complaintDescription VARCHAR(2000) NOT NULL,
    category VARCHAR(50) NOT NULL,
    complaintStatus VARCHAR(20) NOT NULL DEFAULT 'Submitted',
    submissionDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolutionNotes VARCHAR(2000),
    resolvedAt DATETIME NULL,
    CONSTRAINT fk_complaints_submitter
        FOREIGN KEY (submittedBy) REFERENCES Users(userID),
    CONSTRAINT fk_complaint_rooms
        FOREIGN KEY (faultyRoom) REFERENCES Rooms(roomID),
    CONSTRAINT fk_complaints_assignedStaff
        FOREIGN KEY (assignedStaffID) REFERENCES Users(userID),
    CONSTRAINT ck_complaints_status
        CHECK (complaintStatus IN ('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected'))
) ENGINE=InnoDB;

CREATE TABLE LostFound (
    lfID INT AUTO_INCREMENT PRIMARY KEY,
    reportType VARCHAR(10) NOT NULL,
    reportedBy INT NOT NULL,
    itemName VARCHAR(150) NOT NULL,
    itemDescription VARCHAR(1000),
    location VARCHAR(200) NOT NULL,
    lfDate DATE NOT NULL DEFAULT (CURRENT_DATE),
    itemStatus VARCHAR(20) NOT NULL DEFAULT 'Open',
    CONSTRAINT fk_lostFound_users
        FOREIGN KEY (reportedBy) REFERENCES Users(userID),
    CONSTRAINT ck_lostFound_reportType
        CHECK (reportType IN ('Lost', 'Found')),
    CONSTRAINT ck_lostFound_status
        CHECK (itemStatus IN ('Open', 'Claimed', 'Returned', 'Closed'))
) ENGINE=InnoDB;

CREATE TABLE Notifications (
    notificationID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    notificationMessage VARCHAR(1000) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isRead BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_notification_users
        FOREIGN KEY (userID) REFERENCES Users(userID)
) ENGINE=InnoDB;

-- Verify table creation:
SHOW TABLES;

SELECT * from roles

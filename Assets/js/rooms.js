var rooms = [
    { id: "R001", roomNumber: "DEMO-101", buildingId: "B001", floor: "1st Floor", type: "Classroom", capacity: 40, description: "DEMO room. Not official AIUB data.", status: "Available" },
    { id: "R002", roomNumber: "DEMO-205", buildingId: "B001", floor: "2nd Floor", type: "Computer Lab", capacity: 30, description: "DEMO room. Not official AIUB data.", status: "Available" },
    { id: "R003", roomNumber: "DEMO-310", buildingId: "B001", floor: "3rd Floor", type: "Science Laboratory", capacity: 25, description: "DEMO room. Not official AIUB data.", status: "Available" },
    { id: "R004", roomNumber: "DEMO-401", buildingId: "B002", floor: "4th Floor", type: "Meeting Room", capacity: 12, description: "DEMO room. Not official AIUB data.", status: "Under Maintenance" },
    { id: "R005", roomNumber: "DEMO-A1", buildingId: "B005", floor: "Ground Floor", type: "Auditorium", capacity: 200, description: "DEMO room. Not official AIUB data.", status: "Available" },
    { id: "R006", roomNumber: "DEMO-A2", buildingId: "B005", floor: "1st Floor", type: "Seminar Room", capacity: 50, description: "DEMO room. Not official AIUB data.", status: "Unavailable" },
    { id: "R007", roomNumber: "DEMO-F1", buildingId: "B002", floor: "2nd Floor", type: "Faculty Room", capacity: 8, description: "DEMO room. Not official AIUB data.", status: "Available" },
    { id: "R008", roomNumber: "DEMO-L1", buildingId: "B004", floor: "Ground Floor", type: "Library", capacity: 60, description: "DEMO room. Not official AIUB data.", status: "Available" }
];

var roomTypes = ["Classroom", "Computer Lab", "Science Laboratory", "Faculty Room", "Office", "Meeting Room", "Auditorium", "Seminar Room", "Library", "Other"];
var roomStatuses = ["Available", "Unavailable", "Under Maintenance"];
var reservableTypes = ["Classroom", "Computer Lab", "Meeting Room", "Auditorium", "Seminar Room"];
var floorLabels = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor", "6th Floor", "7th Floor", "8th Floor", "9th Floor"];

var roomNextNumber = 9;
var roomEditingId = "";

var roomsTable = document.getElementById("roomsTableBody");
var roomSearch = document.getElementById("roomSearch");
var roomTypeFilter = document.getElementById("roomTypeFilter");
var roomStatusFilter = document.getElementById("roomStatusFilter");
var roomDetailsBox = document.getElementById("roomDetails");
var roomManageTable = document.getElementById("roomManageTableBody");
var roomForm = document.getElementById("roomForm");
var roomMessage = document.getElementById("roomMessage");
var roomFormTitle = document.getElementById("roomFormTitle");

function getRoomStatusClass(status) {
    if (status == "Available") {
        return "facilities-status facilities-status-green";
    }
    if (status == "Under Maintenance") {
        return "facilities-status facilities-status-yellow";
    }
    return "facilities-status facilities-status-red";
}

function getBuildingName(buildingId) {
    for (var i = 0; i < buildings.length; i++) {
        if (buildings[i].id == buildingId) {
            return buildings[i].name;
        }
    }
    return "Unknown Building";
}

function canReserveRoom(room) {
    return reservableTypes.includes(room.type) && room.status == "Available";
}

function fillSelect(select, list) {
    for (var i = 0; i < list.length; i++) {
        var option = document.createElement("option");
        option.value = list[i];
        option.textContent = list[i];
        select.appendChild(option);
    }
}

function showRooms() {
    var text = roomSearch.value.toLowerCase();
    var type = roomTypeFilter.value;
    var status = roomStatusFilter.value;
    var html = "";

    for (var i = 0; i < rooms.length; i++) {
        var r = rooms[i];
        var buildingName = getBuildingName(r.buildingId);
        var matchText = r.roomNumber.toLowerCase().includes(text) || buildingName.toLowerCase().includes(text);
        var matchType = type == "" || r.type == type;
        var matchStatus = status == "" || r.status == status;

        if (matchText && matchType && matchStatus) {
            html += "<tr>";
            html += "<td>" + r.roomNumber + "</td>";
            html += "<td>" + buildingName + "</td>";
            html += "<td>" + r.floor + "</td>";
            html += "<td>" + r.type + "</td>";
            html += "<td>" + r.capacity + "</td>";
            html += '<td><span class="' + getRoomStatusClass(r.status) + '">' + r.status + "</span></td>";
            html += '<td><a class="facilities-button facilities-button-small" href="room-details.html?id=' + r.id + '">View</a></td>';
            html += "</tr>";
        }
    }

    if (html == "") {
        html = '<tr><td colspan="7" class="facilities-empty">No rooms found.</td></tr>';
    }

    roomsTable.innerHTML = html;
}

function showRoomDetails() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var found = null;

    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == id) {
            found = rooms[i];
        }
    }

    if (found == null) {
        roomDetailsBox.innerHTML = "<p>Room not found.</p>";
        return;
    }

    var html = '<dl class="facilities-details">';
    html += "<dt>Room Number</dt><dd>" + found.roomNumber + "</dd>";
    html += "<dt>Building</dt><dd>" + getBuildingName(found.buildingId) + "</dd>";
    html += "<dt>Floor</dt><dd>" + found.floor + "</dd>";
    html += "<dt>Type</dt><dd>" + found.type + "</dd>";
    html += "<dt>Estimated Capacity</dt><dd>" + found.capacity + "</dd>";
    html += '<dt>Status</dt><dd><span class="' + getRoomStatusClass(found.status) + '">' + found.status + "</span></dd>";
    html += "<dt>Description</dt><dd>" + found.description + "</dd>";
    html += "</dl>";

    if (canReserveRoom(found)) {
        html += '<p><a class="facilities-button" href="make-reservation.html?room=' + found.id + '">Make Reservation</a></p>';
    } else {
        html += '<p class="facilities-note">This room cannot be reserved.</p>';
    }

    roomDetailsBox.innerHTML = html;
}

function showRoomMessage(text, type) {
    roomMessage.textContent = text;
    roomMessage.className = "facilities-message facilities-message-" + type;
}

function showRoomManageTable() {
    var html = "";

    for (var i = 0; i < rooms.length; i++) {
        var r = rooms[i];
        html += "<tr>";
        html += "<td>" + r.id + "</td>";
        html += "<td>" + r.roomNumber + "</td>";
        html += "<td>" + getBuildingName(r.buildingId) + "</td>";
        html += "<td>" + r.floor + "</td>";
        html += "<td>" + r.type + "</td>";
        html += "<td>" + r.capacity + "</td>";
        html += "<td>";
        html += "<select onchange=\"changeRoomStatus('" + r.id + "', this.value)\">";
        for (var j = 0; j < roomStatuses.length; j++) {
            var selected = "";
            if (roomStatuses[j] == r.status) {
                selected = " selected";
            }
            html += '<option value="' + roomStatuses[j] + '"' + selected + ">" + roomStatuses[j] + "</option>";
        }
        html += "</select>";
        html += "</td>";
        html += '<td><div class="facilities-actions">';
        html += "<button class=\"facilities-button facilities-button-small\" onclick=\"editRoom('" + r.id + "')\">Edit</button>";
        html += "<button class=\"facilities-button facilities-button-danger facilities-button-small\" onclick=\"deleteRoom('" + r.id + "')\">Delete</button>";
        html += "</div></td>";
        html += "</tr>";
    }

    if (html == "") {
        html = '<tr><td colspan="8" class="facilities-empty">No rooms found.</td></tr>';
    }

    roomManageTable.innerHTML = html;
}

function changeRoomStatus(id, newStatus) {
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == id) {
            rooms[i].status = newStatus;
        }
    }
    showRoomManageTable();
    showRoomMessage("Room status updated.", "success");
}

function resetRoomForm() {
    roomForm.reset();
    roomEditingId = "";
    roomFormTitle.textContent = "Add Room";
    document.getElementById("roomId").value = "";
}

function editRoom(id) {
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == id) {
            var r = rooms[i];
            document.getElementById("roomId").value = r.id;
            document.getElementById("roomNumber").value = r.roomNumber;
            document.getElementById("roomBuilding").value = r.buildingId;
            document.getElementById("roomFloor").value = r.floor;
            document.getElementById("roomType").value = r.type;
            document.getElementById("roomCapacity").value = r.capacity;
            document.getElementById("roomStatus").value = r.status;
            document.getElementById("roomDescription").value = r.description;
            roomEditingId = r.id;
            roomFormTitle.textContent = "Edit Room";
            roomMessage.className = "";
            roomMessage.textContent = "";
        }
    }
}

function deleteRoom(id) {
    if (confirm("Delete room " + id + "?")) {
        var newList = [];
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i].id != id) {
                newList.push(rooms[i]);
            }
        }
        rooms = newList;

        if (roomEditingId == id) {
            resetRoomForm();
        }

        showRoomManageTable();
        showRoomMessage("Room deleted.", "success");
    }
}

if (roomsTable) {
    fillSelect(roomTypeFilter, roomTypes);
    fillSelect(roomStatusFilter, roomStatuses);
    showRooms();
    roomSearch.addEventListener("input", showRooms);
    roomTypeFilter.addEventListener("change", showRooms);
    roomStatusFilter.addEventListener("change", showRooms);
}

if (roomDetailsBox) {
    showRoomDetails();
}

if (roomManageTable && roomForm) {
    var buildingSelect = document.getElementById("roomBuilding");
    for (var b = 0; b < buildings.length; b++) {
        var option = document.createElement("option");
        option.value = buildings[b].id;
        option.textContent = buildings[b].name;
        buildingSelect.appendChild(option);
    }

    fillSelect(document.getElementById("roomFloor"), floorLabels);
    fillSelect(document.getElementById("roomType"), roomTypes);
    fillSelect(document.getElementById("roomStatus"), roomStatuses);

    showRoomManageTable();

    roomForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var number = document.getElementById("roomNumber").value.trim();
        var buildingId = document.getElementById("roomBuilding").value;
        var floor = document.getElementById("roomFloor").value;
        var type = document.getElementById("roomType").value;
        var capacityText = document.getElementById("roomCapacity").value;
        var status = document.getElementById("roomStatus").value;
        var description = document.getElementById("roomDescription").value.trim();

        if (number == "") {
            showRoomMessage("Room number is required.", "error");
            return;
        }

        if (buildingId == "") {
            showRoomMessage("Please select a building.", "error");
            return;
        }

        if (floor == "") {
            showRoomMessage("Please select a floor.", "error");
            return;
        }

        var buildingFloors = 0;
        for (var i = 0; i < buildings.length; i++) {
            if (buildings[i].id == buildingId) {
                buildingFloors = buildings[i].floors;
            }
        }
        if (floorLabels.indexOf(floor) >= buildingFloors) {
            showRoomMessage("This building only has " + buildingFloors + " floor(s).", "error");
            return;
        }

        if (type == "") {
            showRoomMessage("Please select a room type.", "error");
            return;
        }

        if (capacityText == "" || Math.floor(capacityText) != capacityText || Number(capacityText) < 1) {
            showRoomMessage("Capacity must be a whole number of 1 or more.", "error");
            return;
        }

        for (var j = 0; j < rooms.length; j++) {
            if (rooms[j].roomNumber.toLowerCase() == number.toLowerCase() && rooms[j].buildingId == buildingId && rooms[j].id != roomEditingId) {
                showRoomMessage("This room number already exists in the building.", "error");
                return;
            }
        }

        if (roomEditingId == "") {
            var newId = "R00" + roomNextNumber;
            roomNextNumber++;
            rooms.push({
                id: newId,
                roomNumber: number,
                buildingId: buildingId,
                floor: floor,
                type: type,
                capacity: Number(capacityText),
                description: description,
                status: status
            });
            showRoomMessage("Room added.", "success");
        } else {
            for (var k = 0; k < rooms.length; k++) {
                if (rooms[k].id == roomEditingId) {
                    rooms[k].roomNumber = number;
                    rooms[k].buildingId = buildingId;
                    rooms[k].floor = floor;
                    rooms[k].type = type;
                    rooms[k].capacity = Number(capacityText);
                    rooms[k].status = status;
                    rooms[k].description = description;
                }
            }
            showRoomMessage("Room updated.", "success");
        }

        resetRoomForm();
        showRoomManageTable();
    });

    document.getElementById("roomCancelButton").addEventListener("click", function () {
        resetRoomForm();
        roomMessage.className = "";
        roomMessage.textContent = "";
    });
}
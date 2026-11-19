var buildings = [
    { id: "B001", name: "D-Building (Engineering & Science)", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 10, totalRooms: 0, status: "Active", description: "Engineering and Science building." },
    { id: "B002", name: "C-Building", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 7, totalRooms: 0, status: "Active", description: "C-Building, campus facilities." },
    { id: "B003", name: "Cafeteria and Food Court", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 2, totalRooms: 0, status: "Active", description: "Campus cafeteria and food court." },
    { id: "B004", name: "Annex 1", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 1, totalRooms: 0, status: "Active", description: "Campus annex building." },
    { id: "B005", name: "Annex 2", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 2, totalRooms: 0, status: "Active", description: "Campus annex building." },
    { id: "B006", name: "Annex 3", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 2, totalRooms: 0, status: "Active", description: "Campus annex building." },
    { id: "B007", name: "Annex 4", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 2, totalRooms: 0, status: "Active", description: "Campus annex building." },
    { id: "B008", name: "Annex 5", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 1, totalRooms: 0, status: "Active", description: "Campus annex building." },
    { id: "B009", name: "Annex 6", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 2, totalRooms: 0, status: "Active", description: "Campus annex building." },
    { id: "B010", name: "Annex 7", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 4, totalRooms: 0, status: "Active", description: "Campus annex building." },
    { id: "B011", name: "Annex 8", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 1, totalRooms: 0, status: "Active", description: "Campus annex building." },
    { id: "B012", name: "Parking & Service Areas", location: "AIUB Main Campus, Kuratoli, Dhaka", floors: 1, totalRooms: 0, status: "Active", description: "Campus parking and service areas." }
];

var nextNumber = 13;
var editingId = "";

var buildingsTable = document.getElementById("buildingsTableBody");
var searchInput = document.getElementById("searchInput");
var detailsBox = document.getElementById("buildingDetails");
var manageTable = document.getElementById("manageTableBody");
var buildingForm = document.getElementById("buildingForm");
var formMessage = document.getElementById("formMessage");
var formTitle = document.getElementById("formTitle");

function getStatusClass(status) {
    if (status == "Active") {
        return "facilities-status facilities-status-green";
    }
    return "facilities-status facilities-status-gray";
}

function showBuildings() {
    var text = searchInput.value.toLowerCase();
    var html = "";

    for (var i = 0; i < buildings.length; i++) {
        var b = buildings[i];
        if (b.id.toLowerCase().includes(text) || b.name.toLowerCase().includes(text) || b.location.toLowerCase().includes(text)) {
            html += "<tr>";
            html += "<td>" + b.id + "</td>";
            html += "<td>" + b.name + "</td>";
            html += "<td>" + b.location + "</td>";
            html += "<td>" + b.floors + "</td>";
            html += "<td>" + b.totalRooms + "</td>";
            html += '<td><span class="' + getStatusClass(b.status) + '">' + b.status + "</span></td>";
            html += '<td><a class="facilities-button facilities-button-small" href="building-details.html?id=' + b.id + '">View</a></td>';
            html += "</tr>";
        }
    }

    if (html == "") {
        html = '<tr><td colspan="7" class="facilities-empty">No buildings found.</td></tr>';
    }

    buildingsTable.innerHTML = html;
}

function showDetails() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var found = null;

    for (var i = 0; i < buildings.length; i++) {
        if (buildings[i].id == id) {
            found = buildings[i];
        }
    }

    if (found == null) {
        detailsBox.innerHTML = "<p>Building not found.</p>";
        return;
    }

    var html = '<div class="facilities-image-placeholder">Building Image Placeholder</div>';
    html += '<dl class="facilities-details">';
    html += "<dt>Building ID</dt><dd>" + found.id + "</dd>";
    html += "<dt>Name</dt><dd>" + found.name + "</dd>";
    html += "<dt>Location</dt><dd>" + found.location + "</dd>";
    html += "<dt>Floors</dt><dd>" + found.floors + "</dd>";
    html += '<dt>Status</dt><dd><span class="' + getStatusClass(found.status) + '">' + found.status + "</span></dd>";
    html += "<dt>Description</dt><dd>" + found.description + "</dd>";
    html += "<dt>Total Rooms</dt><dd>" + found.totalRooms + "</dd>";
    html += "</dl>";

    detailsBox.innerHTML = html;
}

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "facilities-message facilities-message-" + type;
}

function showManageTable() {
    var html = "";

    for (var i = 0; i < buildings.length; i++) {
        var b = buildings[i];
        html += "<tr>";
        html += "<td>" + b.id + "</td>";
        html += "<td>" + b.name + "</td>";
        html += "<td>" + b.location + "</td>";
        html += "<td>" + b.floors + "</td>";
        html += "<td>" + b.totalRooms + "</td>";
        html += '<td><span class="' + getStatusClass(b.status) + '">' + b.status + "</span></td>";
        html += '<td><div class="facilities-actions">';
        html += "<button class=\"facilities-button facilities-button-small\" onclick=\"editBuilding('" + b.id + "')\">Edit</button>";
        html += "<button class=\"facilities-button facilities-button-danger facilities-button-small\" onclick=\"deleteBuilding('" + b.id + "')\">Delete</button>";
        html += "</div></td>";
        html += "</tr>";
    }

    if (html == "") {
        html = '<tr><td colspan="7" class="facilities-empty">No buildings found.</td></tr>';
    }

    manageTable.innerHTML = html;
}

function resetForm() {
    buildingForm.reset();
    editingId = "";
    formTitle.textContent = "Add Building";
    document.getElementById("buildingId").value = "";
}

function editBuilding(id) {
    for (var i = 0; i < buildings.length; i++) {
        if (buildings[i].id == id) {
            var b = buildings[i];
            document.getElementById("buildingId").value = b.id;
            document.getElementById("buildingName").value = b.name;
            document.getElementById("buildingLocation").value = b.location;
            document.getElementById("buildingFloors").value = b.floors;
            document.getElementById("buildingTotalRooms").value = b.totalRooms;
            document.getElementById("buildingStatus").value = b.status;
            document.getElementById("buildingDescription").value = b.description;
            editingId = b.id;
            formTitle.textContent = "Edit Building";
            formMessage.className = "";
            formMessage.textContent = "";
        }
    }
}

function deleteBuilding(id) {
    if (confirm("Delete building " + id + "?")) {
        var newList = [];
        for (var i = 0; i < buildings.length; i++) {
            if (buildings[i].id != id) {
                newList.push(buildings[i]);
            }
        }
        buildings = newList;

        if (editingId == id) {
            resetForm();
        }

        showManageTable();
        showMessage("Building deleted.", "success");
    }
}

if (buildingsTable) {
    showBuildings();
    searchInput.addEventListener("input", showBuildings);
}

if (detailsBox) {
    showDetails();
}

if (manageTable && buildingForm) {
    showManageTable();

    buildingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var buildingName = document.getElementById("buildingName").value.trim();
        var buildingLocation = document.getElementById("buildingLocation").value.trim();
        var floorsText = document.getElementById("buildingFloors").value;
        var roomsText = document.getElementById("buildingTotalRooms").value;
        var buildingStatus = document.getElementById("buildingStatus").value;
        var buildingDescription = document.getElementById("buildingDescription").value.trim();

        if (buildingName == "") {
            showMessage("Building name is required.", "error");
            return;
        }

        if (buildingLocation == "") {
            showMessage("Location is required.", "error");
            return;
        }

        if (floorsText == "" || Math.floor(floorsText) != floorsText || Number(floorsText) < 1) {
            showMessage("Floors must be a whole number of 1 or more.", "error");
            return;
        }

        if (roomsText == "" || Math.floor(roomsText) != roomsText || Number(roomsText) < 0) {
            showMessage("Total rooms must be a whole number of 0 or more.", "error");
            return;
        }

        if (editingId == "") {
            var newId = "B0" + nextNumber;
            nextNumber++;
            buildings.push({
                id: newId,
                name: buildingName,
                location: buildingLocation,
                floors: Number(floorsText),
                totalRooms: Number(roomsText),
                status: buildingStatus,
                description: buildingDescription
            });
            showMessage("Building added.", "success");
        } else {
            for (var i = 0; i < buildings.length; i++) {
                if (buildings[i].id == editingId) {
                    buildings[i].name = buildingName;
                    buildings[i].location = buildingLocation;
                    buildings[i].floors = Number(floorsText);
                    buildings[i].totalRooms = Number(roomsText);
                    buildings[i].status = buildingStatus;
                    buildings[i].description = buildingDescription;
                }
            }
            showMessage("Building updated.", "success");
        }

        resetForm();
        showManageTable();
    });

    document.getElementById("cancelButton").addEventListener("click", function () {
        resetForm();
        formMessage.className = "";
        formMessage.textContent = "";
    });
}
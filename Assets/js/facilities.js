var facilities = [
    { id: "F001", name: "DEMO Cafeteria Seating Area", buildingId: "B003", description: "DEMO facility. Not official AIUB data.", openingHours: "08:00 - 18:00", status: "Open", reservable: false },
    { id: "F002", name: "DEMO Student Lounge", buildingId: "B002", description: "DEMO facility. Not official AIUB data.", openingHours: "09:00 - 17:00", status: "Open", reservable: true },
    { id: "F003", name: "DEMO Seminar Hall", buildingId: "B005", description: "DEMO facility. Not official AIUB data.", openingHours: "09:00 - 20:00", status: "Open", reservable: true },
    { id: "F004", name: "DEMO Prayer Room", buildingId: "B001", description: "DEMO facility. Not official AIUB data.", openingHours: "06:00 - 22:00", status: "Under Maintenance", reservable: false }
];

var facilityStatuses = ["Open", "Closed", "Under Maintenance"];
var facilityNextNumber = 5;
var facilityEditingId = "";

var facilitiesTable = document.getElementById("facilitiesTableBody");
var facilitySearch = document.getElementById("facilitySearch");
var facilityDetailsBox = document.getElementById("facilityDetails");
var facilityManageTable = document.getElementById("facilityManageTableBody");
var facilityForm = document.getElementById("facilityForm");
var facilityMessage = document.getElementById("facilityMessage");
var facilityFormTitle = document.getElementById("facilityFormTitle");

function getFacilityStatusClass(status) {
    if (status == "Open") {
        return "facilities-status facilities-status-green";
    }
    if (status == "Under Maintenance") {
        return "facilities-status facilities-status-yellow";
    }
    return "facilities-status facilities-status-red";
}

function getFacilityBuildingName(buildingId) {
    for (var i = 0; i < buildings.length; i++) {
        if (buildings[i].id == buildingId) {
            return buildings[i].name;
        }
    }
    return "Unknown Building";
}

function showFacilities() {
    var text = facilitySearch.value.toLowerCase();
    var html = "";

    for (var i = 0; i < facilities.length; i++) {
        var f = facilities[i];
        var buildingName = getFacilityBuildingName(f.buildingId);

        if (f.name.toLowerCase().includes(text) || buildingName.toLowerCase().includes(text)) {
            html += "<tr>";
            html += "<td>" + f.name + "</td>";
            html += "<td>" + buildingName + "</td>";
            html += "<td>" + f.openingHours + "</td>";
            html += '<td><span class="' + getFacilityStatusClass(f.status) + '">' + f.status + "</span></td>";
            html += '<td><a class="facilities-button facilities-button-small" href="facility-details.html?id=' + f.id + '">View</a></td>';
            html += "</tr>";
        }
    }

    if (html == "") {
        html = '<tr><td colspan="5" class="facilities-empty">No facilities found.</td></tr>';
    }

    facilitiesTable.innerHTML = html;
}

function showFacilityDetails() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var found = null;

    for (var i = 0; i < facilities.length; i++) {
        if (facilities[i].id == id) {
            found = facilities[i];
        }
    }

    if (found == null) {
        facilityDetailsBox.innerHTML = "<p>Facility not found.</p>";
        return;
    }

    var html = '<dl class="facilities-details">';
    html += "<dt>Facility Name</dt><dd>" + found.name + "</dd>";
    html += "<dt>Building</dt><dd>" + getFacilityBuildingName(found.buildingId) + "</dd>";
    html += "<dt>Description</dt><dd>" + found.description + "</dd>";
    html += "<dt>Opening Hours</dt><dd>" + found.openingHours + "</dd>";
    html += '<dt>Status</dt><dd><span class="' + getFacilityStatusClass(found.status) + '">' + found.status + "</span></dd>";
    html += "</dl>";

    if (found.reservable && found.status == "Open") {
        html += '<p><a class="facilities-button" href="make-reservation.html?facility=' + found.id + '">Make Reservation</a></p>';
    } else {
        html += '<p class="facilities-note">This facility cannot be reserved.</p>';
    }

    facilityDetailsBox.innerHTML = html;
}

function showFacilityMessage(text, type) {
    facilityMessage.textContent = text;
    facilityMessage.className = "facilities-message facilities-message-" + type;
}

function showFacilityManageTable() {
    var html = "";

    for (var i = 0; i < facilities.length; i++) {
        var f = facilities[i];
        var reservableText = "No";
        if (f.reservable) {
            reservableText = "Yes";
        }

        html += "<tr>";
        html += "<td>" + f.id + "</td>";
        html += "<td>" + f.name + "</td>";
        html += "<td>" + getFacilityBuildingName(f.buildingId) + "</td>";
        html += "<td>" + f.openingHours + "</td>";
        html += "<td>" + reservableText + "</td>";
        html += "<td>";
        html += "<select onchange=\"changeFacilityStatus('" + f.id + "', this.value)\">";
        for (var j = 0; j < facilityStatuses.length; j++) {
            var selected = "";
            if (facilityStatuses[j] == f.status) {
                selected = " selected";
            }
            html += '<option value="' + facilityStatuses[j] + '"' + selected + ">" + facilityStatuses[j] + "</option>";
        }
        html += "</select>";
        html += "</td>";
        html += '<td><div class="facilities-actions">';
        html += "<button class=\"facilities-button facilities-button-small\" onclick=\"editFacility('" + f.id + "')\">Edit</button>";
        html += "<button class=\"facilities-button facilities-button-danger facilities-button-small\" onclick=\"deleteFacility('" + f.id + "')\">Delete</button>";
        html += "</div></td>";
        html += "</tr>";
    }

    if (html == "") {
        html = '<tr><td colspan="7" class="facilities-empty">No facilities found.</td></tr>';
    }

    facilityManageTable.innerHTML = html;
}

function changeFacilityStatus(id, newStatus) {
    for (var i = 0; i < facilities.length; i++) {
        if (facilities[i].id == id) {
            facilities[i].status = newStatus;
        }
    }
    showFacilityManageTable();
    showFacilityMessage("Facility status updated.", "success");
}

function resetFacilityForm() {
    facilityForm.reset();
    facilityEditingId = "";
    facilityFormTitle.textContent = "Add Facility";
    document.getElementById("facilityId").value = "";
}

function editFacility(id) {
    for (var i = 0; i < facilities.length; i++) {
        if (facilities[i].id == id) {
            var f = facilities[i];
            document.getElementById("facilityId").value = f.id;
            document.getElementById("facilityName").value = f.name;
            document.getElementById("facilityBuilding").value = f.buildingId;
            document.getElementById("facilityHours").value = f.openingHours;
            document.getElementById("facilityStatus").value = f.status;
            if (f.reservable) { document.getElementById("facilityReservable").value = "yes"; } else { document.getElementById("facilityReservable").value = "no"; }
            document.getElementById("facilityDescription").value = f.description;
            facilityEditingId = f.id;
            facilityFormTitle.textContent = "Edit Facility";
            facilityMessage.className = "";
            facilityMessage.textContent = "";
        }
    }
}

function deleteFacility(id) {
    if (confirm("Delete facility " + id + "?")) {
        var newList = [];
        for (var i = 0; i < facilities.length; i++) {
            if (facilities[i].id != id) {
                newList.push(facilities[i]);
            }
        }
        facilities = newList;

        if (facilityEditingId == id) {
            resetFacilityForm();
        }

        showFacilityManageTable();
        showFacilityMessage("Facility deleted.", "success");
    }
}

if (facilitiesTable) {
    showFacilities();
    facilitySearch.addEventListener("input", showFacilities);
}

if (facilityDetailsBox) {
    showFacilityDetails();
}

if (facilityManageTable && facilityForm) {
    var facilityBuildingSelect = document.getElementById("facilityBuilding");
    for (var b = 0; b < buildings.length; b++) {
        var facilityOption = document.createElement("option");
        facilityOption.value = buildings[b].id;
        facilityOption.textContent = buildings[b].name;
        facilityBuildingSelect.appendChild(facilityOption);
    }

    var facilityStatusSelect = document.getElementById("facilityStatus");
    for (var s = 0; s < facilityStatuses.length; s++) {
        var statusOption = document.createElement("option");
        statusOption.value = facilityStatuses[s];
        statusOption.textContent = facilityStatuses[s];
        facilityStatusSelect.appendChild(statusOption);
    }

    showFacilityManageTable();

    facilityForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var name = document.getElementById("facilityName").value.trim();
        var buildingId = document.getElementById("facilityBuilding").value;
        var hours = document.getElementById("facilityHours").value.trim();
        var status = document.getElementById("facilityStatus").value;
        var reservable = document.getElementById("facilityReservable").value == "yes";
        var description = document.getElementById("facilityDescription").value.trim();

        if (name == "") {
            showFacilityMessage("Facility name is required.", "error");
            return;
        }

        if (buildingId == "") {
            showFacilityMessage("Please select a building.", "error");
            return;
        }

        if (hours == "") {
            showFacilityMessage("Opening hours are required.", "error");
            return;
        }

        if (facilityEditingId == "") {
            var newId = "F00" + facilityNextNumber;
            facilityNextNumber++;
            facilities.push({
                id: newId,
                name: name,
                buildingId: buildingId,
                description: description,
                openingHours: hours,
                status: status,
                reservable: reservable
            });
            showFacilityMessage("Facility added.", "success");
        } else {
            for (var i = 0; i < facilities.length; i++) {
                if (facilities[i].id == facilityEditingId) {
                    facilities[i].name = name;
                    facilities[i].buildingId = buildingId;
                    facilities[i].openingHours = hours;
                    facilities[i].status = status;
                    facilities[i].reservable = reservable;
                    facilities[i].description = description;
                }
            }
            showFacilityMessage("Facility updated.", "success");
        }

        resetFacilityForm();
        showFacilityManageTable();
    });

    document.getElementById("facilityCancelButton").addEventListener("click", function () {
        resetFacilityForm();
        facilityMessage.className = "";
        facilityMessage.textContent = "";
    });
}
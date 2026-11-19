const searchInput = document.getElementById("userSearch");
const roleFilter = document.getElementById("roleFilter");
const tableBody = document.getElementById("userTableBody");

const userModal = document.getElementById("userModal");
const closeModal = document.getElementById("closeModal");
const doneModal = document.getElementById("doneModal");

const viewButtons = document.querySelectorAll(".action-btn");

const addUserButton = document.querySelector(".page-heading .btn-primary");
const addUserModal = document.getElementById("addUserModal");
const closeAddModal = document.getElementById("closeAddModal");
const cancelAddUser = document.getElementById("cancelAddUser");
const addUserForm = document.getElementById("addUserForm");

function filterUsers(){
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedRole = roleFilter.value.toLowerCase();

    const rows = tableBody.querySelectorAll("tr");
    rows.forEach(row=>{
        const rowText = row.textContent.toLowerCase();
        const userRole = row.cells[2].textContent.toLowerCase();

        const matchesSearch = rowText.includes(searchValue);

        const matchesRole = selectedRole === "" || userRole === selectedRole;

        if(matchesSearch && matchesRole){
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });

}
searchInput.addEventListener("input", filterUsers);
roleFilter.addEventListener("change", filterUsers);

tableBody.addEventListener("click", function(event){

    if(event.target.classList.contains("action-btn")){

        const row = event.target.closest("tr");
        const cells = row.cells;

        document.getElementById("modalName").textContent = cells[0].textContent;
        document.getElementById("modalEmail").textContent = cells[1].textContent;
        document.getElementById("modalRole").textContent = cells[2].textContent;
        document.getElementById("modalDepartment").textContent = cells[3].textContent;
        document.getElementById("modalStatus").textContent = cells[4].textContent.trim();

        userModal.classList.add("show");
    }

});

function hideModal() {
    userModal.classList.remove("show");

}

closeModal.addEventListener("click", hideModal);
doneModal.addEventListener("click", hideModal);

userModal.addEventListener("click", function(event){
    if(event.target === userModal){
        hideModal();
    }
});


// Open Add User Modal
addUserButton.addEventListener("click", function(){
    addUserModal.classList.add("show");
});

// Close Add User Modal
function hideAddModal(){
    addUserModal.classList.remove("show");
}

closeAddModal.addEventListener("click", hideAddModal);
cancelAddUser.addEventListener("click", hideAddModal);

// Close when clicking outside
addUserModal.addEventListener("click", function(event){
    if(event.target === addUserModal){
        hideAddModal();
    }
});

// Add User to Table
addUserForm.addEventListener("submit", function(event){
    event.preventDefault();

    const name = document.getElementById("newUserName").value.trim();
    const email = document.getElementById("newUserEmail").value.trim();
    const role = document.getElementById("newUserRole").value;
    const department = document.getElementById("newUserDepartment").value.trim();
    const status = document.getElementById("newUserStatus").value;

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${name}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td>${department}</td>
        <td>
            <span class="status ${status.toLowerCase()}">
                ${status}
            </span>
        </td>
        <td><button class="action-btn">View</button></td>
    `;

    tableBody.appendChild(newRow);

    addUserForm.reset();
    hideAddModal();

    alert("User added successfully!");
});

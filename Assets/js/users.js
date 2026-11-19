const searchInput = document.getElementById("userSearch");
const roleFilter = document.getElementById("roleFilter");
const tableBody = document.getElementById("userTableBody");

const userModal = document.getElementById("userModal");
const closeModal = document.getElementById("closeModal");
const doneModal = document.getElementById("doneModal");

const viewButtons = document.querySelectorAll(".action-btn");

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

viewButtons.forEach(buttons => {
    buttons.addEventListener("click", function(){
        const row = this.closest("tr");
        const cells = row.cells;

        document.getElementById("modalName").textContent = cells[0].textContent;
        document.getElementById("modalEmail").textContent = cells[1].textContent;
        document.getElementById("modalRole").textContent = cells[2].textContent;
        document.getElementById("modalDepartment").textContent = cells[3].textContent;
        document.getElementById("modalStatus").textContent = cells[4].textContent;

        userModal.classList.add("show");
    });
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
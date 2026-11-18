const searchInput = document.getElementById("facilitySearch");
const buildingFilter = document.getElementById("buildingFilter");
const availabilityFilter = document.getElementById("availabilityFilter");
const cards = Array.from(document.querySelectorAll(".facility-card"));
const emptyMessage = document.getElementById("facilitiesEmpty");
const resultsText = document.getElementById("resultsText");

function filterFacilities() {
  const term = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(function(card) {
    const matches = card.dataset.search.includes(term)
      && (buildingFilter.value === "all" || card.dataset.building === buildingFilter.value)
      && (availabilityFilter.value === "all" || card.dataset.status === availabilityFilter.value);
    card.hidden = !matches;
    if (matches) visible++;
  });
  emptyMessage.hidden = visible !== 0;
  resultsText.textContent = "Showing " + visible + " of " + cards.length + " facilities";
}
searchInput.addEventListener("input", filterFacilities);
buildingFilter.addEventListener("change", filterFacilities);
availabilityFilter.addEventListener("change", filterFacilities);
document.getElementById("totalCount").textContent = String(cards.length).padStart(2, "0");
document.getElementById("availableCount").textContent = String(cards.filter(c => c.dataset.status === "available").length).padStart(2, "0");

const details = {
  library:["Central Library","Learning & Study","A quiet place for reading, individual study and academic resources.","Building A","08:00 AM – 08:00 PM","Available","Reading and study areas"],
  "computer-lab":["Computer Lab","Academic","Computer laboratory for practical classes and academic activities.","Building B","08:00 AM – 06:00 PM","Available","Computers and workstations"],
  "seminar-room":["Seminar Room","Meeting & Events","Room for academic presentations, seminars and group discussions.","Building C","09:00 AM – 05:00 PM","Unavailable","Presentation and meeting space"],
  "student-lounge":["Student Lounge","Student Space","A shared space for students to relax and spend time between classes.","Building A","08:00 AM – 07:00 PM","Available","Shared seating area"],
  "discussion-room":["Discussion Room","Study Space","A room for student group study, project meetings and discussions.","Building B","09:00 AM – 06:00 PM","Available","Group discussion space"],
  auditorium:["Auditorium","Events","Large venue for university events, ceremonies and student programs.","Building C","09:00 AM – 06:00 PM","Unavailable","Event and presentation venue"]
};
const modal = document.getElementById("facilityModal");
const fields = ["modalTitle","modalType","modalDescription","modalBuilding","modalHours","modalStatus","modalFeatures"];
document.querySelectorAll("[data-detail]").forEach(function(button) {
  button.addEventListener("click", function() {
    const item = details[button.dataset.detail];
    fields.forEach((id, index) => document.getElementById(id).textContent = item[index]);
    modal.hidden = false;
  });
});
function closeModal(){ modal.hidden = true; }
document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", event => { if(event.key === "Escape") closeModal(); });


const searchInput = document.getElementById("announcementSearch");
const categoryFilter = document.getElementById("categoryFilter");
const notificationPopover = document.getElementById("notificationPopover");
const announcementCards = document.querySelectorAll(".announcement-card");
const emptyMessage = document.getElementById("emptyMessage");
const notificationButton = document.getElementById("notificationButton");
const sidebar = document.getElementById("sidebar");

notificationButton.addEventListener("click", function () {
  const isHidden = notificationPopover.hidden;
  notificationPopover.hidden = !isHidden;
});

document.addEventListener("click", function (event) {
  const clickedNotification = notificationButton.contains(event.target);
  const clickedPopover = notificationPopover.contains(event.target);

  if (!clickedNotification && !clickedPopover) {
    notificationPopover.hidden = true;
  }
});
function filterAnnouncements() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    let visibleCount = 0;

    announcementCards.forEach(function (card) {
        const cardText = card.textContent.toLowerCase();
        const matchesSearch = cardText.includes(searchText);
        const matchesCategory = selectedCategory === "all" ||
            card.dataset.category === selectedCategory;

        card.hidden = !(matchesSearch && matchesCategory);
        if (!card.hidden) visibleCount++;
    });

    emptyMessage.hidden = visibleCount !== 0;
}

searchInput.addEventListener("input", filterAnnouncements);
categoryFilter.addEventListener("change", filterAnnouncements);

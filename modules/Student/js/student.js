// Student Dashboard interactions

const notificationButton = document.getElementById("notificationButton");
const notificationPopover = document.getElementById("notificationPopover");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

notificationButton.addEventListener("click", function () {
  const isHidden = notificationPopover.hidden;
  notificationPopover.hidden = !isHidden;
});

menuToggle.addEventListener("click", function () {
  sidebar.classList.toggle("open");
});

// Close the notification panel when clicking outside it.
document.addEventListener("click", function (event) {
  const clickedNotification = notificationButton.contains(event.target);
  const clickedPopover = notificationPopover.contains(event.target);

  if (!clickedNotification && !clickedPopover) {
    notificationPopover.hidden = true;
  }
});

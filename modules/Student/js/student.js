const notificationButton = document.getElementById("notificationButton");
const notificationPopover = document.getElementById("notificationPopover");
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

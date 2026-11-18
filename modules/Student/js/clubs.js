const clubSearch=document.getElementById("clubSearch");
const clubCategory=document.getElementById("clubCategory");
const clubCards=document.querySelectorAll(".club-card");
const clubsEmpty=document.getElementById("clubsEmpty");
const membershipCount=document.getElementById("membershipCount");

function filterClubs(){
  const term=clubSearch.value.trim().toLowerCase();
  const category=clubCategory.value;
  let visible=0;
  clubCards.forEach(card=>{
    const textMatch=card.dataset.name.includes(term)||card.textContent.toLowerCase().includes(term);
    const categoryMatch=category==="all"||card.dataset.category===category;
    card.hidden=!(textMatch&&categoryMatch);
    if(!card.hidden) visible++;
  });
  clubsEmpty.hidden=visible!==0;
}
function updateMembershipCount(){
  const count=document.querySelectorAll('.join-button[data-joined="true"]').length;
  membershipCount.textContent=String(count).padStart(2,"0");
}
clubSearch.addEventListener("input",filterClubs);
clubCategory.addEventListener("change",filterClubs);
document.querySelectorAll(".join-button").forEach(button=>{
  button.addEventListener("click",()=>{
    const joined=button.dataset.joined==="true";
    button.dataset.joined=String(!joined);
    button.classList.toggle("joined",!joined);
    button.textContent=joined?"Join Club":"Joined";
    updateMembershipCount();
  });
});
updateMembershipCount();

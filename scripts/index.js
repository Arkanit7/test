// DOM elements
const guideList = document.querySelector(".guides");

// toggle login and logout buttons

function toggleAuthButtons(user) {
  if (user) {
    document
      .querySelectorAll(".logged-out")
      .forEach((el) => el.classList.add("hidden"));
    document
      .querySelectorAll(".logged-in")
      .forEach((el) => el.classList.remove("hidden"));
    return;
  }
  document
    .querySelectorAll(".logged-out")
    .forEach((el) => el.classList.remove("hidden"));
  document
    .querySelectorAll(".logged-in")
    .forEach((el) => el.classList.add("hidden"));
}

//clear all guides

const clearAllGuides = () => {
  guideList.innerHTML = "";
};

const setupPlaceholderGuide = () => {
  guideList.innerHTML = '<h5 class="center-align">Login to view guides</h5>';
};

// setup a guide
const setupGuide = (doc) => {
  const guide = doc.data();
  const li = `
        <li data-id=${doc.id} >
          <div class="collapsible-header grey lighten-4"> ${guide.title} </div>
          <div class="collapsible-body white"> ${guide.content} </div>
        </li>
      `;
  guideList.insertAdjacentHTML("beforeend", li);
};

//remove a guide
const removeGuideNode = (id) => {
  guideList.querySelector(`[data-id=${id}]`)?.remove();
};

// listen to changes in the db and update them in the UI
function handleSnapshot(snapshot) {
  const changes = snapshot.docChanges();
  changes.forEach((change) => {
    console.log(change.type);
    if (change.type === "added") setupGuide(change.doc);
    if (change.type === "removed") removeGuideNode(change.doc.id);
  });
}

// recent account info
const accountModal = document.getElementById("modal-account");
function recentAccountInfo(user) {
  accountModal.querySelector(".account-details").innerText =
    "Email: " + user?.email;
  if (user) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        accountModal.querySelector(".account-extras").innerText =
          "Bio: " + doc.data()?.bio;
      });
    return;
  }
  accountModal.querySelector(".account-extras").innerText = "";
}

// setup materialize components
document.addEventListener("DOMContentLoaded", function () {
  var modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);

  var items = document.querySelectorAll(".collapsible");
  M.Collapsible.init(items);
});

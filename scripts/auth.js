// listen for auth status changes
let unsubscribe;
auth.onAuthStateChanged((user) => {
  toggleAuthButtons(user);
  if (user) {
    recentAccountInfo(user);

    clearAllGuides();
    unsubscribe = db.collection("guides").onSnapshot(handleSnapshot);
  } else {
    recentAccountInfo();

    unsubscribe && unsubscribe();
    clearAllGuides();
    setupPlaceholderGuide();
  }
});

// signup
const signupForm = document.querySelector("#signup-form");
signupForm
  .addEventListener("submit", (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;
    const bio = signupForm["signup-bio"].value;

    // sign up the user
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        return db.collection("users").doc(cred.user.uid).set({
          bio,
        });
      })
      .then(() => {
        // close the signup modal & reset form
        const modal = document.querySelector("#modal-signup");
        M.Modal.getInstance(modal).close();
        signupForm.reset();
      });
  });

// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});

// publish a new guide
const publishForm = document.querySelector("#create-form");

publishForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (publishForm.title.value === "" || publishForm.content.value === "")
    return;

  db.collection("guides")
    .add({
      title: publishForm.title.value,
      content: publishForm.content.value,
    })
    .then((resp) => {
      console.log(resp);
      //update visible data
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      publishForm.reset();
    })
    .catch((err) => {
      console.log(err);
    });
});

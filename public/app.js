import { getFirestore, collection, doc, getDocs, getDoc, setDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

const firebaseConfig = {
    apiKey: "AIzaSyAiEXI9oroiID2QnXJGOHMCLe-Y69nJk3I",
    authDomain: "event-management-5bf5c.firebaseapp.com",
    projectId: "event-management-5bf5c",
    storageBucket: "event-management-5bf5c.appspot.com",
    messagingSenderId: "853718735630",
    appId: "1:853718735630:web:d18e408398dc81aa12555f"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth()
let registrationNumber;
const navElement = document.getElementById('navbar')


document.addEventListener("DOMContentLoaded", async() => {
    console.log("DOM LOADED");
    const userStatus = sessionStorage.getItem("userLoggedIn")
    if (userStatus === 'true') {
        console.log("User is logged In");
        registrationNumber = sessionStorage.getItem("registrationNumber")
        const docRef = doc(db, "users", registrationNumber);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data()
        if (userData.role === 'admin') {
            console.log("user is Admin");
            navElement.removeChild(navElement.lastElementChild)
            navElement.innerHTML += `<li class="scroll-to-section"><a href="/add-event.html" class="active">Add Event</a></li>`
            navElement.innerHTML += `<li class="scroll-to-section"><button class="logout btn btn-danger" id="signoutbutton">Log Out</button></li>`
        } else {
            console.log("User is Not ADMIN");
            navElement.removeChild(navElement.lastElementChild)
            navElement.innerHTML += `<li class="scroll-to-section"><button class="logout btn btn-danger" id="signoutbutton">Log Out</button></li>`
        }
    } else {
        console.log("user is not logged in")
    }
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("fulltime", "desc"), limit(4));
    const eventSnapshot = await getDocs(q);
    document.getElementById("loading").remove()
    eventSnapshot.forEach((doc) => {
        const eventOutsideBox = document.getElementById("meeting-card-box")
        const eventData = doc.data()
        const codeBlock = `<div class="col-lg-6">
    <div class="meeting-item">
        <div class="thumb">
            <div class="price">
                <span></span>
            </div>
            <a href="meeting-details.html?id=${doc.id}"><img src="${eventData.image}" alt="Student Training"></a>
        </div>
        <div class="down-content">
            <div class="date">
                <h6>${eventData.dateMonth} <span>${eventData.dateDate}</span></h6>
            </div>
            <a href="meeting-details.html?id=${doc.id}">
                <h4>${eventData.name}</h4>
            </a>
            <p>${eventData.description}</p>
        </div>
    </div>
</div>
    `
        eventOutsideBox.innerHTML += codeBlock
    });

    document.getElementById('signoutbutton').addEventListener('click', async() => {
        sessionStorage.clear()
        window.location.reload()
    });
})

document.getElementById('signinbutton').addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(async(user) => {
            let email = user.user.email
            const permissible = email.split("@")
            if (permissible[1] === 'poornima.org') {
                // USER IS FROM POORNIMA
                const identifier = email.slice(0, 2);
                const name = user.user.displayName
                const photoURL = user.user.photoURL
                if (identifier === "20") {
                    // USER IS STUDENT
                    const role = "student"
                    const year = email.slice(0, 4)
                    const branch = email.slice(8, 10)
                    const checker = email.split("@")[0].slice(-3, -2)
                    if (isNaN(parseInt(checker)) === true) {
                        const regst = email.split("@")[0].slice(-2)
                        registrationNumber = `PIET${year.slice(2, 4)}${branch.toUpperCase()}0${regst}`
                    } else {
                        const regst = email.split("@")[0].slice(-3)
                        registrationNumber = `PIET${year.slice(2, 4)}${branch.toUpperCase()}${regst}`
                    }
                    console.log(registrationNumber);
                    const docRef = doc(db, "users", registrationNumber);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        // EXISTING USER LOGGED IN
                        sessionStorage.setItem("userLoggedIn", true);
                        sessionStorage.setItem("registrationNumber", registrationNumber);
                        navElement.removeChild(navElement.lastElementChild)
                        navElement.innerHTML += `<li class="scroll-to-section"><button class="logout btn btn-danger" id="signoutbutton">Log Out</button></li>`
                    } else {
                        // NEW USER CREATED
                        const userData = {
                            "name": name,
                            "email": email,
                            "photoURL": photoURL,
                            "branch": branch,
                            "year": year,
                            "registrationNumber": registrationNumber,
                            "role": role
                        }
                        await setDoc(doc(db, "users", registrationNumber), userData);
                        // NEW USER LOGGED IN
                        sessionStorage.setItem("userLoggedIn", true);
                        sessionStorage.setItem("registrationNumber", registrationNumber);
                        navElement.removeChild(navElement.lastElementChild)
                        navElement.innerHTML += `<li class="scroll-to-section"><button class="logout btn btn-danger" id="signoutbutton">Log Out</button></li>`
                    }
                } else {
                    const docIdentifier = user.user.email.split("@")[0]
                    const docRef = doc(db, "users", docIdentifier);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        // EXISTING USER LOGGED IN
                        console.log("User exists. Logging in Existing user");
                        sessionStorage.setItem("userLoggedIn", true);
                        sessionStorage.setItem("registrationNumber", docIdentifier);
                        navElement.removeChild(navElement.lastElementChild)
                        navElement.innerHTML += `<li class="scroll-to-section"><button class="logout btn btn-danger" id="signoutbutton">Log Out</button></li>`
                    } else {
                        console.log("User Does not exists");
                        const role = "faculty"
                        const userData = {
                            "name": name,
                            "email": email,
                            "photoURL": photoURL,
                            "role": role
                        }
                        await setDoc(doc(db, "users", docIdentifier), userData);
                        console.log("New User Created");
                        sessionStorage.setItem("userLoggedIn", true);
                        sessionStorage.setItem("registrationNumber", docIdentifier);
                        navElement.removeChild(navElement.lastElementChild)
                        navElement.innerHTML += `<li class="scroll-to-section"><button class="logout btn btn-danger" id="signoutbutton">Log Out</button></li>`
                    }
                    console.log("user is faculty");

                }
            } else {
                // USER IS NOT FROM POORNIMA
                alert("This portal is only for POORNIMA students")
            }
        })
        .catch((err) => {
            alert("Login Failed with error " + err)
            console.log(err);
        })
})
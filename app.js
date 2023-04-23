import { getFirestore, collection, doc, getDocs, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
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



document.addEventListener("DOMContentLoaded", async() => {
    console.log("DOM LOADED");

    if (sessionStorage.getItem('userLoggedIn')) {
        console.log("User Logged In");
    } else {
        console.log("User not Logged In");
    }

    const eventSnapshot = await getDocs(collection(db, "events"));
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
})

document.getElementById('signinbutton').addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(async(user) => {
            let email = user.user.email
            const permissible = email.split("@")
            if (permissible[1] === 'poornima.org') {
                console.log("user is from Poornima");
                const identifier = email.slice(0, 2);
                const name = user.user.displayName
                const photoURL = user.user.photoURL
                if (identifier === "20") {
                    console.log("user is student");
                    const role = "student"
                    const year = email.slice(0, 4)
                    const branch = email.slice(8, 10)
                    const checker = email.split("@")[0].slice(-3, -2)
                    let registrationNumber
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
                        sessionStorage.setItem("userLoggedIn", true);
                        sessionStorage.setItem("registrationNumber", registrationNumber);
                        console.log("Existing User Logged In");
                    } else {
                        console.log("New User Detected.");
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
                        console.log("user created successfully");
                        sessionStorage.setItem("userLoggedIn", true);
                        sessionStorage.setItem("registrationNumber", registrationNumber);
                        console.log("Session for new user started");
                    }
                } else {
                    const role = "faculty"
                    console.log("user is faculty");
                }
            } else {
                console.log("Access Denied");
            }
        })
        .catch((err) => {
            console.log(err);
        })
})
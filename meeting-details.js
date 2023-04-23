import { getFirestore, collection, updateDoc, doc, getDocs, arrayUnion, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";

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

let eventData;
let eventId;

document.addEventListener("DOMContentLoaded", async() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    eventId = params.id;

    const headerTitle = document.getElementById("header-title")
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        eventData = docSnap.data()
        headerTitle.innerText = eventData.name
        document.getElementById("date").innerHTML = `<h6>${eventData.dateMonth}<span>${eventData.dateDate}</span></h6>`
        document.getElementById("event-name").innerText = eventData.name
        document.getElementById("event-desc").innerText = eventData.description
        document.getElementById("header-img").setAttribute('src', eventData.image)
        eventData.hours.forEach((hour) => {
            document.getElementById('hours').innerHTML += `<p>${hour.dayFrom} - ${hour.dayTo}: ${hour.timeFrom} - ${hour.timeTo}<br></p>`
        })
        document.getElementById("event-location").innerText = eventData.location
    }
})

document.getElementById("register").addEventListener('click', async() => {
    const userStatus = sessionStorage.getItem("userLoggedIn")
    if (userStatus === 'true') {
        const registrationNumber = sessionStorage.getItem("registrationNumber")
        const userRef = doc(db, "users", registrationNumber);
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()
        if (userData.role === 'student') {
            const eventRef = doc(db, "events", eventId)
            await updateDoc(eventRef, {
                participants: arrayUnion(registrationNumber)
            })
        } else if (userData.role === 'faculty') {
            alert("Faculty cannot register for the event");
        }
    } else {
        alert("You Need to log in to register for this event")
        window.location = '/'
    }
})
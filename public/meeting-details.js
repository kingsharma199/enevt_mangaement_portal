import { getFirestore, collection, updateDoc, doc, getDocs, arrayUnion, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
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
const registerBtn = document.getElementById("register")
let eventId;
let participants;
let createdBy;
const userStatus = sessionStorage.getItem("userLoggedIn")
const registrationNumber = sessionStorage.getItem("registrationNumber")
let confirmbtn;


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
        participants = eventData.participants
        createdBy = eventData.createdBy
        headerTitle.innerText = eventData.name
        document.getElementById("date").innerHTML = `<h6>${eventData.dateMonth}<span>${eventData.dateDate}</span></h6>`
        document.getElementById("event-name").innerText = eventData.name
        document.getElementById("event-desc").innerText = eventData.description
        document.getElementById("header-img").setAttribute('src', eventData.image)
        eventData.hours.forEach((hour) => {
            document.getElementById('hours').innerHTML += `<p>${hour.dayFrom} - ${hour.dayTo}: ${hour.timeFrom} - ${hour.timeTo}<br></p>`
        })
        document.getElementById("event-location").innerText = eventData.location
        if (createdBy === registrationNumber) {
            document.getElementById('cta').innerHTML = `<h5>Edit This Event</h5>
            <button class="btn btn-danger w-50" id="delete">Delete</button><br>
            <button class="btn btn-warning w-50 text-light" id="view">View Participants</button>`
            document.getElementById('delete').addEventListener('click', async() => {
                confirmbtn = confirm("Are you sure you want to delete the event?")
                if (confirmbtn) {
                    await deleteDoc(doc(db, "events", eventId));
                    openModal()
                    document.getElementById("modal-body").innerHTML = `<h1 class='text-danger'>Event has been deleted</h1>`
                    window.location = '/'
                } else {
                    console.log("Delete Request denied");
                }
            })
            document.getElementById('view').addEventListener('click', async() => {
                openModal()
                document.getElementById("modal-body").innerHTML = ``
                participants.forEach((participant) => {
                    document.getElementById("modal-body").innerHTML += `<p class='text-dark'>• ${participant}</p>`
                })

            })
        } else {
            if (participants.includes(registrationNumber)) {
                registerBtn.disabled = true;
                registerBtn.classList.remove('btn-success')
                registerBtn.classList.add('btn-secondary')
                registerBtn.innerText = "Registered!"
            }
        }
    }
})

registerBtn.addEventListener('click', async() => {
    if (userStatus === 'true') {
        console.log(registrationNumber);
        const userRef = doc(db, "users", registrationNumber);
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()
        openModal()
        if (userData.role === 'student') {
            const eventRef = doc(db, "events", eventId)
            await updateDoc(eventRef, {
                participants: arrayUnion(registrationNumber)
            })
            document.getElementById("modal-body").innerHTML = `<h1 class='text-success'>You Have been Registered Successfully</h1>`
        } else if (userData.role === 'faculty') {
            document.getElementById("modal-body").innerHTML = `<h1 class='text-danger'>Faculty cannot register for the event</h1>`
                // window.location.reload()
        }
    } else {
        alert("You Need to log in to register for this event")
        window.location = '/'
    }
})

function openModal() {
    var myModal = new bootstrap.Modal(document.getElementById('spinnerModal'), { keyboard: false });
    myModal.show();
}

document.getElementById("modal-close").addEventListener('click', () => {
    window.location.reload()
})
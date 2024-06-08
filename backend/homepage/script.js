window.addEventListener("DOMContentLoaded", event=>{
    const firebaseConfig = {
        apiKey: "AIzaSyAaMTxvNNlPHtl7WopNGO5D9Y1SBQy1mLs",
        authDomain: "cbkweb.firebaseapp.com",
        databaseURL: "https://cbkweb-default-rtdb.firebaseio.com",
        projectId: "cbkweb",
        storageBucket: "cbkweb.appspot.com",
        messagingSenderId: "55316828481",
        appId: "1:55316828481:web:49bc6c3d9d6124b547d1c0",
        measurementId: "G-0M08JREZCC"
      };

    if (firebase.apps.length == 0) {
        console.log("initializing")
        firebase.initializeApp(firebaseConfig);
    }    
    const db = firebase.database();
    const auth = firebase.auth();
    
    const openInBrowser = document.getElementById("open")
    auth.onAuthStateChanged(function(user) {
        if (!user) {
            openInBrowser.addEventListener("click", event=>{
                window.location.assign("userportal/index.html")
            })
        } else {
            openInBrowser.innerHTML = "Open in browser"
            openInBrowser.addEventListener("click", event=>{
                window.location.assign("chat/index.html")
            })
        }
    });
      

})
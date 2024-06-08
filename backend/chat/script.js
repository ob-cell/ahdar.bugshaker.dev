document.addEventListener("DOMContentLoaded", function(){
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
        console.log("initializing");
        firebase.initializeApp(firebaseConfig);
    }
    
    const db = firebase.database();
    const auth = firebase.auth();
      
    auth.onAuthStateChanged(function(user) {
        if (!user) {
            window.location.href = "../index.html";
            console.log("Access Denied. Please login.");
        } else {
            track(user.uid)
            console.log("Access Granted.");
        }
    });
      
    function scrollToBottom() {
        var chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight;
        console.log(chat.scrollHeight);
        console.log(chat.clientHeight);
    }
      
    document.addEventListener("DOMContentLoaded", function() {
        scrollToBottom();
    });

    document.getElementById("send-message").addEventListener("submit", postChat);

    document.getElementById("chat-txt").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            postChat(e);
        }
    });

    function postChat(e) { 
        e.preventDefault();
        
        const timestamp = Date.now(); 
        const chatTxt = document.getElementById("chat-txt");
        const message = chatTxt.value; 
        chatTxt.value = ""; 
        const user = auth.currentUser;

        console.log("User ID:", user.uid);

        db.ref("users/" + user.uid).once("value")
            .then((snapshot) => {
                console.log("Snapshot:", snapshot);
                const userData = snapshot.val();
                console.log("User Data:", userData);
                if (userData && userData.username) {
                    const fullName = userData.username;
                    console.log("Full Name:", fullName);
                    db.ref("messages/" + timestamp).set({ 
                        usr: fullName,
                        msg: message,
                        uid: user.uid,
                    }); 
                } else {
                    console.error("User data not found or full_name is missing for UID:", user.uid);
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }
      
    const fetchChat = db.ref("messages/"); 
    fetchChat.on("child_added", function (snapshot) { 
        const messages = snapshot.val(); 
        const user = auth.currentUser;
        const isCurrentUser = user && user.uid === messages.uid;
        const msg = `
        <div class="chatbox__messages__user-message ${isCurrentUser ? 'current-user' : 'other-user'}">
          <div class="chatbox__messages__user-message--ind-message">
            <p class="name">${messages.usr}</p>
            <br/>
            <p class="message">${messages.msg}</p>
          </div>
        </div>`;
        document.querySelector(".chatbox__messages").innerHTML += msg;
        scrollToBottom();
    });



    var track = (userId) => {
        var userStatusDatabaseRef = firebase.database().ref('users/' + userId + '/status');
    
        var isOfflineForDatabase = {
            state: 'offline',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };
    
        var isOnlineForDatabase = {
            state: 'online',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };
    
        firebase.database().ref('.info/connected').on('value', function (snapshot) {
            if (snapshot.val() == false) {
                return;
            };
    
            userStatusDatabaseRef.onDisconnect().update(isOfflineForDatabase).then(function () {
                userStatusDatabaseRef.update(isOnlineForDatabase);
            });
        });
    
        checkOnline();
    };
    

    function checkOnline() {
        firebase.database().ref('/users/').orderByChild('state').equalTo("online").on("value", (data => {
            var liveVisitorCounter = data.numChildren();
            console.log(liveVisitorCounter);
            var root = document.getElementById('root');
            root.innerText = liveVisitorCounter;
      
        }))
    }
});
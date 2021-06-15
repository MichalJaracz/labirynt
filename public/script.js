const socket = io('/')

const form = document.getElementById('form');
const name = document.getElementById('name');

const nickForm = document.getElementById('nick');
const started = document.getElementById('startedContainer');
const waitingContainer = document.getElementById('waitingContainer');
const waitingContainer2 = document.getElementById('startedContainer2');
const waiting = document.getElementById('waiting');
const bt1 = document.getElementById("bt1")
const bt2 = document.getElementById("bt2")
const bt3 = document.getElementById("bt3")
const bt4 = document.getElementById("bt4")
const save = document.getElementById("save")
const btStart = document.getElementById("startGame")

let level
let userId
let boo

// User nick

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameValue = name.value;

    if (nameValue) {
        // we are connecting the socket

        socket.emit('new-user', nameValue)

        startGame();
    }
});

// choice level for first user
socket.on('two-users', users => {
    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify({ "nick": userId })
    fetch('/nick', { method: "post", headers: headers, body: body });
    if (users.length === 2 && userId === users[0].name) {
        changeLevel()
    } else if (users.length === 2 && userId === users[1].name) {
        waitingLevel()
    }
})

// BUTTONY!!
bt1.addEventListener('click', () => {
    level = 'level1'
})
bt2.addEventListener('click', () => {
    level = 'level2'
})
bt3.addEventListener('click', () => {
    level = 'level3'
})
bt4.addEventListener('click', () => {
    level = 'level4'
})

save.addEventListener('click', () => {
    boo = 'klik'
    if (level === 'level1') {
        socket.emit('level1', level)
    } else if (level === 'level2') {
        socket.emit('level2', level)
    } else if (level === 'level3') {
        socket.emit('level3', level)
    } else if (level === 'level4') {
        socket.emit('level4', level)
    }
    socket.emit('start-server', boo)
})

// staruje gre
socket.on('start-game-user2', users => {

    window.location.replace('/game')
})

// User disconnect
socket.on('user-disconnected', name => {
})

// This is Waitnig screen :D
function startGame() {
    nickForm.classList.add('hidden');
    waitingContainer.classList.remove('hidden');

    socket.on('user-connected', name => {
        userId = name
        waiting.innerHTML = `Cześć ${name}, jesteś w fazie czekania`
    })
}


// This is change level for first user
function changeLevel() {
    waitingContainer.classList.add('hidden');
    started.classList.remove('hidden');
}

function waitingLevel() {
    waitingContainer.classList.add('hidden');
    waitingContainer2.classList.remove('hidden');
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

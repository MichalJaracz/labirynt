const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Datastore = require('nedb')



const publicPath = path.join(__dirname, './public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(cors())
app.use(express.json())
app.use(express.static('public', path));
app.use(express.static('public/dist', path));
app.use(express.static('public/image', path));
app.use(session({
    secret: 'txt',
    resave: false,
    saveUninitialized: true
}))
app.use(cookieParser())


var users = []
let level
let winner
let obj = {}
let baza = true
let save = true
let levelArr1 = []
let levelArr2 = []
let levelArr3 = []
let levelArr4 = []

io.on('connection', socket => {
    socket.join('room')
    socket.on('new-user', name => {
        ob = {
            id: socket.id,
            name: name
        }
        users.push(ob)
        socket.emit('user-connected', name)
        io.to('room').emit('two-users', users)
    })

    socket.on('level1', data => {
        level = data
    })
    socket.on('level2', data => {
        level = data
    })
    socket.on('level3', data => {
        level = data
    })
    socket.on('level4', data => {
        level = data
    })

    socket.on('start-server', data => {
        io.to('room').emit('start-game-user2', users)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })

    socket.on('user-nick', data => {
        if (users[0].name === data) {
        } else if (users[1].name === data) {
        }
        // io.to('room').emit('start-game-user2', users)
    })
    // socket.on('alert', data => {
    //     winner = data
    //     io.to('room').emit('end-point', data)
    // })
    socket.on('nickname-time-level', data => {
        obj = data
        io.to('room').emit('end-point', data)
    })
})

app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
})
app.get("/level", (req, res) => {
    baza = true
    save = true
    let json = { "level": level }
    res.json(json)
})
app.get('/end', (req, res) => {
    users = []
    strona = '<html><head><style>body{ background-image: url("./image/2.jpg"); background-size: 100vw 100vh; }a:link,a:visited {color: #FCD34D;text-decoration: none;cursor: auto;font-size: 25pt;}a:link:active,a:visited:active {color: #FCD34D;font-size: 25pt;} h1 {color: #FCD34D;font-size: 50pt;} #main {position: absolute;top: 200px; width: 100%;text-align: center;}</style></head><body><div id="main"><h1>Wygrał gracz: ' + obj.nickname + ' o czasie: ' + obj.time + '</h1><a href="/toplist">TOP SCORES</a></br><a href="/">wybór lvl\'a</a></div></body></html>'
    var tabpom = []
    var coll1 = new Datastore({
        filename: 'kolekcja.db',
        autoload: true
    });

    if (baza) {
        baza = false
        coll1.insert(obj, function (err, newDoc) {
        });
    }

    res.send(strona)

})
app.get("/toplist", (req, res) => {
    strona2 = '<html><head><style>.level {}b {}a:link,a:visited {color: #FCD34D;text-decoration: none;cursor: auto;font-size: 25pt; margin-left:330;}a:link:active,a:visited:active {color: #FCD34D;font-size: 25pt;}body{ display: flex;justify-content: center;align-items: center;background-image: url("./image/2.jpg"); background-size: 100vw 100vh; opacity: 0.85;}h1 {color: #FCD34D;font-size: 50pt;order: 1;} #main {position: absolute;top: 200px;width: 100%;text-align: center;}.main1 {display: flex;width: 800px;height: 400px;flex-wrap: wrap;}.main2 {display: flex;justify-content: center;align-items: center;width: 800px;height: 200px;}.main {display: flex;margin: center;order: 2; height: 200px;}.div {font-family: "comic sans ms";background-color:rgba(202, 0, 240, 0.3); margin-top: 20px;border: 1px solid #FCD34D;height: 200px;width: 200px;}.level {text-align: center;width: 200px;height: 20px;}.levels {width: 200px; height: 180px;}</style></head><body><div class="main1"><div class="main2"><h1>Top List</h1></div><div class="main"><div class="div"><div class="level"><b>Level 1</b></div>'
    var coll1 = new Datastore({
        filename: 'kolekcja.db',
        autoload: true
    });

    coll1.find({}, function (err, docs) {
        let levelArr1 = []
        let levelArr2 = []
        let levelArr3 = []
        let levelArr4 = []
        for (let i = 0; i < docs.length; i++) {
            if (docs[i].level === 'level1') {
                levelArr1.push(docs[i])
            }
            else if (docs[i].level === 'level2') {
                levelArr2.push(docs[i])
            }
            else if (docs[i].level === 'level3') {
                levelArr3.push(docs[i])
            }
            else if (docs[i].level === 'level4') {
                levelArr4.push(docs[i])
            }
        }
        levelArr1.sort((a, b) => {
            if (a.time > b.time) {
                return 1
            } else {
                return - 1
            }

        })
        levelArr2.sort((a, b) => {
            if (a.time > b.time) {
                return 1
            } else {
                return - 1
            }

        })
        levelArr3.sort((a, b) => {
            if (a.time > b.time) {
                return 1
            } else {
                return - 1
            }

        })
        levelArr4.sort((a, b) => {
            if (a.time > b.time) {
                return 1
            } else {
                return - 1
            }

        })
        for (let i = 0; i < levelArr1.length; i++) {
            if (i === 0) {
                strona2 += `<b>${levelArr1[i].nickname}: ${levelArr1[i].time}</b></br>`
            } else {
                strona2 += `${levelArr1[i].nickname}: ${levelArr1[i].time}</br>`
            }
        }
        strona2 += '</div><div class="div"><div class="level"><b>Level 2</b></div>'
        for (let i = 0; i < levelArr2.length; i++) {
            if (i === 0) {
                strona2 += `<b>${levelArr2[i].nickname}: ${levelArr2[i].time}</b></br>`
            } else {
                strona2 += `${levelArr2[i].nickname}: ${levelArr2[i].time}</br>`
            }
        }
        strona2 += '</div><div class="div"><div class="level"><b>Level 3</b></div>'
        for (let i = 0; i < levelArr3.length; i++) {
            if (i === 0) {
                strona2 += `<b>${levelArr3[i].nickname}: ${levelArr3[i].time}</b></br>`
            } else {
                strona2 += `${levelArr3[i].nickname}: ${levelArr3[i].time}</br>`
            }
        }
        strona2 += '</div><div class="div"><div class="level"><b>Level 4</b></div>'
        for (let i = 0; i < levelArr4.length; i++) {
            if (i === 0) {
                strona2 += `<b>${levelArr4[i].nickname}: ${levelArr4[i].time}</b></br>`
            } else {
                strona2 += `${levelArr4[i].nickname}: ${levelArr4[i].time}</br>`
            }
        }
        strona2 += '</div></div><a href="/">Wybór lvl</a></div></body></html>'

        res.send(strona2)
    })
})
app.get("*.js", function (req, res) {
    res.sendFile(__dirname + "/" + req.url)
})
app.get("/game", (req, res) => {
    res.sendFile(path.join(publicPath, 'dist/game.html'));
})
app.post("/nick", (req, res) => {
    req.session.nick = req.body.nick
    req.session.save
    res.send(JSON.stringify(req.session.nick))
})
app.get("/dajminick", (req, res) => {
    res.send(JSON.stringify(req.session.nick))
})
server.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
});
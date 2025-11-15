let ws;
const chat = document.getElementById("chat");
const playersBox = document.getElementById("players");
const voteBox = document.getElementById("voteBox");

function logChat(msg) {
    chat.innerHTML += msg + "<br>";
    chat.scrollTop = chat.scrollHeight;
}

document.getElementById("connect").onclick = () => {
    let name = document.getElementById("name").value;
    let room = document.getElementById("room").value;

    ws = new WebSocket(`ws://${location.host}/ws?name=${name}&room=${room}`);

    ws.onopen = () => logChat("Connected.");

    ws.onmessage = e => {
        const msg = JSON.parse(e.data);

        if (msg.type === "room_update") {
            renderPlayers(msg.data);
        }

        if (msg.type === "game_start") {
            alert("Game Started! Roles Assigned.");
            renderPlayers(msg.data);
        }

        if (msg.type === "start_vote") {
            renderVoteUI(msg.data);
        }

        if (msg.type === "vote_result") {
            alert("Player eliminated: " + msg.data);
            voteBox.innerHTML = "";
        }
    };
};

document.getElementById("sendChat").onclick = () => {
    ws.send(JSON.stringify({
        type: "chat",
        data: { text: document.getElementById("chatInput").value }
    }));
};

document.getElementById("startGame").onclick = () => {
    ws.send(JSON.stringify({ type: "start_game" }));
};

document.getElementById("startVote").onclick = () => {
    ws.send(JSON.stringify({ type: "start_vote" }));
};

function renderPlayers(players) {
    playersBox.innerHTML = "";
    Object.values(players).forEach(p => {
        playersBox.innerHTML += `${p.Name} — ${p.Role || "?"} — ${p.Alive ? "Alive" : "Dead"}<br>`;
    });
}

function renderVoteUI(players) {
    voteBox.innerHTML = "<h3>Vote Player:</h3>";

    Object.values(players).forEach(p => {
        if (p.Alive)
            voteBox.innerHTML += `<button onclick="vote('${p.Name}')">${p.Name}</button> `;
    });
}

function vote(name) {
    ws.send(JSON.stringify({
        type: "vote",
        from: document.getElementById("name").value,
        data: { target: name }
    }));
    voteBox.innerHTML = "Vote submitted.";
}

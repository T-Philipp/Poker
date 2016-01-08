# Servereinrichtung
* nodeJS installieren
* npm update -g
* npm install socket.io -g
* npm install forever -g

# Initiales Holen
* git clone https://github.com/Pfilop/Poker.git
* cd Poker
* npm install

# Server starten
* forever start srv/server.js
* http://HOST:8989

# Neue Version ziehen
* forever stopall
* git checkout config.json
* git pull
* forever start srv/server.js
let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var readline = require("readline");
 
//Read terminal Lines
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Constant
var GET_MESSAGES_INTERVAL = 500;
 
//Load the protobuf
var proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);
 
const REMOTE_SERVER = "35.189.80.78:8080";
 
//Create gRPC client
let client = new proto.example.Chat(
  REMOTE_SERVER,
  grpc.credentials.createInsecure()
);

/*
//Global Variables
var username;
var timeoutId;

//Get random userneam first
client.login({username: ""}, function(err, response){
   if (err){
       console.log("Error login in");
   }  else {
       if (response.success == false){
           console.log("Error login in");
       } else {
           console.log("Welcome to GRPC Chat");
           console.log("===============================================");
           console.log("Command List:");
           console.log("/JOIN <channel name>: Join channel");
           console.log("/LEAVE <channel name>: Leave channel");
           console.log("/NICK <your nick>: Change your nick name. Note: Everytime you change your nick, you must rejoin your subscribed channel");
           console.log("/EXIT: Exit from application");
           console.log('');
           console.log('To send message:');
           console.log("@<channel name>: Send message to a channel");
           console.log("To broadcast to all channel you have joined, just type your message and press enter");
           console.log("===============================================");
           console.log("You are logged in as " + response.username);
           console.log("");
           username = response.username;
           timeoutId = setTimeout(getMessages, GET_MESSAGES_INTERVAL);
           readCommand();
       }
   }
});

//Register event on user input, and process it
function readCommand(){
    rl.on('line', function(line){
        //Process command

        //Join Channel
        if (line.indexOf('/JOIN') == 0){
            client.join({username : username, channel : line.substr(6)}, function (err, response) {
                if (err){
                    console.log("Failed to join channel");
                } else{
                    if (response.success == false){
                        console.log("Failed to join channel");
                    } else {
                        console.log("Success joining channel");
                    }
                }
            });
        //Leave channel
        } else if (line.indexOf('/LEAVE') == 0){
            var channel = line.substr(7);
            if (channel == ''){
                return;
            }
            client.leave({username : username, channel : line.substr(7)}, function (err, response) {
                if (err){
                    console.log("Failed to leave channel");
                } else{
                    if (response.success == false){
                        console.log("Failed to leave channel");
                    } else {
                        console.log("Success leaving channel");
                    }
                }
            });
            console.log("Leaving channel");
        //Change nikcname
        } else if (line.indexOf('/NICK') == 0){
            client.login({username: line.substr(6)}, function(err, response){
                if (err){
                    console.log("Error login in");
                }  else {
                    if (response.success == false){
                        console.log("Error login in");
                    } else {
                        console.log("Welcome, " + response.username);
                        username = response.username;
                    }
                }
            });
        //Send message to a channel
        } else if (line.indexOf('@') == 0){
            var i = line.indexOf(' ');
            var channel = line.substr(1, i - 1);
            var msg = line.substr(i + 1);

            client.sendMessage({username: username, channel: channel, msg: msg}, function(err, response){
                if (err){
                    console.log("Connection error");
                }  else {
                    if (response.success == false){
                        console.log("Error sending message");
                    } else {
                        console.log("Message sent");
                    }
                }
            });
        //Exit from application
        } else if (line.indexOf('/EXIT') == 0){
            rl.close();
            clearTimeout(timeoutId);
            process.exit();
        //Broadcast message
        } else {
            client.broadcastMessage({username : username, msg : line}, function (err, response) {
                if (err){
                    console.log("Connection error");
                } else {
                    console.log("Message sent");
                }
            });
        }
    });
}

//Retreive message every interval from server
function getMessages(){
    client.getMessages({username: username}, function(err, response){
        if (err){
            console.log("Failed to connect to server");
            process.exit()
        } else {
            for (var i = 0; i < response.messages.length; i++) {
                console.log(response.messages[i]);
            }

            timeoutId = setTimeout(getMessages, GET_MESSAGES_INTERVAL);
        }
    });
}
*/
let username;

//Start the stream between server and client
function startChat() {
    let channel = client.join({ user: username });
   
    channel.on("data", onData);
   
    rl.on("line", function(text) {
      client.send({ user: username, text: text }, res => {});
    });
  }
   
  //When server send a message
  function onData(message) {
    if (message.user == username) {
      return;
    }
    console.log(`${message.user}: ${message.text}`);
  }
   
  //Ask user name then start the chat
  rl.question("What's ur name? ", answer => {
    username = answer;
   
    startChat();
  });
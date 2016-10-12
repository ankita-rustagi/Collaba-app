// 'use strict';
// const angular = require('angular');
// const uiRouter = require('angular-ui-router');
// import routes from './chat.routes';
//
// export class ChatComponent {
//   teams = [];             //Store list of teams in which this user is a member
//   channels = [];          //List of channels  in which this user is a member
//   channelId = '';         //User is active in which channel
//   channelName = '';       //Store channel name
//   chatHistory = [];       //Store chat history of user
//   id = '';                //Strore id of user
//   userName = '';          //store name of user
//   teamChannels = {};      // To store channel for each team
//   teamAdmin = false;
//
//   /*@ngInject*/
//   constructor(socket, $http, Auth, Notification) {
//     this.socket = socket;  //This service is used to emit and receive socket
//     this.Auth = Auth;      //This serevice contain auth related functions
//     this.$http = $http;    //This service is used to send and retrieve data from server
//     this.Notification=Notification;
//   }
//
//   //On intializing the controller
//   $onInit() {
//     this.team_admin = false;
//     //Get user Info, Organisations, Teams and channels
//     this.Auth.getCurrentUser()
//     .then(currentUser => {
//       this.id = currentUser._id;
//       this.$http.get('/api/users/getUserInfo/' + this.id)
//       .then(response => {
//         if(response.data.role == 'team_admin'){
//           this.team_admin = true;
//         }
//         this.userName = response.data.name;
//         console.log("response data: "+JSON.stringify(response.data));
//         this.teams = response.data.teams;
//         for (var i = 0; i < response.data.teams.length; i++) {
//           this.teamChannels[response.data.teams[i]._id] = [];
//         }
//         console.log("teamChannels 1: "+JSON.stringify(this.teamChannels));
//         for (var i = 0; i < response.data.channels.length; i++) {
//           this.teamChannels[response.data.channels[i].team._id].push(response.data.channels[i]);
//           this.socket.room(response.data.channels[i]._id);
//         }
//         console.log("teamChannels: "+JSON.stringify(this.teamChannels));
//
//         var tempId = response.data.teams[0]._id;
//         console.log("default channel: "+JSON.stringify(this.teamChannels[tempId][0]));
//         console.log("temp id: "+tempId);
//         this.channelId = this.teamChannels[tempId][0]._id;
//         this.channelName = this.teamChannels[tempId][0].name;
//         console.log("channelId: "+this.channelId);
//         console.log("channelName: "+this.channelName);
//         //Set history in the chatHistory array coming from the api
//         for (var i = 0; i < response.data.channels.length; i++) {
//           if(response.data.channels[i]._id==this.channelId){
//             if (response.data.channels[i].history.length != 0) {
//               for (var j = 0; j < response.data.channels[i].history.length; j++) {
//                 this.chatHistory.unshift({
//                   sender: response.data.channels[i].history[j].user,
//                   message: response.data.channels[i].history[j].message
//                 });
//               }
//             }
//           }
//           console.log("channel history: "+this.chatHistory);
//         }
//
//       });
//
//       this.socket.syncUpdatesChats(data => {        //Updating chat messages when new message is set on the room
//         if(data.room==this.channelId){
//           this.chatHistory.unshift({
//             sender: data.sender,
//             message: data.message
//           });
//         }else{
//           this.Notification.primary('New Message on channel '+data.channelName);
//         }
//
//       });
//     });
//   }
//
//
//   // On changing channel, click method
//   channelClick(channel) {
//
//     this.chatHistory = [];                                                      //Empty the chat history
//     this.channelId = channel._id;
//     this.channelName = channel.name;
//     console.log("name: "+this.channelName);                                     //Set new channelId in the current scope                                           //Set new chat room on the server side
//
//     this.$http.get('/api/users/getChannelInfo/' + this.id + "/" + this.channelId) //Hit the api to get chat history for current channel id
//     .then(response => {
//       console.log("channel: " + this.channelId);
//       console.log(response.data);
//
//       if (response.data.history.length != 0) {                                   //Set history in the chatHistory array coming from the api
//         for (var i = 0; i < response.data.history.length; i++) {
//           this.chatHistory.push({
//             sender: response.data.history[i].user,
//             message: response.data.history[i].message
//           });
//         }
//       }
//     });
//   }
//
//   sendMessage() {
//
//     if (this.message) {
//       var msg=this.message;                                            //If the input field is not empty
//       //Empty the input field
//       this.message = '';
//       this.$http.post('/api/users/saveMessage/' + this.channelId, {       //Hit api to update chat history in the db
//         data: {
//           'user': this.userName,
//           'message': msg,
//           'type': 'text'
//         }
//       })
//       .then(response => {
//         console.log(response.data);
//         if(response.data=='Success'){
//           this.socket.sendMessage({                                           //Emit the socket with senderName, message and channelId
//             'sender': this.userName,
//             'message': msg,
//             'room': this.channelId,
//             'channelName':this.channelName
//           })
//         }else{
//           alert("Message not sent");
//         }
//
//       });
//     }
//   }
// }
//
// export default angular.module('yoCollabaApp.chat', [uiRouter,'ui-notification'])
// .config(routes)
// .component('chat', {
//   template: require('./chat.html'),
//   controller: ChatComponent,
//   controllerAs: 'chatCtrl'
// })
// .name;




'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routes from './chat.routes';

export class ChatComponent {
  teams = [];             //Store list of teams in which this user is a member
  channels = [];          //List of channels  in which this user is a member
  channelId = '';         //User is active in which channel
  channelName = '';       //Store channel name
  chatHistory = [];       //Store chat history of user
  id = '';                //Strore id of user
  userName = '';          //store name of user
  teamChannels = {};      // To store channel for each team

  /*@ngInject*/
  constructor(socket, $http, Auth, Notification) {
    this.socket = socket;  //This service is used to emit and receive socket
    this.Auth = Auth;      //This serevice contain auth related functions
    this.$http = $http;    //This service is used to send and retrieve data from server
    this.Notification=Notification;
  }

  //On intializing the controller
  $onInit() {

    this.Auth.getCurrentUser()
    .then(currentUser => {
      this.id = currentUser._id;
      //Get user Info, Organisations, Teams and channels
      this.$http.get('/api/users/getUserInfo/' + this.id)
      .then(response => {
        //Set user name
        this.userName = response.data.name;
       //  console.log("response data: "+JSON.stringify(response.data));
        //Set all teams in array
        this.teams = response.data.teams;

        for (var i = 0; i < response.data.teams.length; i++) {
          this.teamChannels[response.data.teams[i]._id] = [];
          //Set Team Role of the user for each team
          var teamrole="";
          for (var j = 0; j < response.data.teams[i].members.length; j++) {
              if(this.id==response.data.teams[i].members[j].member){
                teamrole=response.data.teams[i].members[j].role;
              }
          }
          this.teams[i]['teamRole']=teamrole;
        }
        console.log(JSON.stringify(this.teams));

        //push channels to corresponding team id
        for (var i = 0; i < response.data.channels.length; i++) {
          this.teamChannels[response.data.channels[i].team._id].push(response.data.channels[i]);
          //Join room for each channelId
          this.socket.room(response.data.channels[i]._id);
        }

        //Get teamId for 1st team in teams array
        var tempId = response.data.teams[0]._id;
        //Set channelId and channelName default
        this.channelId = this.teamChannels[tempId][0]._id;
        this.channelName = this.teamChannels[tempId][0].name;

        //Set history in the chatHistory array coming from the api for the first channel
        for (var i = 0; i < response.data.channels.length; i++) {
          if(response.data.channels[i]._id==this.channelId){
            if (response.data.channels[i].history.length != 0) {
              for (var j = 0; j < response.data.channels[i].history.length; j++) {
                this.chatHistory.unshift({
                  sender: response.data.channels[i].history[j].user,
                  message: response.data.channels[i].history[j].message
                });
              }
            }
          }

        }

      });

      //Updating chat messages when new message is set on the room
      this.socket.syncUpdatesChats(data => {
        if(data.room==this.channelId){
          this.chatHistory.unshift({
            sender: data.sender,
            message: data.message
          });
        }else{
          this.Notification.primary('New Message on channel '+data.channelName);
        }

      });
    });
  }


  // On changing channel, click method
  channelClick(channel) {
    //Empty the chat history
    this.chatHistory = [];
    //Set new channelId in the current scope
    this.channelId = channel._id;
    this.channelName = channel.name;

    //Hit the api to get chat history for current channel id
    this.$http.get('/api/users/getChannelInfo/' + this.id + "/" + this.channelId)
    .then(response => {
      console.log("channel: " + this.channelId);
      console.log(response.data);
      //Set history in the chatHistory array coming from the api for current channel
      if (response.data.history.length != 0) {
        for (var i = 0; i < response.data.history.length; i++) {
          this.chatHistory.push({
            sender: response.data.history[i].user,
            message: response.data.history[i].message
          });
        }
      }
    });
  }

  sendMessage() {
    //If the input field is not empty
    if (this.message) {
      var msg=this.message;
      //Empty the input field
      this.message = '';
      //Hit api to update chat history in the db
      this.$http.post('/api/users/saveMessage/' + this.channelId, {
        data: {
          'user': this.userName,
          'message': msg,
          'type': 'text'
        }
      })
      .then(response => {
        console.log(response.data);
        if(response.data=='Success'){
           //Emit the socket with senderName, message and channelId
          this.socket.sendMessage({
            'sender': this.userName,
            'message': msg,
            'room': this.channelId,
            'channelName':this.channelName
          })
        }else{
          alert("Message not sent");
        }

      });
    }
  }

}

export default angular.module('yoCollabaApp.chat', [uiRouter,'ui-notification'])
.config(routes)
.component('chat', {
  template: require('./chat.html'),
  controller: ChatComponent,
  controllerAs: 'chatCtrl'
})
.name;

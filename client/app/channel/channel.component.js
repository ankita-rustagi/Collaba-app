'use strict';
const angular = require('angular');
const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');
const ngSanitize = require('angular-sanitize');
const ngAnimate = require('angular-animate');
import routes from './channel.routes';

export class ChannelComponent {
  /*@ngInject*/
  constructor($http, Auth) {
    this.$http = $http;
    this.Auth = Auth;
  }

  $onInit(){
    this.Auth.getCurrentUser()
    .then(currentUser => {
      this.id = currentUser._id;
      //Get user Info, Organisations, Teams and channels
      this.$http.get('/api/users/getUserInfo/' + this.id)
      .then(response => {
        console.log("response data: "+JSON.stringify(response.data));
        //Set user name
        this.userName = response.data.name;
        //  console.log("response data: "+JSON.stringify(response.data));
        //Set all teams in array
        this.teams = response.data.teams;
        console.log("teams: "+JSON.stringify(this.teams));
      });
    });
  }
}

export default angular.module('channel', [uiRouter,uiBootstrap,ngAnimate,ngSanitize])
.config(routes)
.component('channel', {
  template: require('./channel.html'),
  controller: ChannelComponent,
  controllerAs: 'channelCtrl'
})
.name;

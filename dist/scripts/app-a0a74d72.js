(function(){angular.module("jkbx",["ngAnimate","ngCookies","ngTouch","ngSanitize","ui.router","firebase","youtube-embed"]).config(["$stateProvider","$urlRouterProvider",function(a,e){return a.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"}).state("party",{url:"/party/:name",templateUrl:"app/party/party.html",controller:"PartyCtrl"}).state("player",{url:"/party/:name/player",templateUrl:"app/player/player.html",controller:"PlayerCtrl"}),e.otherwise("/")}])}).call(this),function(){angular.module("jkbx").controller("NavbarCtrl",["$scope",function(a){return a.date=new Date}])}.call(this),function(){angular.module("jkbx").controller("PlayerCtrl",["$scope","$stateParams","$firebaseArray","$timeout",function(a,e,t){var r;return r=new Firebase("https://jkbx.firebaseio.com/party/"+e.name+"/tracks"),a.tracks=t(r),a.playerHeight=window.innerHeight,a.playerWidth=window.innerWidth,a.index=0,a.tracks.$loaded().then(function(){return a.playing=a.tracks[0]}),a.$on("youtube.player.ready",function(e,t){return a.playing.playing=!0,a.tracks.$save(a.playing),t.playVideo()}),a.$on("youtube.player.ended",function(){return a.playing.playing=!1,a.tracks.$save(a.playing),a.index+=1,a.playing=a.tracks[a.index]})}])}.call(this),function(){angular.module("jkbx").controller("PartyCtrl",["$scope","$stateParams","$firebaseArray",function(a,e,t){var r;return r=new Firebase("https://jkbx.firebaseio.com/party/"+e.name+"/tracks"),a.party=e.name,a.newTrack={},a.tracks=t(r),a.loadingTracks=!0,a.tracks.$loaded().then(function(){return a.loadingTracks=!1}),a.addTrack=function(e){return a.tracks.$add({img:e.snippet.thumbnails["default"].url,title:e.snippet.title,videoId:e.id.videoId,playing:!1}),a.newTrack.name=""},a.$watch("newTrack.name",function(e){if(e&&0!==e.length){if(e===a.newTrack.name)return a.searchForVideos()}else a.results={}}),a.searchForVideos=function(){var e;return a.newTrack.name.length>3?(e=gapi.client.youtube.search.list({q:a.newTrack.name,part:"snippet",type:"video"}),e.execute(function(e){return a.$apply(function(){return a.results=e.result.items,console.log(a.results)})})):void 0}}])}.call(this),function(){angular.module("jkbx").controller("MainCtrl",["$scope",function(){return console.log("luh")}])}.call(this),angular.module("jkbx").run(["$templateCache",function(a){a.put("app/components/navbar/navbar.html",'<nav class="navbar" ng-controller="NavbarCtrl"><a href="https://github.com/Swiip/generator-gulp-angular">Gulp Angular</a><ul><li class="active"><a ng-href="#">Home</a></li><li><a ng-href="#">About</a></li><li><a ng-href="#">Contact</a></li></ul><ul><li><a ng-href="#">Current date: {{ date | date:\'yyyy-MM-dd\' }}</a></li></ul></nav>'),a.put("app/party/party.html",'<div class="container"><div class="party-page"><br><br><form name="form"><div class="row"><div class="six columns search"><input type="text" ng-model="newTrack.name" ng-model-options="{debounce: 800}" placeholder="Try searching for a song.." class="search-bar u-full-width"><ul ng-if="results.length &gt; 1" class="search-results"><li ng-repeat="result in results" ng-click="addTrack(result)"><div class="image-holder"><img src="{{result.snippet.thumbnails.default.url}}"></div><p class="metadata"><strong>{{result.snippet.title}}</strong>\' ({{result.snippet.channelTitle}})</p></li></ul></div></div><div class="row"><div class="three columns"><a ui-sref="player({name: party})" class="u-full-width button">Open Player</a></div><div class="three columns"><button type="submit" class="button-primary u-full-width">Add track to queue</button></div></div></form><div ng-if="loadingTracks"><h1>Gimme a sec to get the tracks...</h1></div><div ng-if="tracks.length &lt; 1 &amp;&amp; !loadingTracks"><h1>Nothing to see here.</h1><h4>Try adding a track!</h4></div><div ng-if="tracks.length &gt;= 1 &amp;&amp; !loadingTracks"><div class="row"><h6>Queued Tracks</h6></div><div class="row"><ul class="queue-list six columns"><li ng-repeat="track in tracks track by $index" ng-class="{playing: track.playing}"><div class="image-holder"><img src="{{track.img}}"></div><p class="metadata"><strong>{{ track.title }}</strong>&nbsp;<a href="" ng-click="tracks.$remove($index)">(delete)</a></p></li></ul></div></div></div></div>'),a.put("app/main/main.html",'<div class="container"><div class="landing-page"><h1 class="tagline">They call me jkbx.</h1><h4>No nonsense collaborative youtube playlist for the masses.</h4><form name="form" ng-submit="findOrCreateRoom()"><div class="row"><div class="six columns"><div class="row"><input type="text" ng-model="roomName" placeholder="mega-hipster-music-playlist" class="eight columns"><div class="two columns"><a ui-sref="party({name: roomName})" class="button button-primary">Join or Create a playlist</a></div></div></div></div></form></div></div>'),a.put("app/player/player.html",'<div class="player-page"><youtube-video id="web-player" video-id="playing.videoId" player-height="playerHeight" player-width="playerWidth"></youtube-video></div>')}]);
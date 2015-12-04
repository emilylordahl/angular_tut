var app = angular.module('flapperNews', ['ui.router']);

// What we're doing here is creating a new jobject that has an array property called posts. We then return that variable so that our o object essentially becomes exposed to any other Angular modeul that cares to inject it. You'll note that we could have simply exported the posts array directly, however, by exporting an object that contains the posts array we can add new objects and methods to our services in the future.

app.factory('posts', [function(){
  var o = {
    posts: []
  };
  return o;
}]);

// Here we set up our home route. You'll notice that the state is given a name of home, URL of /home and tempalte URL. We've also told NG that our new state should be controller by the MainCtrl. Finally, using the otherwise() mehtod we've specified what should happen if the app receives a URL that is not defined.
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });

    $urlRouterProvider.otherwise('home');
}]);

app.controller('PostsCtrl', ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts) {

  $scope.post = posts.posts[$stateParams.id];

  $scope.addComment = function() {
    if ($scope.body === '') { return; }
    $scope.post.comments.push({
      body: $scope.body,
      author: 'user',
      upvotes: 0
    });
    $scope.body = '';
  };

  // Stuff like this can become a service (the angular way) since it's not DRY
  $scope.incrementUpvotes = function(comment) {
    console.log('You tryna upvote dat comment?');
    comment.upvotes += 1;
  };

}]);

app.controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {

    $scope.posts = posts.posts;

    // Bind the $scope.posts variable in our controller to the posts array in our service (factory) above.

    $scope.addPost = function() {
      // Prevents a user from creating a titleless post
      if (!$scope.title || $scope.title === '') { return; }
      // Make a new post
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
          {author: 'Emily', body: 'You\'re basic.', upvotes: 18945},
        ]
      });
      $scope.title = '';
      $scope.link = '';
    };

    $scope.incrementUpvotes = function(post) {
      console.log('You tryna upvote that post?');
      post.upvotes += 1;
    };

}]);

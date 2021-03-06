Router.configure({
  layoutTemplate: 'quizopedia'
});

ThisQuiz = new Mongo.Collection('quizzes');
Test = new Mongo.Collection('test');
Check=new Mongo.Collection('checks');

var previousValue = 0;

Router.route('/quiz', {
  name: 'currentquiz',
  template: 'currentquiz'
});

Router.route('/', {
  name: 'quizopediahome',
  template: 'quizopediahome'
});

Router.route('/addquiz', {
  name: 'addquiz',
  template: 'addquiz'
});

Router.route('/takequiz', {
  name: 'takequiz',
  template: 'takequiz'
});

Router.route('/checkResponses', {
  name: 'checkResponses',
  template: 'checkResponses'
});

Router.route('/scorecard', {
  name: 'scorecard',
  template: 'scorecard'
});

/*
Router.map(function() {
    this.route('quizopediahome', {path: '/'});
    this.route('addquiz', {path : '/addquiz'});
    this.route('takequiz', {path : '/takequiz'});
    this.route('currentquiz', {path : '/quiz'});
});
var mustBeSignedIn = function() {
    if (!(Meteor.user() || Meteor.loggingIn())) {
        Router.go('addquiz');
    } else {
        this.next();
    }
};
var goHome = function() {
    if (Meteor.user()) {
        Router.go('quizopediahome');
    } else {
        this.next();
    }
};
Router.onBeforeAction(mustBeSignedIn, {except: ['addquiz']});
Router.onBeforeAction(goHome, {only: ['quizopediahome', 'addquiz']});
*/
if (Meteor.isClient) {
Template.logoutForm.events({
    'click .btn-danger': function(e,t) {
         e.preventDefault();
         Meteor.logout();
         Router.go('quizopediahome');
         // Meteor.logout(function(err) {
  // callback
  // Session.set("ses",false);
// });
    }
});


  // Template.tplName.events
  // "click #logout": (e, tmpl) ->
  //   Meteor.logout ->
  //     Session.set "ses", false

  Template.loginForm.events({
    'submit #login-form': function(e,t) {
      e.preventDefault();


      var unam=t.find('#login-username').value;
      var password=t.find('#login-password').value;
      Meteor.loginWithPassword(unam,password);
      if(unam === 'admin'){
          Router.go('addquiz');
      }

      else{
        
          Router.go('takequiz');
        
      }
    }
});

Template.addquiz.events({
    "submit .quizEntry": function (event) {

      event.preventDefault();
      var que_array = new Array();
      var creater =  event.target.creater.value;
      var category =  event.target.category.value;

      for (var i = 1; i <= 2; i++) {
        eval("var que" + "= event.target.question" + i + ".value");
        eval("var ans" + "= event.target.question" + i + "_answer.value");

        for (var op = 1; op <= 4; op++) {
          eval("var opt" + op + "= event.target.question" + i + "_option" + op + ".value");
        }
        que_array.push({question: que, option1: opt1, option2: opt2, option3: opt3, option4: opt4, answer: ans});
      }
      //console.log(que_object);
      Meteor.call("addQuiz", creater, category, que_array);
    }
  });

 Template.checkResponses.events({
    "submit .responseEntry": function (event) {

      event.preventDefault();
      var res_array = new Array();
    var score=0;
      

      for (var i = 1; i <= 2; i++) {
        eval("var res" + "= event.target.response" + i + ".value");
        eval("var cor" + "= event.target.response" + i + "_correctAnswer.value");
    console.log(res+" "+cor);
    if(res===cor){
      score+=10;
    }
        
        res_array.push({response: res, correct: cor});
    Check.insert(res_array);
      }
    Session.set('score', score);
    //Check.insert( { response: 1, correct: 2 } );
    
      //console.log(que_object);
      //Meteor.call("checkResponses", res_array);
    console.log(score);
    }
  });
  
  Template.checkResponses.helpers({
    'dispScore': function() {
      return Session.get('score');
    }
  });

  

Template.takequiz.events({
  'click [name=startQuiz]': function() {

      var selectedCategory = $('#categories option:selected').text();
      Session.set('category', selectedCategory);
      Router.go('currentquiz');
    }
});

Template.currentquiz.helpers({
  'quizzes': function() {
      var selectedCategory = Session.get('category');
      var count = ThisQuiz.find( {category: selectedCategory}).count();
      console.log(count);
      var index = Math.floor(count * Math.random());
      if(index == previousValue){
        
      }
      var previousValue = index;
      console.log(index);
      return ThisQuiz.find( {category: selectedCategory}, {skip: index, limit: 1} );
    },
  'categorySelected': function() {
    //console.log(Session.get('category'));
    return Session.get('category');
  },
  'check': function() {
    return Test.find({});
  },
  'questions': function() {
    return this.quiz;
  }
});

}


if (Meteor.isServer) {
  Meteor.startup(function () {
   
  });
}

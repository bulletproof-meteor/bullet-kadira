Todos = new Meteor.Collection('todos');
Todos.allow({
  remove: function() { return true; },
  update: function() { return true; }
});

Meteor.methods({
  addTodo: function(title) {
    var a =  Todos.insert({'title': title});
  }
});

if(Meteor.isServer) {
  Meteor.publish('todos', function() {
    return Todos.find();
  });
}

if(Meteor.isClient) {
  Meteor.subscribe('todos');

  Template.main.events({
    'click #add-todo': function () {
      var todoText = $('#input-todo').val();
      if(todoText.trim() != ""){
        Meteor.call('addTodo', todoText);
        $('#input-todo').val('');
      }
    },

    'click .delete-todo': function () {
      Todos.remove(this._id);
    },

    'change .todo-done ': function(e){
      var isDone = $(e.target).is(':checked');
      Todos.update({_id: this._id}, {$set: {isDone: isDone}})
    }
  });

  Template.main.checkedState = function() {
    return this.isDone? "checked": "";
  }

  Template.main.todosList = function(){
    return Todos.find();
  }
}

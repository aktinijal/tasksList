$(function() {	
	// пространство имён
	window.App = {
		Models: {},
		Collections: {},
		Views:{}	
	};
 
	// шаблон
	window.template = function(id) {
		return _.template( $('#' + id).html() );
	};
 
	App.Models.Task = Backbone.Model.extend({});
 
	App.Views.Task = Backbone.View.extend({
		tagName: 'li',
		template: template('taskTemplate'),

		render: function () {
			var template = this.template(this.model.toJSON());
			this.$el.html( template );
			return this;
		},

		events:{
			'click .edit': 'editTask'
		},

		editTask: function  () {
			var newTaskTitle = prompt('Please, enter new task title', this.model.get('title'));
			this.model.set('title', newTaskTitle);
		}
	});
 

	App.Collections.Task = Backbone.Collection.extend({
		model: App.Models.Task
	});
 
	App.Views.Tasks = Backbone.View.extend({
		tagName: 'ul',

		render: function() {
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function(task) {
			// создавать новый дочерний вид
			var taskView = new App.Views.Task({ model: task });
			// добавлять его в корневой элемент
			this.$el.append(taskView.render().el);
		}
	})
 
	window.tasksCollection = new App.Collections.Task([
		{
			title: 'Pagination',
			priority: 4	
		},
		{
			title: 'Gulp',
			priority: 3	
		},
		{
			title: 'English',
			priority: 5	
		},
	]);
 
	var tasksView = new App.Views.Tasks({ collection: tasksCollection});
 
	$('.tasks').html(tasksView.render().el);
 
 
});
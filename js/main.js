$(function() {	

	Backbone.history.start();

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

	App.Router = Backbone.Router.extend({
		routes: {
		        ''     : 'index',
		        'another' : 'another'
		    },
	 
	    index: function() {
	        console.log('index route');   
	    },
	    another: function() {
	    	console.log('another route'); 
	    },
	});
	 
	new App.Router();
 
	App.Models.Task = Backbone.Model.extend({});
 
	App.Views.Task = Backbone.View.extend({
		tagName: 'li',
		template: template('taskTemplate'),

		initialize: function () {  
	        this.model.on('change', this.render, this); 
	        this.model.on('destroy', this.remove, this);
		},

		validate: function (attrs) {
			if ( ! $.trim(attrs.title) ) {
				return 'Title must be valid';
			}
		},
		render: function () {
			var template = this.template(this.model.toJSON());
			this.$el.html( template );
			return this;
		},

		events:{
			'click .edit': 'editTask',
   			'click .delete': 'destroy'
		},

		editTask: function  () {
			var newTaskTitle = prompt('Please, enter new task title', this.model.get('title'));
			this.model.set('title', newTaskTitle);
		},
		destroy: function  () {
		    this.model.destroy();
		},

		remove: function  () {
		    this.$el.remove(); 
		}
	});
 
	App.Collections.Task = Backbone.Collection.extend({
		model: App.Models.Task
	});
 
	App.Views.Tasks = Backbone.View.extend({
		tagName: 'ul',

		initialize: function() {
          this.collection.on('add', this.addOne, this );
        },

		render: function() {
			this.collection.each(this.addOne, this);
			return this;
		},

		addOne: function(task) {
			var taskView = new App.Views.Task({ model: task });

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

 	
 	App.Views.AddTask = Backbone.View.extend({
        el: '#addTask',

        events: {
            'submit' : 'submit'
        },
 
        initialize: function() {
        },
 
        submit: function(e) {
            e.preventDefault();
 
            var newTaskTitle =  $(e.currentTarget).find('input[type=text]').val();
            
            var newTask = new App.Models.Task({ title: newTaskTitle });
            this.collection.add(newTask);
 
        }

    });
    
    var addTaskView = new App.Views.AddTask({ collection: tasksCollection });
});
"use strict";

var PageModel = Backbone.Model.extend({
  url: function() { return 'api/pages'; },
  sync: function(method, model, options) {

    if (method === 'update' || method === 'delete') {
      model.url = function() { return 'api/pages/' + model.get('id'); };
    } else {
      model.url = function() { return 'api/pages'; }; 
    }

    return Backbone.sync(method, model, options);
  }
});

var PageView = Backbone.View.extend({
  el: '#pageView',
  template: _.template($('#pageTemplate').html()),
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
  }
});

var NavView = Backbone.View.extend({
  el: '#navView',
  events: {
    'click ul:nth-child(1) a': 'handleClick'
  },
  initialize: function() {
    this.$buttons = this.$el.find('ul:nth-child(2)');
    this.listenTo(this.model, 'change', this.handleMode);
  },
  handleClick: function(evt) {
    var href = $(evt.currentTarget).attr('href');

    // http://stackoverflow.com/a/19709846/531320
    if (0 > href.indexOf('http://') || 0 > href.indexOf('https://')) {
      Backbone.history.navigate(href, true);
      return false;
    }
  },
  handleMode: function() {
    var id = this.model.get('id');

    if (id === null) {
      this.$buttons.find("button[data-target='#editModalView']").addClass('hidden');
      this.$buttons.find("button[data-target='#deleteModalView']").addClass('hidden');
      this.$buttons.find("button[data-target='#createModalView']").removeClass('hidden');
    } else {
      this.$buttons.find("button[data-target='#editModalView']").removeClass('hidden');
      this.$buttons.find("button[data-target='#deleteModalView']").removeClass('hidden');
      this.$buttons.find("button[data-target='#createModalView']").addClass('hidden');
    }
  }
});

var EditModalView = Backbone.View.extend({
  el: '#editModalView',
  events: {
    'shown.bs.modal': 'handleEdit',
    'click div.modal-footer button:eq(1)': 'handleSave'
  },
  initialize: function() {
    this.$title = this.$el.find('.modal-body input:eq(0)');
    this.$body = this.$el.find('.modal-body textarea:eq(0)');
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {
    var title = this.model.get('title');
    var body = this.model.get('body');
    this.$title.val(title);
    this.$body.val(body);
  },
  handleEdit: function() {
    this.render();
  },
  handleSave: function() {
    var page = this.model;
    var id = page.get('id');
    var title = this.$title.val();
    var body = this.$body.val();

    if (id === null) {
      this.$el.modal('hide');
      return;
    }

    if (title !== page.get('title') || body !== page.get('body')) {
      page.save({id: id, title: title, body: body});
    }
  },
});

var ResetModalView = Backbone.View.extend({
  el: '#resetModalView',
  events: {
    'click div.modal-footer button:eq(1)': 'handleReset'
  },
  handleReset: function() {

    var that = this;
    var name = that.model.get('name');

    $.get('/api/reset').done(function() {
      that.model
        .unset('id', { silent: true })
        .fetch({
          data: {name: name},
            error: function (model, response) {
              that.model.set(response.responseJSON);
            }
        });
    }); 
  }
});

var DeleteModalView = Backbone.View.extend({
  el: '#deleteModalView',
  events: {
    'click div.modal-footer button:eq(1)': 'handleDelete'
  },
  handleDelete: function() {
    var that = this;
    var name = that.model.get('name');

    this.model.destroy();
    this.model.fetch({
      data: {name: name},
       error: function(model, response) {
          that.model.set(response.responseJSON);
        }
      });
    }
});

var CreateModalView = Backbone.View.extend({
  el: '#createModalView',
  events: {
    'shown.bs.modal': 'handleEdit',
    'click div.modal-footer button:eq(1)': 'handleSave'
  },
  initialize: function() {
    this.$name = this.$el.find('.modal-body input:eq(0)');
    this.$title = this.$el.find('.modal-body input:eq(1)');
    this.$body = this.$el.find('.modal-body textarea:eq(0)');
  },
  handleEdit: function() {
    var name = this.model.get('name');

    this.$name.val(name);
    this.$title.val('');
    this.$body.val('');
  },
  handleSave: function() {
    var name = this.$name.val();
    var title = this.$title.val();
    var body = this.$body.val();

    if (name === '' || title === '' || body === '') {
      return;
    }

    var that = this;

    that.model.save({
      name: name, title: title, body: body
    }, {
      success: function() {
        that.model.fetch({
          data: { name: name },
            error: function(model, response) {
              that.model.set(response.responseJSON);
            }
          });
        }
    });
  }
});

var Router = Backbone.Router.extend({
  routes: {
    '(:name)': 'dispatch'
  },
  initialize: function(options) {
    this.model = options.model;
  },
  dispatch: function(name) {

    if (name === null) {
      name = 'index';
    }

    var that = this;

    that.model.fetch({
      data: {name: name},
        error: function(model, response) {
          that.model.set(response.responseJSON);
        }
    });
  }
});

var app = {};
app.model = new PageModel;
app.config = {
  model: app.model
};
app.navView = new NavView(app.config);
app.pageView = new PageView(app.config);
app.editModalView = new EditModalView(app.config);
app.resetModalView = new ResetModalView(app.config);
app.deleteModalView = new DeleteModalView(app.config);
app.createModalView = new CreateModalView(app.config); 
app.router = new Router(app.config);
Backbone.history.start({ pushState: true, root: '/' });

$('#message').addClass('alert alert-success').html('ページがロードされました。').fadeOut(8000);
import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';

var App, server;

module('Acceptance: Infinity Route', {
  setup: function() {
    App = startApp();
    server = new Pretender(function() {
      this.get('/posts', function(request) {
        var posts = [
          { id: 1, name: "Squarepusher" },
          { id: 2, name: "Aphex Twin" }
        ];
        return [200, {"Content-Type": "application/json"}, JSON.stringify({posts: posts})];
      });
    });
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('it works when meta is not present in payload', function(assert) {
  visit('/');

  andThen(function() {
    var postsTitle     = find('#posts-title');
    var postList       = find('ul');
    var infinityLoader = find('.infinity-loader');

    assert.equal(postsTitle.text(), "Listing Posts");
    assert.equal(postList.find('li').length, 2);
    assert.equal(infinityLoader.hasClass('reached-infinity'), true);
  });
});

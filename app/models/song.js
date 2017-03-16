import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  band: DS.belongsTo('band'),
  rating: DS.attr('number')
});

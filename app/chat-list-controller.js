goog.provide('app.ChatListController');

goog.require('ng.Controller');


/**
 * @constructor
 * @extends {ng.Controller}
 * @param {!angular.Scope} $scope A scope.
 * @ngInject
 */
app.ChatListController = function ($scope) {
  ng.Controller.call(this, $scope);

  this.$scope['contacts'] = this.generateContacts(20);
};

goog.inherits(app.ChatListController, ng.Controller);


app.ChatListController.prototype.generateContacts = function (count) {
  var contacts = [];
  var used_indexes = []

  while (count--) {
    do {
      var name_index = Math.floor(Math.random() * 30);
    } while (used_indexes.indexOf(name_index) !== -1);

    var contact = {
      'name': app.ChatListController.names[name_index]
    };
    contacts.push(contact);
    used_indexes.push(name_index);
  }

  contacts.sort(function (a, b) {
    return (a['name'] < b['name']) ? -1 : (a['name'] > b['name'] ? 1 : 0);
  })

  return contacts;
};


app.ChatListController.names = [
  'Laureen Alm',
  'Dyan Mckinnie',
  'Tama Holcomb',
  'Micah Labombard',
  'Gracia Eck',
  'Wiley Mallory',
  'Karmen Floyd',
  'Honey Dunworth',
  'Hilary Meldrum',
  'Georgeann Waldorf',
  'Elinor Denver',
  'Karine Rockefeller',
  'Rosa Hudspeth',
  'Adolph Yau',
  'Claud Pullins',
  'Corinna Wetherington',
  'Dwain Pillai',
  'Daniel Lopresti',
  'Teofila Rasberry',
  'Angele Cadorette',
  'Laree Timbers',
  'Jerald Thibeau',
  'Tiera Gainer',
  'Cherise Mccrystal',
  'Isabella Dana',
  'Evelin Carreon',
  'Vada Chason',
  'Kristin Mattei',
  'Milagro Merced',
  'Hana Towsend'
];

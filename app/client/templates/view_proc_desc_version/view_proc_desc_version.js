/*****************************************************************************/
/* Id: Event Handlers */
/*****************************************************************************/
Template.ViewProcDescVersion.events({
  'click .return': function(event){
    var originalDocument = this.ref;
    if (!originalDocument) {
      originalDocument = this._id;
    }
    Router.go('/proc_desc/'+originalDocument);
  },
  'click .pdf': function(event) {
    event.preventDefault();

    // alert('Das PDF wird generiert. Bitte haben Sie einen Moment Geduld..');

    window.open(Router.url('generatePDF', {_id: this._id}));
    // Router.go('generatePDF', {_id: this._id});

    // Meteor.call('proc_desc_pdf', {_id: this._id}, function(err, res) {
		// 	if (err) {
		// 		console.error(err);
		// 	} else if (res) {
		// 		// window.open("data:application/pdf;base64, " + res);
    //     // var fs = Npm.require('fs');
    //     // this.response.writeHead(200, {
    //     //   "Content-Type": "application/pdf",
    //     //   "Content-Length": res.length
    //     // });
    //     // this.response.write(res);
    //     // this.response.end();
		// 	}
		// });
  },
  'click .xml': function() {
    Meteor.call('proc_desc_xml', this.content, function(err, res) {
      if (err) {
        console.error(err);
      } else if (res) {
        console.log(res);
      }
    });
  }
});

Template.ViewProcDescVersion.onRendered(function() {
  if (_.isFunction(window.callPhantom))
    Meteor.setTimeout(function() {
      window.callPhantom('takeShot');
    }, 500);
});

/*****************************************************************************/
/* Id: Helpers */
/*****************************************************************************/
Template.ViewProcDescVersion.helpers({
  beforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.serviceShortTitle + '" löschen?')) {
        this.remove();
        Router.go('procDescList');
      }
    };
  },
  isVerified: function () {
    if (CryptoJS.SHA512(JSON.stringify(this.content)).toString() == this.documentHash) {
      return "unmodifiziert";
    } else {
      return "wurde modifiziert";
    }
  },
  procDesc: function() {
    return function (collection, id) {
      var doc = collection.findOne(id);
      return doc;
    };
  },
  modificationDateFormatted: function () {
    return moment(this.modifiedAt).format("DD.MM.YYYY HH:mm");
  },
  modifierName: function () {
    var user = Meteor.users.findOne(this.modifierId);
    return user && user.profile.lastName + ", " + user.profile.firstName;
  }
});

/*****************************************************************************/
/* Id: Lifecycle Hooks */
/*****************************************************************************/
Template.ViewProcDescVersion.onCreated(function () {
});

Template.ViewProcDescVersion.onRendered(function () {
});

Template.ViewProcDescVersion.onDestroyed(function () {
});

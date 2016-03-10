Template.ProcDescList.events({
  'click .sortEdited': function() {
    var sortObject = Session.get( "Sort" );
    Session.set( "Sort", { "sortField": "modifiedAt", "sortOrder": sortObject["sortOrder"]*(-1)} );
  },'click .sortApproved': function() {
    var sortObject = Session.get( "Sort" );
    Session.set( "Sort", { "sortField": "content.approvedAt", "sortOrder": sortObject["sortOrder"]*(-1)} );
  },'click .sortResponsible': function() {
    var sortObject = Session.get( "Sort" );
    Session.set( "Sort", { "sortField": "content.sectionA.createdBySort", "sortOrder": sortObject["sortOrder"]*(-1)} );
  },'click .sortDescription': function() {
    var sortObject = Session.get( "Sort" );
    Session.set( "Sort", { "sortField": "content.serviceShortTitleSort", "sortOrder": sortObject["sortOrder"]*(-1)} );
  },
  'click .sortEditedApproved': function() {
    var sortObject = Session.get( "SortApproved" );
    Session.set( "SortApproved", { "sortField": "modifiedAt", "sortOrder": sortObject["sortOrder"]*(-1)} );
  },'click .sortApprovedApproved': function() {
    var sortObject = Session.get( "SortApproved" );
    Session.set( "SortApproved", { "sortField": "content.approvedAt", "sortOrder": sortObject["sortOrder"]*(-1)} );
  },'click .sortResponsibleApproved': function() {
    var sortObject = Session.get( "SortApproved" );
    Session.set( "SortApproved", { "sortField": "content.sectionA.createdBySort", "sortOrder": sortObject["sortOrder"]*(-1)} );
  },'click .sortDescriptionApproved': function() {
    var sortObject = Session.get( "SortApproved" );
    Session.set( "SortApproved", { "sortField": "content.serviceShortTitleSort", "sortOrder": sortObject["sortOrder"]*(-1)} );
  }
});
/*****************************************************************************/
/* ProcDescList: Event Handlers */
/*****************************************************************************/
Template.ProcDescListSingle.events({
  'click .delete': function () {
    var doc = ProcDescs.findOne(this._id);
    var id = this._id
    if (typeof doc === "undefined") {
      doc = ProcDescsVermongo.findOne(this._id);
      id = doc.ref;
    }
    if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.content.serviceShortTitle + '" löschen?')) {
      ProcDescs.remove(id);
    }
  },
  'click .pdf': function () {
    window.open(Router.url('generatePDF', {_id: this._id}));
  },
  'click .xml': function() {
    Meteor.call('proc_desc_xml', this.content, function(err, res) {
      if (err) {
        console.error(err);
      } else if (res) {
        var uriContent = "data:text/attachment;charset=UTF-8," + encodeURIComponent(res);
        window.open(uriContent, 'testdocument.xml');
      }
    });
  }
});

Template.ProcDescList.helpers({
  approved_proc_descs: function () {
    var sortObject = Session.get("SortApproved");
    if (typeof sortObject === "undefined") {
      sortObject = {"sortField": "modifiedAt", "sortOrder": -1}
      Session.set("SortApproved", sortObject);
    }

    var ids = _.uniq(_.pluck(ProcDescs.find({}, {sort: {modifiedAt: -1}, fields: {_id: 1}}).fetch(), '_id'));
    var values = [];
    for (var key in ids) {
      var value = ProcDescsVermongo.find({"content.approved": true, ref: ids[key]}, {sort: {"content.approvedAt": -1}, limit: 1}).fetch();
      if (value.length > 0) {
        values.push(value[0]);
      }
    }

    // taken from http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript#comment2298229_1129270
    // var newValues = values.sort(function(a,b) {
    //   return (a[sortObject["sortField"]] > b[sortObject["sortField"]]) ?
    //     sortObject["sortOrder"] : ((b[sortObject["sortField"]] > a[sortObject["sortField"]]) ?
    //       -1*sortObject["sortOrder"] : 0);
    // });

    var newValues = [];
    if (sortObject["sortField"].indexOf("content.") > -1) {
      var sections = sortObject["sortField"].split('.');
      if (sections.length > 2) {
        newValues = _.sortBy(values, function(o) { return o["content"][sections[1]][sections[2]]; });
      } else {
        newValues = _.sortBy(values, function(o) { return o["content"][sections[1]]; });
      }
    } else {
      newValues = _.sortBy(values, sortObject["sortField"]);
    }

    if (sortObject["sortOrder"] == -1) {
      newValues = newValues.reverse();
    }

    return newValues;
  },
  proc_descs: function () {
    var sortObject = Session.get("Sort");
    if (typeof sortObject === "undefined") {
      sortObject = {"sortField": "modifiedAt", "sortOrder": -1}
      Session.set("Sort", sortObject);
    }
    var sortParameter = {}
    sortParameter[sortObject["sortField"]] = sortObject["sortOrder"];
    return ProcDescs.find({}, {sort: sortParameter});
  }
});
/*****************************************************************************/
/* ProcDescList: Helpers */
/*****************************************************************************/
Template.ProcDescListSingle.helpers({
  longDateFormatted: function (date) {
    return moment(date).format("DD.MM.YYYY HH:mm");
  },

  beforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Wollen Sie wirklich die Verfahrensbeschreibung für "' + doc.content.serviceShortTitle + '" löschen?')) {
        this.remove();
        Router.go('procDescList');
      }
    };
  }
});

/*****************************************************************************/
/* ProcDescList: Lifecycle Hooks */
/*****************************************************************************/
Template.ProcDescList.onCreated(function () {
});

Template.ProcDescList.onRendered(function () {
});

Template.ProcDescList.onDestroyed(function () {
});

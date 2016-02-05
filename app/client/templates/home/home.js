/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
  getSigReq: function () {
    // return "";
    var merkle = ReactiveMethod.call('createMerkle');
    if (merkle) {
      return ReactiveMethod.call('sigReq', merkle && merkle[0][0]);
    } else {
      return "";
    }
  },
  createMerkle: function () {
    return JSON.stringify(ReactiveMethod.call('createMerkle'));
  }
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(function () {
});

Template.Home.onRendered(function () {
});

Template.Home.onDestroyed(function () {
});

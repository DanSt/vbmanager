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
    return ReactiveMethod.call('sigReq', ReactiveMethod.call('createMerkle')[0][0]);
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

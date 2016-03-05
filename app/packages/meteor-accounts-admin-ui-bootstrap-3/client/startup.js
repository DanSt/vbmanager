Meteor.startup(function() {
	Meteor.subscribe('roles');
	Meteor.subscribe('proc_descs');
	Deps.autorun(function(e) {
		Meteor.subscribe('filteredUsers', Session.get('userFilter'));
	});
});

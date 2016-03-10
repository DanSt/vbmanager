filteredUserQuery = function(userId, filter) {
	// if not an admin user don't show any other user
	if (!Roles.userIsInRole(userId, ['admin']))
		return Meteor.users.find(userId);

	// TODO: configurable limit and paginiation
	var queryLimit = 25;

	if(!!filter) {
		// TODO: passing to regex directly could be dangerous
		users = Meteor.users.find({
			$or: [
				{'username': {$regex: filter, $options: 'i'}},
				{'profile.name': {$regex: filter, $options: 'i'}},
				{'profile.firstName': {$regex: filter, $options: 'i'}},
				{'profile.lastName': {$regex: filter, $options: 'i'}},
				{'emails.address': {$regex: filter, $options: 'i'}}
			]
		}, {sort: {username: 1}, limit: queryLimit, fields: {'profile': 1, 'roles': 1, '_id': 1, 'username': 1, 'emails': 1}});
	} else {
		users = Meteor.users.find({}, {sort: {username: 1}, limit: queryLimit, fields: {'profile': 1, 'roles': 1, '_id': 1, 'username': 1, 'emails': 1}});
	}
	return users;
};

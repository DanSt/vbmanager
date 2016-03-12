create_merkle = function(array) {
  var merkle = Meteor.npmRequire('merkle');
  var merkle_mod = Meteor.npmRequire('merkle-tree');

  var tree = merkle('sha256').sync(array);

  var output = [];
  for (var i=0; i<tree.levels(); i++) {
    output.push(tree.level(i));
  }

  return output;
}

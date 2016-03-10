search_query = function(raw_query) {
  var query = raw_query.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
  return {
    $or: [
      {'content.sectionA.creationDate': {$regex: query, $options: 'i'}},
      {'modifiedAt': {$regex: query, $options: 'i'}},
      {'content.serviceShortTitle': {$regex: query, $options: 'i'}},
      {'content.sectionA.createdBy': {$regex: query, $options: 'i'}},
      {'content.sectionB.serviceName': {$regex: query, $options: 'i'}},
      {'content.sectionB.purpose': {$regex: query, $options: 'i'}},
      {'content.sectionB.circleAffected': {$regex: query, $options: 'i'}},
      {'content.sectionB.typeOfTransmittedData': {$regex: query, $options: 'i'}},
      {'content.sectionC.titleAndLocationOfSystem': {$regex: query, $options: 'i'}},
      {'content.sectionC.operatingSystem': {$regex: query, $options: 'i'}},
      {'content.sectionC.usedSoftware': {$regex: query, $options: 'i'}}
    ]
  };
}

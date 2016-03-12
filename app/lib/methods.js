/*****************************************************************************/
/*  Client and Server Methods */
/*****************************************************************************/

Meteor.methods({

  'proc_desc_xml': function(content, id) {
    if (Meteor.userId() && Meteor.isServer && (Roles.userIsInRole(Meteor.userId(), ['datenschutzBeauftragter'])
      || Roles.userIsInRole(Meteor.userId(), [id]))) {

      return create_xml(content);
    }
  },
  'proc_desc_pdf': function(userid, token, id) {
    if (Meteor.isServer) {

      /**
      *   Solution from http://stackoverflow.com/questions/27734110/authentication-on-server-side-routes-in-meteor
      **/
      //Check a valid user with this token exists

      if (typeof id === 'undefined') {
        return "";
      }

      var user = Meteor.users.findOne({
        _id: userid,
        'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(token)
      });

      // PREPARE DATA
      var mainId = id;
      var data = ProcDescs.find({_id: id}).fetch()[0];
      if (typeof data === 'undefined') {
        data = ProcDescsVermongo.find({_id: id}).fetch()[0];
        mainId = data.ref;
      }

      if (!user || !Roles.userIsInRole(user._id, ['datenschutzBeauftragter']) && !Roles.userIsInRole(user._id, mainId)) {
        return "";
      }

      var base64PDF = create_pdf(data);

      var hash_file = Meteor.npmRequire('hash_file');
      var documentDigest = hash_file(new Buffer(base64PDF, 'base64'), 'sha256').toUpperCase();
      ProcDescs.direct.update({_id: id}, {$set: {"archive.metaData.documentDigest": documentDigest}}, {validate: false, getAutoValues: false});

      return base64PDF;
    }
  },
  'proc_desc_archive': function(userid, token, id) {

    /**
    *   Solution from http://stackoverflow.com/questions/27734110/authentication-on-server-side-routes-in-meteor
    **/
    //Check a valid user with this token exists
    var user = Meteor.users.findOne({
      _id: userid,
      'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(token)
    });

    // PREPARE DATA
    var mainId = id;
    var doc = ProcDescs.find(id).fetch()[0];
    var collection = ProcDescs;
    if (typeof doc === 'undefined') {
      doc = ProcDescsVermongo.find({_id: id}).fetch()[0];
      mainId = doc.ref;
      collection = ProcDescsVermongo;
    }

    if (!doc.content.approved || !user || !Roles.userIsInRole(user._id, ['datenschutzBeauftragter']) && !Roles.userIsInRole(user._id, mainId)) {
      return "";
    }

    return create_archive(doc.archive);
  },
  'sigReq': function(content, userId, token) {
    var user = Meteor.users.findOne({
      _id: userId,
      'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(token)
    });

    if (user && Meteor.isServer && Roles.userIsInRole(user._id, ['datenschutzBeauftragter'])) {
      var jsrsasign = Meteor.npmRequire('jsrsasign');
      var fut     = new Future();
      var fs      = Npm.require('fs');
      var httpreq = Meteor.npmRequire('httpreq');

      var hashValue = CryptoJS.SHA256(content).toString();

      var json = {
        mi: { hashAlg: 'sha256',
              hashValue: hashValue }
      };

      json.certreq = true;

      var o = new jsrsasign.asn1.tsp.TimeStampReq(json);
      var hex = o.getEncodedHex();
      var b64 = jsrsasign.hex2b64(hex);
      var pemBody = b64.replace(/(.{64})/g, "$1\r\n");
      pemBody = pemBody.replace(/\r\n$/, '');

      var b = new Buffer(pemBody, 'base64');

      httpreq.post('http://zeitstempel.dfn.de', {headers: {'Content-Type': 'application/timestamp-query'}, binary: true, body: b}, function (err, res) {
        if (err) {
          console.log(err);
        } else {
          fut.return(res);
        }
      });

      var binaryResult = fut.wait();

      /**
       *  return entire response as base64
       */
      return binaryResult.body.toString('base64');
      //
      // var fut2 = new Future();
      // /**
      //  *  Doesn't work in production environment because simple pipe of spawn does not work to pipe input.
      //  *  Must be done manually like in example a bit lower with spawn.
      //  */
      // // openssl.exec('ts', binaryResult.body, {reply: true, in: '/dev/stdin', text: true}, function(err, buffer) {
      // //   if (err) {
      // //     console.log(err);
      // //   }
      // //   fut2.return(buffer.toString());
      // // });
      //
      // var spawn = Npm.require('child_process').spawn;
      //
      // var command = spawn('/bin/sh', ['-c', 'echo ' + binaryResult.body.toString('base64') + ' | base64 --decode | openssl ts -reply -in /dev/stdin -text']);
      //
      // command.stdout.on('data', function (data) {
      //   fut2.return(data.toString());
      // });
      //
      // command.stderr.on('data', function (data) {
      //   console.log('stderr: ' + data);
      // });
      //
      // var timestampInfo = fut2.wait();
      //
      // /**
      //  *  Convert into ASNstructure and base64
      //  */
      // // // Convert from binary DER to hexadecimal DER
      // // var hexResult = binaryResult.body.toString('hex');
      // // // Convert from hexadecimally represented DER to ASN1
      // // var ASN1Result = jsrsasign.ASN1HEX.dump(hexResult);
      // // // Convert to Base64
      // // var buffer = new Buffer(ASN1Result);
      // // var base64Result = buffer.toString('base64');
      //
      // return timestampInfo;
    }
  },
  'createMerkle': function() {
    if(Meteor.userId() && Meteor.isServer) {
      // var proc_descs2 = ProcDescsVermongo.find({"modifiedAt" : { $lte : new Date("2016-01-23T20:15:31Z") }}, {sort: {'modifiedAt': -1}});
      var proc_descs2 = ProcDescsVermongo.find({}, {fields: {'archive.files': 0}, sort: {'modifiedAt': -1}}).fetch();

      var arr = [];

      proc_descs2.forEach(function(item) {
        if (item._id && item.documentHash) {
          arr.push(item.documentHash);
        }
      });

      return create_merkle(arr);
    }
  },
  'insertProcDesc': function(doc) {
    if (Meteor.userId()) {
      ProcDescSchema.clean(doc);
      ProcDescSchema.validate(doc);
      ProcDescs.insert(doc);
    }
  },
  'updateProcDesc': function(modifier, _id) {
    if (Meteor.userId() && (Roles.userIsInRole(Meteor.userId(), ['datenschutzBeauftragter'])
      || Roles.userIsInRole(Meteor.userId(), [_id]))) {
      ProcDescSchema.clean(modifier, {isModifier: true});
      ProcDescSchema.validate(modifier, {modifier: true});
      ProcDescs.update({_id: _id}, modifier);
    }
  },
  'deleteProcDesc': function(_id) {
    if (Meteor.userId() && Roles.userIsInRole(Meteor.userId(), ['datenschutzBeauftragter'])) {
      ProcDescs.remove({_id: _id});
    }
  }
});

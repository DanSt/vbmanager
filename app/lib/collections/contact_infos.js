ContactInfos = new Mongo.Collection('contact_infos').vermongo({timestamps: true, userId: 'modifierId', ignoreFields: []});
ContactInfosVermongo = ContactInfos.getVersionCollection();

ContactInfos.before.insert(function (userId, doc) {
  ContactInfoContentSchema.clean(doc.content);
  var hash = CryptoJS.SHA512(JSON.stringify(doc.content)).toString();
  doc.documentHash = hash;
});

ContactInfos.after.update(function (userId, doc, fieldNames, modifier, options) {
  var hash = CryptoJS.SHA512(JSON.stringify(doc.content)).toString();
  if (Meteor.isServer) {
    ContactInfos.direct.update({_id: doc._id}, {$set: {documentHash: hash}});
  }
});

ContactInfoContentSchema = new SimpleSchema({
  direktorium: {
    type: [String],
    label: "Direktorium",
    maxCount: 10,
    defaultValue: [
      "Prof. Dr. A. Bode (Vorsitzender)",
      "Prof. Dr. H.-J. Bungartz",
      "Prof. Dr. H.-G. Hegering",
      "Prof. Dr. D. Kranzlmüller"
    ]
  },
  address: {
    type: [String],
    label: "Adresse",
    maxCount: 4,
    defaultValue: [
      "Leibniz-Rechenzentrum",
      "Boltzmannstraße 1",
      "85748 Garching"
    ]
  },
  ustid: {
    type: String,
    label: "UST-ID-Nr.",
    max: 12,
    defaultValue: "DE811335517"
  },
  telephone: {
    type: String,
    label: "Telefon",
    max: 18,
    defaultValue: "(089) 35831-8000"
  },
  telefax: {
    type: String,
    label: "Telefax",
    max: 18,
    defaultValue: "(089) 35831-9700"
  },
  email: {
    type: String,
    label: "E-Mail",
    max: 40,
    defaultValue: "lrzpost@lrz.de"
  },
  internet: {
    type: String,
    label: "Internet",
    max: 40,
    defaultValue: "http://www.lrz.de"
  },
  publicTransport: {
    type: [String],
    label: "Öffentliche Verkehrsmittel",
    maxCount: 5,
    defaultValue: [
      "U6: Garching-Forschungszentrum"
    ]
  }
});

ContactInfos.attachSchema(new SimpleSchema( {
  isDefault: {
    type: Boolean,
    label: "Ist Standard"
  },
  content: {
    type: ContactInfoContentSchema,
    label: "Inhalt"
  }
}));

Meteor.startup(function() {
  if (Meteor.isServer && ContactInfos.find().count() == 0) {
    ContactInfos.insert({isDefault: true,
      content: {
        direktorium: [
          "Prof. Dr. A. Bode (Vorsitzender)",
          "Prof. Dr. H.-J. Bungartz",
          "Prof. Dr. H.-G. Hegering",
          "Prof. Dr. D. Kranzlmüller"
        ],
        address: [
          "Leibniz-Rechenzentrum",
          "Boltzmannstraße 1",
          "85748 Garching"
        ],
        ustid: "DE811335517",
        telephone: "(089) 35831-8000",
        telefax: "(089) 35831-9700",
        email: "lrzpost@lrz.de",
        internet: "http://www.lrz.de",
        publicTransport: [
          "U6: Garching-Forschungszentrum"
        ]
      }
    });
  }
});

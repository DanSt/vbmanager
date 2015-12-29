ProcDescs = new Mongo.Collection('proc_descs').vermongo({timestamps: true, userId: 'modifierId', ignoreFields: []});
ProcDescsVermongo = ProcDescs.getVersionCollection();

ProcDescs.before.insert(function (userId, doc) {
  ProcDescContentSchema.clean(doc.content);
  var hash = CryptoJS.SHA512(JSON.stringify(doc.content)).toString();
  doc.documentHash = hash;
});

ProcDescs.after.update(function (userId, doc, fieldNames, modifier, options) {
  var hash = CryptoJS.SHA512(JSON.stringify(doc.content)).toString();
  if (Meteor.isServer) {
    ProcDescs.direct.update({_id: doc._id}, {$set: {documentHash: hash}});
  }
});

BoolValue = new SimpleSchema({
  defaultValue: {
    type: Boolean,
    label: "Aktiv",
    defaultValue: false,
    optional: true
  },
  label: {
    type: String,
    label: "Beschreibung",
    max: 100,
    optional: true
  }
});

ProcDescContentSchema = new SimpleSchema({
  serviceShortTitle: {
    type: String,
    label: "Dienstkurzbezeichnung",
    defaultValue: "<Dienstkurzbezeichnung>",
    max: 80
  },
  documentPurpose1: {
    type: Boolean,
    label: "der erstmaligen Beschreibung des Verfahrens",
    defaultValue: true
  },
  documentPurpose2: {
    type: Boolean,
    label: "der Änderung der Verfahrensbeschreibung vom: ",
    autoValue: function() {
      if (this.field('_version').value >= 1) {
        return true;
      }
    },
    defaultValue: false
  },
  documentPurpose3: {
    type: Boolean,
    label: "dem Antrag zur Freigabe des Verfahrens",
    defaultValue: true
  },
  documentPurposeOriginalDate: {
    type: Date,
    label: "Original Erstellungsdatum",
    autoValue: function() {
      if (this.unSet && this.field('version').value == 1) {
        return creationDate;
      } else if (this.isSet && !this.siblingField('documentPurpose2').value) {
        this.unset();
      }
    },
    autoform: {
      type: "bootstrap-datepicker",
      datePickerOptions: function() {
        return {
          format: "dd.mm.yyyy"
        }
      }
    },
    optional: true
  },
  creatorName: {
    type: String,
    label: "Vorname",
    autoValue: function() {
      return Meteor.user().profile.firstName;
    },
    max: 200
  },
  creatorSurname: {
    type: String,
    label: "Nachname",
    autoValue: function() {
      return Meteor.user().profile.lastName;
    },
    max: 200
  },
  createdBy: {
    type: String,
    autoValue: function() {
      return this.siblingField('creatorSurname').value + ", " + this.siblingField('creatorName').value;
    }
  },
  creationDate: {
    type: Date,
    label: "Erstellungsdatum",
    autoform: {
      type: "bootstrap-datepicker",
      datePickerOptions: function() {
        return {
          format: "dd.mm.yyyy"
        }
      }
    },
    defaultValue: new Date()
  },
  serviceName: {
    type: String,
    label: "Bezeichnung des Verfahrens",
    defaultValue: "Name des Dienstes",
    max: 200
  },
  serviceDescLoc: {
    type: String,
    label: "Dienstbeschreibung unter",
    defaultValue: "http://www.lrz.de/pfad/bitte/ausfüllen oder Verweis auf entsprechenden Abschnitt im LRZ-Dienstleistungskatalog eintragen",
    max: 200
  },
  purpose: {
    type: String,
    label: "Zweck und Rechtsgrundlagen der Erhebung, Verarbeitung oder Nutzung",
    defaultValue: "Hier ist kurz allgemein anzugeben, warum personenbezogene Daten zum Betrieb des Dienstes erforderlich sind.\n Typische Angaben sind hier: Individuelle Authentifizierung jedes Benutzers; Kontkaktaufnahme bei Störungen oder Missbrauch.",
    max: 400
  },
  typeOfStoredData: {
    type: String,
    label: "Art der gespeicherten Daten",
    defaultValue: "1. LRZ-Kennung (individuelle Authentifizierung)\n2. E-Mail-Adresse (zur Kontaktaufnahme)\3. ...",
    max: 400
  },
  circleAffected: {
    type: String,
    label: "Kreis der Betroffenen",
    defaultValue: "SIM-Platformname",
    max: 100
  },
  typeOfTransmittedData: {
    type: String,
    label: "Art der regelmäßig zu übermittelnden Daten und deren Empfänger",
    defaultValue: "Es werden keine Daten regelmäßig an Dritte übermittelt",
    max: 400
  },
  deletionDeadline1: {
    type: Boolean,
    label: "Die Daten werden dienstlokal vorgehalten, da die LRZ-Benutzerverwaltung genutzt wird.",
    defaultValue: true
  },
  deletionDeadline2: {
    type: Boolean,
    label: "Die Daten werden dienstlokal vorgehalten, da die LRZ-Benutzerverwaltung genutzt wird.",
    defaultValue: true
  },
  deletionDeadline3: {
    type: Boolean,
    label: "Es gelten folgende Sonderregelungen:",
    defaultValue: false,
    autoValue: function() {
      var depField = this.siblingField("deletionDeadlineSonstige").value;
      if (depField && (depField.length == 0 || !depField.$.label)) {
        return false;
      } else {
        return true;
      }
    }
  },
  deletionDeadlineSonstige: {
    type: [BoolValue],
    label: "Sonstige Deadline",
    optional: true,
    minCount: 0
  },
  permittedUserGroup1: {
    type: Boolean,
    label: "Dienstadministratoren und -verantwortliche im Rahmen des Dienstbetriebs",
    defaultValue: true
  },
  permittedUserGroup2: {
    type: Boolean,
    label: "LRZ-Benutzerverwaltung im Rahmen der Kennungs- und Berechtigungsverwaltung",
    defaultValue: false
  },
  permittedUserGroup3: {
    type: Boolean,
    label: "LRZ Service Desk im Rahmen von Störungsmeldungen und Benutzeranfragen",
    defaultValue: false
  },
  permittedUserGroup4: {
    type: Boolean,
    label: "Sonstige:",
    defaultValue: false
  },
  permittedUserGroupSonstige: {
    type: [BoolValue],
    label: "Sonstige Verarbeitungs- und nutzungsberechtigte Personengruppe",
    optional: true,
    minCount: 0
  },
  titleAndLocationOfSystem: {
    type: String,
    label: "Bezeichnung und Standord der Anlage",
    defaultValue: "Z.B. Servermodell und Raum",
    max: 100
  },
  operatingSystem: {
    type: String,
    label: "Eingesetztes Betriebssystem",
    defaultValue: "Z.B. SLES oder Windows Server mit Versionsangabe",
    max: 100
  },
  usedSoftware: {
    type: String,
    label: "Eingesetzte Software",
    defaultValue: "Bezeichnung der Software",
    max: 200
  },
  measuresForAvailability: {
    type: String,
    label: "Maßnahmen zur Sicherstellung der Verfügbarkeit der Daten",
    defaultValue: "Hier sollte, falls personenbezogene Daten lokal vorgehalten werden, z.B. auf Backup, Hardware-Redundanz, Virenbekämpfung, Wiederanlaufverfahren, Notfallkonzepte etc. eingegangen werden. Ansonsten reicht ein Verweis darauf, dass die personenbezogenen Daten z.B. aus SIM übernommen werden.",
    max: 400
  },
  measuresBayDSG: {
    type: String,
    label: "Weitere Maßnahmen nach Art. 7 und 8 BayDSG",
    defaultValue: "Hier folgen (auf das Wesentliche reduziert) Aussagen zu Zutritts- und Zugangskontrollkonzepten; Protokollierung von Eingaben; relevante Richtlinien und Arbeitsanweisungen; Maßnahmen zur Absicherung gegen unbefugten Zugriff Dritter; Sicherung der Vertraulichkeit beim Transport oder bei der Übermittlung von Daten etc.\n Typische Aussage: Der Betrieb erfolgt im zutrittsgeschützen LRZ-Rechnergebäude gemäß den aktuellen LRZ-Leitlinien zur Informationssicherheit. Die Zugangskontrolle erfolgt über eine Kopplung mit der LRZ-Benutzerverwaltung; insbesondere ist ein administrativer Zugriff nur von dedizierten Managementgateways aus möglich.",
    max: 1000
  }
});

ProcDescSchema = new SimpleSchema({
  documentHash: {
    type: String,
    label: "Hash-value of document",
    max: 200,
    optional: true
  },
  content: {
    type: ProcDescContentSchema,
    label: "Inhalt der Verfahrensbeschreibung"
  }
});

ProcDescs.attachSchema(ProcDescSchema);

if (Meteor.isServer) {
  ProcDescs.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}

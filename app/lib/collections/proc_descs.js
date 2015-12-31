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
  documentPurpose1Text: {
    type: String,
    defaultValue: "der erstmaligen Beschreibung des Verfahrens",
    denyInsert: true,
    denyUpdate: true
  },
  documentPurpose2: {
    type: Boolean,
    label: "der Änderung der Verfahrensbeschreibung vom: ",
    defaultValue: false
  },
  documentPurpose2Text: {
    type: String,
    defaultValue: "der Änderung der Verfahrensbeschreibung vom: ",
    denyInsert: true,
    denyUpdate: true
  },
  documentPurpose3: {
    type: Boolean,
    label: "dem Antrag zur Freigabe des Verfahrens",
    defaultValue: true
  },
  documentPurpose3Text: {
    type: String,
    defaultValue: "dem Antrag zur Freigabe des Verfahrens",
    denyInsert: true,
    denyUpdate: true
  },
  documentPurposeOriginalDate: {
    type: Date,
    label: "Original Erstellungsdatum",
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
  serviceNameText: {
    type: String,
    defaultValue: "Bezeichnung des Verfahrens:",
    denyInsert: true,
    denyUpdate: true
  },
  serviceDescLoc: {
    type: String,
    label: "Dienstbeschreibung unter",
    defaultValue: "http://www.lrz.de/pfad/bitte/ausfüllen oder Verweis auf entsprechenden Abschnitt im LRZ-Dienstleistungskatalog eintragen",
    max: 200
  },
  serviceDescText: {
    type: String,
    defaultValue: "Dienstbeschreibung unter:",
    denyInsert: true,
    denyUpdate: true
  },
  furtherInfo: {
    type: String,
    defaultValue: "Service-Desk des Leibniz-Rechenzentrums",
    denyInsert: true,
    denyUpdate: true
  },
  furtherInfoDomain: {
    type: String,
    defaultValue: "https://servicedesk.lrz.de",
    denyInsert: true,
    denyUpdate: true
  },
  furtherInfoText: {
    type: String,
    defaultValue: "Nähere Auskünfte erteilt:",
    denyInsert: true,
    denyUpdate: true
  },
  purpose: {
    type: String,
    label: "Zweck und Rechtsgrundlagen der Erhebung, Verarbeitung oder Nutzung",
    defaultValue: "Hier ist kurz allgemein anzugeben, warum personenbezogene Daten zum Betrieb des Dienstes erforderlich sind.\n Typische Angaben sind hier: Individuelle Authentifizierung jedes Benutzers; Kontkaktaufnahme bei Störungen oder Missbrauch.",
    max: 400
  },
  purposeText: {
    type: String,
    defaultValue: "Zweck und Rechtsgrundlagen der Erhebung, Verarbeitung oder Nutzung",
    denyInsert: true,
    denyUpdate: true
  },
  typeOfStoredData: {
    type: String,
    label: "Art der gespeicherten Daten",
    defaultValue: "1. LRZ-Kennung (individuelle Authentifizierung)\n2. E-Mail-Adresse (zur Kontaktaufnahme)\3. ...",
    max: 400
  },
  typeOfStoredDataText: {
    type: String,
    defaultValue: "Art der gespeicherten Daten",
    denyInsert: true,
    denyUpdate: true
  },
  circleAffected: {
    type: String,
    label: "Kreis der Betroffenen",
    defaultValue: "SIM-Platformname",
    max: 100
  },
  circleAffectedText: {
    type: String,
    defaultValue: "Kreis der Betroffenen",
    denyInsert: true,
    denyUpdate: true
  },
  typeOfTransmittedData: {
    type: String,
    label: "Art der regelmäßig zu übermittelnden Daten und deren Empfänger",
    defaultValue: "Es werden keine Daten regelmäßig an Dritte übermittelt",
    max: 400
  },
  typeOfTransmittedDataText: {
    type: String,
    defaultValue: "Art der regelmäßig zu übermittelnden Daten und deren Empfänger",
    denyInsert: true,
    denyUpdate: true
  },
  deletionDeadline1: {
    type: Boolean,
    label: "Die Daten werden dienstlokal vorgehalten, da die LRZ-Benutzerverwaltung genutzt wird.",
    defaultValue: true
  },
  deletionDeadline1Text: {
    type: String,
    defaultValue: "Die Daten werden dienstlokal vorgehalten, da die LRZ-Benutzerverwaltung genutzt wird.",
    denyInsert: true,
    denyUpdate: true
  },
  deletionDeadline2: {
    type: Boolean,
    label: "Die Daten werden dienstlokal vorgehalten, da die LRZ-Benutzerverwaltung genutzt wird.",
    defaultValue: true
  },
  deletionDeadline2Text: {
    type: String,
    defaultValue: "Die Daten werden dienstlokal gespeichert und bei Erlöschen der Nutzungsberechtigung entfernt.",
    denyInsert: true,
    denyUpdate: true
  },
  deletionDeadline3: {
    type: Boolean,
    label: "Es gelten folgende Sonderregelungen:",
    defaultValue: false,
    autoValue: function() {
      var depField = this.siblingField("deletionDeadlineSonstige").value;
      if (depField) {
        return true;
      } else {
        return false;
      }
    }
  },
  deletionDeadline3Text: {
    type: String,
    defaultValue: "Es gelten folgende Sonderregelungen:",
    denyInsert: true,
    denyUpdate: true
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
  permittedUserGroup1Text: {
    type: String,
    defaultValue: "Dienstadministratoren und -verantwortliche im Rahmen des Dienstbetriebs",
    denyInsert: true,
    denyUpdate: true
  },
  permittedUserGroup2: {
    type: Boolean,
    label: "LRZ-Benutzerverwaltung im Rahmen der Kennungs- und Berechtigungsverwaltung",
    defaultValue: false
  },
  permittedUserGroup2Text: {
    type: String,
    defaultValue: "LRZ-Benutzerverwaltung im Rahmen der Kennungs- und Berechtigungsverwaltung",
    denyInsert: true,
    denyUpdate: true
  },
  permittedUserGroup3: {
    type: Boolean,
    label: "LRZ Service Desk im Rahmen von Störungsmeldungen und Benutzeranfragen",
    defaultValue: false
  },
  permittedUserGroup3Text: {
    type: String,
    defaultValue: "LRZ Service Desk im Rahmen von Störungsmeldungen und Benutzeranfragen",
    denyInsert: true,
    denyUpdate: true
  },
  permittedUserGroup4: {
    type: Boolean,
    label: "Sonstige:",
    defaultValue: false,
    autoValue: function() {
      var depField = this.siblingField("permittedUserGroupSonstige").value;
      if (depField) {
        return true;
      } else {
        return false;
      }
    }
  },
  permittedUserGroup4Text: {
    type: String,
    defaultValue: "Sonstige:",
    denyInsert: true,
    denyUpdate: true
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
  titleAndLocationOfSystemText: {
    type: String,
    defaultValue: "Bezeichnung und Standord der Anlage",
    denyInsert: true,
    denyUpdate: true
  },
  operatingSystem: {
    type: String,
    label: "Eingesetztes Betriebssystem",
    defaultValue: "Z.B. SLES oder Windows Server mit Versionsangabe",
    max: 100
  },
  operatingSystemText: {
    type: String,
    defaultValue: "Eingesetztes Betriebssystem",
    denyInsert: true,
    denyUpdate: true
  },
  usedSoftware: {
    type: String,
    label: "Eingesetzte Software",
    defaultValue: "Bezeichnung der Software",
    max: 200
  },
  usedSoftwareText: {
    type: String,
    defaultValue: "Eingesetzte Software",
    denyInsert: true,
    denyUpdate: true
  },
  measuresForAvailability: {
    type: String,
    label: "Maßnahmen zur Sicherstellung der Verfügbarkeit der Daten",
    defaultValue: "Hier sollte, falls personenbezogene Daten lokal vorgehalten werden, z.B. auf Backup, Hardware-Redundanz, Virenbekämpfung, Wiederanlaufverfahren, Notfallkonzepte etc. eingegangen werden. Ansonsten reicht ein Verweis darauf, dass die personenbezogenen Daten z.B. aus SIM übernommen werden.",
    max: 400
  },
  measuresForAvailabilityText: {
    type: String,
    defaultValue: "Maßnahmen zur Sicherstellung der Verfügbarkeit der Daten",
    denyInsert: true,
    denyUpdate: true
  },
  measuresBayDSG: {
    type: String,
    label: "Weitere Maßnahmen nach Art. 7 und 8 BayDSG",
    defaultValue: "Hier folgen (auf das Wesentliche reduziert) Aussagen zu Zutritts- und Zugangskontrollkonzepten; Protokollierung von Eingaben; relevante Richtlinien und Arbeitsanweisungen; Maßnahmen zur Absicherung gegen unbefugten Zugriff Dritter; Sicherung der Vertraulichkeit beim Transport oder bei der Übermittlung von Daten etc.\n Typische Aussage: Der Betrieb erfolgt im zutrittsgeschützen LRZ-Rechnergebäude gemäß den aktuellen LRZ-Leitlinien zur Informationssicherheit. Die Zugangskontrolle erfolgt über eine Kopplung mit der LRZ-Benutzerverwaltung; insbesondere ist ein administrativer Zugriff nur von dedizierten Managementgateways aus möglich.",
    max: 1000
  },
  measuresBayDSGText: {
    type: String,
    defaultValue: "Weitere Maßnahmen nach Art. 7 und 8 BayDSG",
    denyInsert: true,
    denyUpdate: true
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

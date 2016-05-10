# Verfahrensbeschreibungen Manager

Diese Applikation ermöglicht es schnell und einfach Verfahrensbeschreibungen, sicher authentifiziert durch den Datenschutzbeauftragten und andere Mitarbeiter:
* zu erstellen
* zu bearbeiten
* zu löschen
* zu signieren und damit freizugeben
* mit Zeitstempeln zu versehen
* zu suchen, sortieren und verwalten
* zu exportieren
* (zu archivieren)
* (in einem Workflow zu behandeln)
* (statistisch auszuwerten)

Die Führung und Verwaltung von Verfahrensbeschreibungen und des zugehörigen Verfahrensverzeichnis werden laut dem Bayerischen Datenschutzgesetzes (BayDSG) verlangt und sind konkret in Artikel [26](http://gesetze-bayern.de/Content/Document/BayDSG-26) und [27](http://gesetze-bayern.de/Content/Document/BayDSG-27) definiert.

Artikel 26 verlangt explizit die schriftliche Form bei der Freigabe von Verfahrensbeschreibungen. Diese kann zu Gunsten einer voll-digitalen Verwaltung im Zusammenhang mit BGB §126a durch eine qualifizierte elektronische Signatur ersetzt werden. Diese ermöglicht es im Zusammenhang mit verschiedenen anderen Methoden wie chained Merkle-Trees und Logging die Integrität und Authentizität der Dokumente zu wahren.

## Abhängigkeiten zur Entwicklung

* [Meteor](https://www.meteor.com/install)
* Verbinudng zu LRZ LDAP Server ldaps://auth.sim.lrz.de

## Abhängigkeiten zum Installieren

* [Meteor](https://www.meteor.com/install)
* [Node 0.10.40](https://nodejs.org/download/release/v0.10.40/)
* MongoDB 2.4.10

## Ausführen
Mit dem Netz des LRZ verbinden (der LDAP Server muss zur Authentisierung erreichbar sein).
Das Verzeichnis /var/archives erstellen und mit den Rechten des ausführenden Users versehen.
Auf Mac OS X oder Linux `./starter` in einer Bash-Shell im Arbeitsverzeichnis ausführen.

## Installation

Bitte die angehängte Installationsanleitung befolgen.

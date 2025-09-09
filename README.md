# Redmine Block User Plugin

Ein Redmine 6 Plugin, das es ermöglicht, Benutzer aus spezifischen Tickets zu blockieren/löschen über Kommentar-Aktionen.

## Features

- Konfiguration von Ticket-IDs in den Plugin-Einstellungen
- Ticket-Suchfunktion: Intelligente Suche nach Tickets mit Autocomplete (Name oder ID)
- 3-Punkte-Menü bei Kommentaren für Benutzer-Aktionen
- Direkte Löschung von Benutzern über Kommentar-Interface
- Einfache Zugriffskontrolle (nur Anmeldung erforderlich)

## Installation

1. Plugin in das `plugins` Verzeichnis von Redmine kopieren:
   ```bash
   cd /path/to/redmine
   git clone https://github.com/leanderkretschmer/redmine_block_user.git plugins/redmine_block_user
   ```

2. Bundle installieren:
   ```bash
   bundle install
   ```

3. Datenbank migrieren:
   ```bash
   bundle exec rake redmine:plugins:migrate RAILS_ENV=production
   ```

4. Redmine neustarten

## Konfiguration

1. Als Administrator zu "Administration" > "Plugins" > "Redmine Block User Plugin" > "Configure" gehen
2. Ticket-IDs eingeben (kommagetrennt), für die die Benutzer-Blockierung aktiviert werden soll
3. Einstellungen speichern

## Verwendung

1. In einem konfigurierten Ticket zu den Kommentaren gehen
2. Bei jedem Kommentar erscheint ein 3-Punkte-Menü
3. "Benutzer löschen" auswählen, um den Kommentar-Autor zu löschen

## Zugriff

- Jeder angemeldete Benutzer, der die konfigurierten Tickets anzeigen kann, kann Benutzer löschen
- Keine speziellen Berechtigungen erforderlich

## Kompatibilität

- Redmine 6.x
- Ruby 3.x
- Rails 7.x

## Lizenz

MIT License
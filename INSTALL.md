# Installation Guide - Redmine Block User Plugin

## Voraussetzungen

- Redmine 6.x
- Ruby 3.x
- Rails 7.x
- Administrator-Zugriff auf Redmine

## Installationsschritte

### 1. Plugin herunterladen

```bash
cd /path/to/your/redmine/plugins
git clone https://github.com/yourusername/redmine_block_user.git
```

### 2. Abhängigkeiten installieren

```bash
cd /path/to/your/redmine
bundle install
```

**Hinweis:** Das Plugin verwendet keine zusätzlichen Gem-Abhängigkeiten, da alle benötigten Bibliotheken bereits von Redmine bereitgestellt werden.

### 3. Datenbank migrieren (falls erforderlich)

```bash
bundle exec rake redmine:plugins:migrate RAILS_ENV=production
```

### 4. Assets kompilieren

```bash
bundle exec rake assets:precompile RAILS_ENV=production
```

### 5. Redmine neustarten

```bash
# Für Apache/Passenger
touch tmp/restart.txt

# Für andere Webserver
sudo systemctl restart redmine
# oder
sudo service redmine restart
```

## Konfiguration

### 1. Plugin-Einstellungen

1. Als Administrator anmelden
2. Zu "Administration" → "Plugins" navigieren
3. "Redmine Block User Plugin" finden und auf "Configure" klicken
4. Ticket-IDs eingeben (kommagetrennt), für die die Funktion aktiviert werden soll
5. Einstellungen speichern

### 2. Berechtigungen setzen

1. Zu "Administration" → "Roles and permissions" navigieren
2. Gewünschte Rolle auswählen
3. Berechtigung "Block users from tickets" aktivieren
4. Speichern

## Verwendung

1. In einem konfigurierten Ticket die Kommentare anzeigen
2. Bei jedem Kommentar erscheint ein 3-Punkte-Menü (⋮)
3. "Benutzer löschen" auswählen
4. Löschung bestätigen

## Deinstallation

### 1. Plugin-Verzeichnis entfernen

```bash
rm -rf /path/to/your/redmine/plugins/redmine_block_user
```

### 2. Redmine neustarten

```bash
touch tmp/restart.txt
```

## Fehlerbehebung

### Plugin wird nicht angezeigt

- Überprüfen Sie die Dateiberechtigungen
- Stellen Sie sicher, dass alle Dateien korrekt kopiert wurden
- Überprüfen Sie die Redmine-Logs: `log/production.log`

### 3-Punkte-Menü erscheint nicht

- Überprüfen Sie, ob die Ticket-ID in den Plugin-Einstellungen konfiguriert ist
- Stellen Sie sicher, dass der Benutzer die erforderlichen Berechtigungen hat
- Überprüfen Sie, ob JavaScript und CSS korrekt geladen werden

### Benutzer kann nicht gelöscht werden

- Administrator-Benutzer können nicht gelöscht werden
- Benutzer können sich nicht selbst löschen
- Überprüfen Sie die Berechtigungen

## Support

Bei Problemen oder Fragen:

1. Überprüfen Sie die Redmine-Logs
2. Erstellen Sie ein Issue auf GitHub
3. Kontaktieren Sie den Plugin-Entwickler
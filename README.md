# Recipe Finder

Repo: https://github.com/Herotech1105/recipe_finder

Recipe Finder ist ein Tool aus zwei Webservern, mit dem:

* Rezepte geteilt werden können
* Nutzer Zutatenvoräte auf ihrem Account hinterlegen können
* Rezepte gesucht werden können, für die einem Nutzer nur maximal 2 Zutaten fehlen

## Architektur

Das Tool besteht aus einem Backend Spring-Boot Server als API und einem Frontend Vite/React Server als Viewpoint.

### Backend

Dateistruktur:

    src
    ├───main
    │   ├───java
    │   │   └───de
    │   │       └───innosystec
    │   │           └───backend_api
    │   │               │   BackendApiApplication.java
    │   │               │   
    │   │               ├───configuration
    │   │               │       (Konfigurationsdateien)
    │   │               │       
    │   │               ├───controller
    │   │               │       (Controller)
    │   │               │       
    │   │               ├───exception
    │   │               │   ├───authentication
    │   │               │   │       (Exceptions für Authentifizierung)
    │   │               │   │       
    │   │               │   ├───external
    │   │               │   │       (Exceptions für externe API)
    │   │               │   │       
    │   │               │   ├───recipe
    │   │               │   │       (Exceptions für Rezeptverwaltung)
    │   │               │   │       
    │   │               │   └───storage
    │   │               │           (Exceptions für Zutatenvoräte)
    │   │               │           
    │   │               ├───exception_handler
    │   │               │       (Exceptionhandler)
    │   │               │       
    │   │               ├───model
    │   │               │   ├───authentication
    │   │               │   │       (Datenklassen und Entities für Authentifizierung)
    │   │               │   │       
    │   │               │   ├───external
    │   │               │   │       (Datenklassen und Entities für externe API)
    │   │               │   │       
    │   │               │   ├───recipe
    │   │               │   │       (Datenklassen und Entities für Rezeptverwaltung)
    │   │               │   │       
    │   │               │   └───storage
    │   │               │           (Datenklassen und Entities für Voratsverwaltung)
    │   │               │           
    │   │               ├───repository
    │   │               │       (Repositories für Datenbank Entities)
    │   │               │       
    │   │               ├───service
    │   │               │       (Services)
    │   │               │       
    │   │               └───util
    │   │                       (Utility Klassen)
    │   │                       
    │   └───resources
    │       │   application.properties
    │       │   
    │       ├───db-migration
    │       │       (Anfangsentwurf für das Datenmodell)
    │       │       
    │       ├───static
    │       └───templates
    └───test
    ├───java
    │   └───de
    │       └───innosystec
    │           └───backend_api
    │               │   BackendApiApplicationTests.java
    │               │   
    │               └───service
    │                       (JUnit Tests für die Services)
    │                       
    └───resources
            (Integration Tests über IntelliJ-http)

### API-Endpoints

| Controller               | Methode | Pfad                                  | Beschreibung                                                                                                                                                                |
|--------------------------|---------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| HealthController         | GET     | /api/health                           | Abfragemöglichkeit für den Status der API, ohne Authentifizierung erreichbar                                                                                                |
| AuthenticationController | POST    | /auth/register                        | Registrierung eines Nutzers über unbenutzte Email und Nutzername und einem Passwort<br/>Gibt bei Erfolg den Nutzernamen und ein Json Web Token zur Authentifizierung zurück |
| AuthenticationController | POST    | /auth/login                           | Login eines Nutzers gemäß hinterlegter Anmeldedaten<br/>Gibt bei Erfolg den Nutzernamen und ein Json Web Token zur Authentifizierung zurück                                 |
| RecipeController         | GET     | /recipes/{id}                         | Gibt Detailinformationen über das Rezept mit der angegebenen Id aus                                                                                                         |
| RecipeController         | GET     | /recipes                              | Gibt Namen, Id und (Vorbereitet für MVP 2) Bildlink aller Rezepte aus                                                                                                       |
| RecipeController         | GET     | /recipes/{id}/nutrition               | Gibt die Nährwertdaten für die Zutaten des Rezepts mit der angegebenen Id aus                                                                                               |
| RecipeController         | GET     | /recipes/find                         | Grobe Suchlogik, gibt alle Rezepte aus, zu deren Zubereitung dem Nutzer nur maximal zwei Zutatenarten fehlen                                                                |
| RecipeController         | POST    | /recipes                              | Erstellt ein Rezept nach Validierung der Eingabe                                                                                                                            |
| RecipeController         | DELETE  | /recipes/{id}                         | Löscht das Rezept mit der Id, wenn authorisiert                                                                                                                             |
| RecipeController         | PUT     | /recipes/{id}                         | Ersetzt das Rezepz durch Eingabe, wenn diese valide und der Nutzer authorisiert ist                                                                                         |
| StorageController        | GET     | /storage/ingredients                  | Gibt alle Zutaten aus dem eigenen Vorat aus                                                                                                                                 |
| StorageController        | PUT     | /storage/ingredients/{ingredientName} | Setzt den Vorat der angegebenen Zutat auf die Eingabe                                                                                                                       |
| StorageController        | DELETE  | /storage/ingredients/{ingredientName} | Löscht die angegebene Zutat ganz aus dem Vorat                                                                                                                              |
| StorageController        | POST    | /storage/consumeRecipe/{recipeId}     | Verbraucht soweit möglich alle Zutaten des Rezepts aus dem eigenen Vorat (Einheit wird ignoriert)                                                                           |

### Authentifizierung

Im Backend kann nur auf die folgenden Endpoints ohne Authentifizierung zugegriffen werden:

* /api/health
* /auth/register
* /auth/login
* /error

Bei allen weiteren Endpoints erhält man einen 403 Forbidden Status, wenn man keinen validen Authorization-Header
mitschickt.  
In diesem muss ein JSON Web Token (JWT) enthalten sein, welcher sich einem Nutzer zuordnen lässt.  
Den JWT erhält der Nutzer bei der Anmeldung und dieser ist dann für 24 Stunden gültig.

### Frontend

Die grafischen Elemente des Frontends wurden durch KI erstellt.  
Die Logik und der Zugriff auf die API wurde danach selbst erstellt.

Dateistruktur:

    src
    │   App.css
    │   App.tsx (Lädt AuthPage wenn unauthentifiziert, sonst Dashboard)
    │   index.css
    │   main.tsx
    │       
    ├───components
    │       (Einzelne Komponenten fürs Dashboard)
    │       
    ├───dtos
    │       types.ts (Datenobjekte für Backend API)
    │       
    ├───pages
    │       AuthPage.tsx (Login- und Registrierungsformular)
    │       Dashboard.tsx (GUI für Backend API)
    │       
    ├───service
    │       RecipeService.ts (Fetch methoden an die Backend API)
    │       
    └───styles
            componentStyles.ts (Styles für Komponenten)
            pagesStyles.ts (Styles für Pages)

### Drittanwender API

Als Drittanwender API dient dem Backend openFoodFacts.  
Es wird bei der Erstellung einer neuen Ingredient-Entität bei der API die kcal der Zutat abgefragt und im Datenmodell
gespeichert.  
Für die Nutzung von openFoodFacts in einer Application ist eine Anmeldung erforderlich (Details unter Installation), die
Nutzung ist aber kostenfrei.

## Installation

Für die Installation werden Maven und Npm benötigt.
Außerdem sollte eine Anmeldung bei openFoodFacts erfolgen.  
Beim Start sollte zuerst das Backend hochgefahren werden. Hierbei sollten die folgenden Umgebungsvariablen gesetzt sein:

* token-secret: Schlüssel, für die JWT-Verschlüsselung
* admin-password: (optional) Standardpasswort für einen Nutzer (hat entgegen dem Namen keine besonderen Rechte, bei
  Änderung müssen die Integrationstests angepasst werden)
* demo-password: (optional) Standardpasswort für einen Nutzer (bei Änderung müssen die Integrationstests angepasst
  werden)
* OPEN_FOOD_FACTS_USERNAME: Anmeldedaten für openFoodFacts
* OPEN_FOOD_FACTS_PASSWORD: Anmeldedaten für openFoodFacts

Danach lässt sich das Spring Backend über `.\mvnw spring-boot:run` im backend-root-Verzeichnis starten.  
Das Frontend lässt sich über `npm run dev` im frontend root-Verzeichnis starten.

## Tests

Es wurden 3 jUnit-Test Klassen für die einzelnen services implementiert.  
Diese lassen sich über `.\mvnw test` im backend-root-Verzeichnis starten.  
Zusätzlich wurden noch 4 Integration tests über IntelliJs http client geschrieben. Um diese auszuführen, muss das
Backend hochgefahren sein.  
Bei diesen Tests wird die API über http-requests angesprochen und die Antworten werden dann auf korrektes Verhalten
überprüft.  
Es werden also auch Daten in die Datenbank übernommen, weswegen diese Tests niemals unter einer Production-Umgebung
ausgeführt werden dürfen.

## Ideen für MVP 2

Die folgenden Ideen wären mögliche Umsetzungen für ein MVP 2:

| Feature              | Beschreibung                                                                                         |
|----------------------|------------------------------------------------------------------------------------------------------|
| Suchqueries          | Suche von Rezepten nach Name, Nutzer oder Zutaten in der API                                         |
| Suchsortierung       | Sortierung der Suchergebnisse nach Name, Id, Zutaten, Erfolgskriterium im Frontend                   |
| Deployment           | Einfaches Deployment über Docker                                                                     |
| Production-Datenbank | Verwendung einer PostgreSQL-Datenbank für ein Production-Build                                       |
| Rezeptbilder         | Bei der Erstellung eines Rezepts kann ein Bild angegeben werden. Schönere Visualisierung im Frontend |

## Hilfsmittel

* Webrecherche
* Gemini KI für Review und Fehleranalyse
* Gemini KI für die Generierung der Frontend GUI 
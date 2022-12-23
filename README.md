# The Urantia Book Mobile, React Native App

This code repo stores a React Native app that allows reading The Urantia Book
in 20 or more languages.  The number of languages is extensible purely from
configuration.


## Overview

This app allows fully-offline reading of a The Urantia Book—a complex 4-part, 197-chapter philosophic text—in multiple
languages. Within the app, users select multiple languages, which triggers the downloading of a SQLite database with the 
book's contents. 

Reading of the book contents itself is a straightforward "drill down" into a given chapter (named a "paper"), and then section.
Sections may be moved between with the user interface.  A search engine allows those doing deeper study to quickly find
key terms; this technique has been popular since the early 1990s among the readership when the first digitial editions of 
the book first became available.

Settings are rudimentary, except for the managing of downloaded and viewed languages.  Weaving two languages into a section's
viewable window is supported, for more advanced students.

The app is 100% free, ad-free, tracking-free. This app is core to Urantia Foundation's to make this text available globally.


## How to Build

TODO


## Config store

Beyond the config files that ship with APK distribution itself, the
app downloads the following files from an web URL (which is 
configurable in the app's core config store but presently is an
AWS S# bucket hosted by Urantia Foundation's core I.T. solutions
provider):

* **[languages.json](https://s3.amazonaws.com/urantia/app/prod/db/languages.json)** — Basic index of all available languages and their names and copyright date.  _Prefix_ attribute used to switch into other datastores.
   * It appears the _Version_ attribute is a GUID that can be used to determine if a language update is needed in the app.
* **[localizations-db.json](https://s3.amazonaws.com/urantia/app/prod/db/localizations-db.json)** — Localized text for all UI elements in the app, across all languages.
   * An array, not a dictionary.  Suggest searching using _Prefix_ attribute obtainable from languages.json
* **[localizations-version.json](https://s3.amazonaws.com/urantia/app/prod/db/localizations-version.json)** — Apparently a separate file with a GUID indicating the version of localization-db.json and if it needs to be downlaoded again.
   * Possibly a strategy to make payload smaller than downloading all of localizations-db.json at once.
* **_\<lang\>_-urantia.db** — An uncompressed SQLite databse contianing all the text of The Urantia Book for this language.
   * where _lang_ is the three-letter _Prefix_ attribute from languages.json
   * Examples: [English database](https://s3.amazonaws.com/urantia/app/prod/db/eng-urantia.db);  [Spanish Latin-America database](https://s3.amazonaws.com/urantia/app/prod/db/spa-urantia.db) 
   * This is built from a mysql core database using mysql2sqlite conversion tool.  This build process in not part of this codebase at this time.
   * Most table named start with _Prefix_.  The schema is relatively straightword.
   * Built with FTS full-text-searh support tables.

Some of these files (TODO: languages.json and lacoalizations-version.json???) are downloaded upon app launch to determine if
updates are needed.  If so, then the user acknowledges the update process and the additional needed files are downloaded and
the app is restarted.

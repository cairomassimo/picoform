# picoform

## Getting started - Deploy

**NB**: Most commands are interactive and/or require user intervention. Run these steps carefully one-by-one. Please understand each command and do not run them blindly. Some steps may be not applicable to your current situation.

1.  Make sure that:

    - the repository was cloned successfully,
    - the repository root is the current directory,
    - you are using a Bash-like shell,
    - commands `node`, `npm` and `npx` are available.

2.  Install dependencies

    ```
    npm i
    ```

    NB: this also installs `firebase-tools`, needed for deploy (within `node_modules/` in the current directory).

3.  Create a Firebase project

    Visit https://console.firebase.google.com/ to create a new Firebase project.

4.  Login to Firebase from CLI

    ```
    npx firebase login
    ```

5.  Select the Firebase project to use

    Run

    ```
    npx firebase use --add
    ```

    and pick your newly-created Firebase project.
    Then, type `main` as alias (or any other alias at your choice).

6.  Create a Web app within Firebase project

    Run

    ```
    npx firebase apps:create web web
    ```

    (or use the Firebase web console) to create a web app.

7.  Retreive and save web SDK config

    Run the commands

    ```
    npx firebase apps:sdkconfig web --out src/firebase-config-snippet.js.txt
    cat src/firebase-config-prepend.js.txt src/firebase-config-snippet.js.txt > src/firebase-config.js
    ```

    which create a file `src/firebase-config.js` containing the code to initialize Firebase on the client.

8.  Build the client locally

    ```
    npm run build
    ```

9.  Deploy

    ```
    npx firebase deploy
    ```

10. Enable Firestore

    From the Firebase Web console (TODO).

11. Enable Anonymous Authentication on Firebase

    From the Firebase Web console (TODO).

12. Create a private key for admin

    - Go to https://console.firebase.google.com/u/0/project/_/settings/serviceaccounts/adminsdk
    - Choose your project
    - Choose "Generate new private key"
    - Move the file to the project root and rename it to `firebase-admin-private-key.json`

13. Configure number of answers

    ```
    GOOGLE_APPLICATION_CREDENTIALS="./firebase-admin-private-key.json" npx ts-node scripts/admin.ts set-questions 20
    ```

    (change `20` to the actual number of questions in your use case)

14. Start accepting submissions

    ```
    GOOGLE_APPLICATION_CREDENTIALS="./firebase-admin-private-key.json" npx ts-node scripts/admin.ts allow-submit
    ```

15. Monitor recent submissions

    ```
    GOOGLE_APPLICATION_CREDENTIALS="./firebase-admin-private-key.json" npx ts-node scripts/admin.ts get-submissions --tail --follow
    ```

    will output something like

    ```
    {"token":"524545","time":"2022-01-24T15:33:14.008Z","submissions":["1000","8","47","39","35","14","40","26","98","26","29","17","20","82","0","10","1","11","0","0"],"uid":"XpsZfUG4h3mXLCzuW6DSsrH70lgQ"}
    {"token":"524545","time":"2022-01-24T15:47:28.223Z","submissions":["1000","8","47","39","35","14","40","26","98","26","29","17","20","82","0","10","1","11","0","0"],"uid":"XpsZfUG4h3mXLCzuW6DSsrH70lgQ"}
    {"token":"524545","time":"2022-01-24T15:47:38.672Z","submissions":["1000","8","47","39","35","14","40","26","98","26","29","17","20","82","0","10","1","11","0","0"],"uid":"XpsZfUG4h3mXLCzuW6DSsrH70lgQ"}
    ```

16. Stop accepting submissions

    ```
    GOOGLE_APPLICATION_CREDENTIALS="./firebase-admin-private-key.json" npx ts-node scripts/admin.ts block-submit
    ```

17. Download and save all submissions

    ```
    GOOGLE_APPLICATION_CREDENTIALS="./firebase-admin-private-key.json" npx ts-node scripts/admin.ts get-submissions > submissions.json
    ```

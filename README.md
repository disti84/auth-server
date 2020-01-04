# oauth2-test
Oauth2 and socket-test server
Simple authorization server using access token and refresh token and provide a google and facebook login.
## run locally 

Clone the repo

```shell
git clone https://github.com/disti84/oauth2-test.git
```

Configure the project

edit the `.env` file in the root of the project.
```
FACEBOOK_CLIENT_ID = 245872605906905
FACEBOOK_CLIENT_SECRET = **********
GOOGLE_CLIENT_ID = 796039115979-rsimds98j3ii2pa27qm3svj7pa6eb5i5.apps.googleusercontent.com
JWT_SECRET_PASSWORD = secretPassToEncodeJWTs
```

Launch the application with the `local` script.

```shell
npm install
#npm start
```

Open the browser at http://localhost:4500

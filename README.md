# era-cloud 
dCloud with https://gun.eco ⚡️ (actually, this is experimental but I managed to do pretty awesome things with it!)

Working prototype at https://ec-back-end.herokuapp.com or use the docker image :
```sh
$ docker pull ghcr.io/noctisatrae/era-cloud:master
```

## Documentation
`/download?id=[ID Here]` - Download a file using his ID ! (`GET` Request) \
`/upload` - Make a `post` request with a file.

⚠ - Warning! Make sure to save the ID of the file you upload. You'll need it to download your file !

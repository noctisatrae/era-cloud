# era-cloud 
dCloud with https://gun.eco ⚡️

I didn't manage to make it work on Heroku because of the weird file system (my theory). I would have wanted to make a Digital Ocean droplet but I can't right know. Therefore, the github website & the back-end don't work. However, you can use the Docker image I just set up by typing :
```sh
$ docker pull ghcr.io/noctisatrae/era-cloud:master
```

## Documentation
`/download?id=[ID Here]` - Download a file using his ID ! \
`/upload` - Make a `post` request with a file.

⚠ - Warning! Make sure to save the ID of the file you upload. You'll need it to download your file !

# CEV Live Timing Dashboard

Monitoring vehicle metrics.

Make sure the Docker engine is running (Mac and Windows need to download the Docker app). To start, run

```
docker compose up --build
```

This starts the frontend react app, backend, and a Redis server all at the same time on Docker. The specific environments for the frontend and backend is configured in `frontend/Dockerfile` and `backend/Dockerfile`, respectively. Refer to `docker-compose.yml` for more details on what port and what environment variables to pass into these microservices.

### Deployment onto Heroku server

Since Heroku only allows you to deploy one container onto their server (no SSH or anything either), we must consolidate everything into one single container: `Dockerfile.heroku`. Since each Dockerfile only has one command to run at the end, we will use `supervisord.config` to run various commands in the background all at once, with other features like restart, logging and such (better than a bash script).

```
docker build --platform linux/amd64 -f Dockerfile.heroku -t registry.heroku.com/live-timing-dash/web .
docker push registry.heroku.com/live-timing-dash/web
heroku container:release web --app live-timing-dash
```

Build the image with `linux/amd64` to make it compatible with the actual servers running at Heroku. We need to tag each docker container with `registry.heroku.com/live-timing-dash/web` for it to release properly. Then we push it over to the registry what heroku uses for this specific live-timing-dash app. Then we can then use it to release to the linux.

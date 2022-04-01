# HW4 Documentation

## Commands

```bash
 # Create NGINX docker image (from directory where docker file exists)
 docker build -t nginx

# Running the docker image
docker run -it -d -p 80:80 --name [image name] [created image]

# Running Mongo Image
docker run -d -p 27017:27017 --name [name to give] mongo:latest

# Default portainer command
docker run -d -p 8000:8000 -p 9443:9443 -p 9000:9000 --name portainer2 \
    --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    cr.portainer.io/portainer/portainer-ce:2.9.3

 ```

## NGINX Image

- A config file for NGINX exists inside "./nginx" directory and it tells docker image to use it as the default config file (hw0.html as root page)

- copies needed files (hw0.html and lolli.jpg) inside the nginx contianer

## MONGO Image

- use docker compose to run the image

## Postfix Image

- Use the command above

  - Deploy and manage web based virtual desktops.
  - Deploy Taisun specific stacks of applications
  - Browse available images on popular Docker repositories
  - Import a Docker project from any git repository and start developing on your choice of web based IDE or full Linux desktop
  - Spinup a developer container based on popular frameworks and work from a web based IDE

### QuickStart

On a Docker enabled host run the following command from cli:
```
sudo docker run --name taisun -d \
--restart always \
-p 3000:3000 \
-v /var/run/docker.sock:/var/run/docker.sock \
linuxserver/taisun:latest
```
Taisun will be available by accessing:

http://localhost:3000

## Documentation:

[Installation](https://github.com/Taisun-Docker/taisun/wiki/Installation)
  - [Linux](https://github.com/Taisun-Docker/taisun/wiki/Linux)
  - [Windows](https://github.com/Taisun-Docker/taisun/wiki/Windows)
  - [Synology DSM](https://github.com/Taisun-Docker/taisun/wiki/Synology)

[Usage](https://github.com/Taisun-Docker/taisun/wiki/Usage)
  - [Stack Management](https://github.com/Taisun-Docker/taisun/wiki/Stacks)
  - [Image Management](https://github.com/Taisun-Docker/taisun/wiki/Images)
  - [Virtual Desktops](https://github.com/Taisun-Docker/taisun/wiki/VDI)
  - [Remote Access](https://github.com/Taisun-Docker/taisun/wiki/Gateway)

[Development](https://github.com/Taisun-Docker/taisun/wiki/Development)
  - [Create Stack Templates](https://github.com/Taisun-Docker/taisun/wiki/Templates)
  - [Taisun Development](https://github.com/Taisun-Docker/taisun/wiki/Taisundev)
  - [Development Containers](https://github.com/Taisun-Docker/taisun/wiki/YourApp)

##### License:
WTFPL

# AWS Project 02 — CLOUDLAB EC2 Linux Web Server

A hands-on AWS cloud engineering portfolio project: deploy a Linux web server on Amazon EC2, install and configure Apache, upload a custom static dashboard, and deliver it through Amazon CloudFront.

## Project status
**Core deployment completed and tested.** Availability of the public URL depends on the EC2 instance, origin configuration, and distribution remaining active. Dashboard values are illustrative UI, **not live EC2 monitoring**.

## Architecture

```text
Visitor (browser)
       |
       | HTTPS
       v
Amazon CloudFront
       |
       | HTTP port 80 (origin connection)
       v
Amazon EC2 — Amazon Linux 2023
       |
       v
Apache HTTP Server (httpd)
       |
       v
/var/www/html/
  ├── index.html
  ├── style.css
  └── script.js
```

**Note:** CloudFront redirects viewers from HTTP to HTTPS, but the CloudFront-to-EC2 origin connection in this project uses HTTP. It is not end-to-end TLS.

## Technologies

| Technology | Role |
| --- | --- |
| Amazon EC2 | Virtual Linux server |
| Amazon Linux 2023 | Server operating system |
| Apache httpd | Serves website files |
| Amazon CloudFront | CDN and viewer-facing HTTPS |
| EC2 security group | Controls inbound network traffic |
| SSH | Remote Linux administration |
| SCP | Copies local website files to EC2 |
| VS Code | Local website editing |
| HTML, CSS, JavaScript | Static CLOUDLAB dashboard |

## Deployment summary

1. Launched an Amazon Linux 2023 EC2 `t3.micro` instance in `eu-north-1` (Stockholm) with an 8 GiB gp3 root volume.
2. Configured inbound SSH (TCP 22) restricted to the administrator's public IP and HTTP (TCP 80) for website access.
3. Connected from Windows PowerShell to the instance using an SSH key.
4. Installed and enabled Apache:
   ```bash
   sudo dnf install httpd -y
   sudo systemctl start httpd
   sudo systemctl enable httpd
   sudo systemctl status httpd
   ```
5. Created `index.html`, `style.css`, and `script.js` locally in VS Code.
6. Uploaded files with SCP and copied them to `/var/www/html/`.
7. Confirmed the dashboard loaded from the EC2 web server over HTTP.
8. Configured CloudFront with the EC2 public DNS as a custom HTTP origin and verified the dashboard over viewer-facing HTTPS.

## What I learned

- How a cloud virtual machine differs from my local Windows PC.
- How to connect to Linux using SSH from PowerShell.
- How to install, start, enable, and inspect a Linux service with `systemctl`.
- How inbound security group rules affect SSH and web traffic.
- How to move website files to a remote server using SCP.
- How Apache serves files from its document root.
- How a CDN sits between a browser and an origin web server.
- Why HTTPS to CloudFront does not automatically mean HTTPS to the origin.

## Repository contents

- `README.md` — project overview and architecture
- `docs/deployment.md` — repeatable deployment steps
- `docs/linux-commands.md` — commands practiced and explained
- `docs/security-and-costs.md` — security considerations and cost cleanup
- Website source files (`index.html`, `style.css`, `script.js`) and screenshots will be added from the original local project folder.

## Security note

Never commit `.pem` SSH private keys, AWS credentials, or secrets. For a production deployment, prefer HTTPS between CloudFront and the origin, use a stable origin address, and consider tighter origin access controls.

## Cost note

EC2 compute, EBS storage, public IPv4 addresses, CloudFront usage, and data transfer can incur charges depending on account benefits and usage. Stopping EC2 stops compute charges but does not necessarily eliminate EBS or public IPv4 charges, and the website origin will be unavailable.

## Portfolio scope

This is a beginner cloud infrastructure and deployment project, **not** a production-grade monitoring dashboard. The goal was to understand EC2, Linux administration, web serving, file transfer, networking, and CDN delivery.

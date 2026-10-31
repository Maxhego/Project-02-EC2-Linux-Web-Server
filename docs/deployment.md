# Deployment guide — AWS EC2 + Apache + CloudFront

This guide records the Project 02 deployment procedure and CloudFront configuration. Instructions to verify a result are not evidence that the check passed. The project notes report an EC2 HTTP browser check and the README previously reported viewer-facing HTTPS; the committed dashboard captures do not show a URL or TLS details. Current AWS resource state and endpoint availability were not checked in this documentation review. Replace placeholders with values from **your own** AWS account. Do not publish private keys.

## 1. Launch EC2
- AWS Region: Stockholm (`eu-north-1`)
- Instance name: `Project-02-Linux-Dashboard`
- AMI: Amazon Linux 2023
- Instance type: `t3.micro`
- Root storage: 8 GiB gp3
- Create or select an SSH key pair and store the private key securely.

## 2. Security group
- TCP 22 (SSH): **your current public IP /32**, not the whole internet.
- TCP 80 (HTTP): open for the website origin in this learning deployment.
- Consider additional origin restrictions and TLS for production.

## 3. SSH from Windows PowerShell
```powershell
ssh -i "$HOME\Documents\Project-02-Linux-Key.pem" ec2-user@<EC2_PUBLIC_IP>
```
Your prompt changes to a Linux shell when connected. The `uptime` command will not run natively in Windows PowerShell; run it **after** SSH or via `ssh ... "uptime"`.

## 4. Install Apache
```bash
sudo dnf install httpd -y
sudo systemctl start httpd
sudo systemctl enable httpd
sudo systemctl status httpd
```
Open `http://<EC2_PUBLIC_IP>` to verify the web server responds.

## 5. Build the website locally
Create the three files in VS Code:
```text
Project 02 - Linux Server Dashboard/
├── index.html
├── style.css
└── script.js
```

## 6. Upload website files
Run this **from local PowerShell**, not inside the SSH session:
```powershell
scp -i "$HOME\Documents\Project-02-Linux-Key.pem" ".\index.html" ".\style.css" ".\script.js" ec2-user@<EC2_PUBLIC_IP>:/home/ec2-user/
```
The relative paths assume PowerShell is opened in the local dashboard folder.

Then connect with SSH and run:
```bash
sudo cp /home/ec2-user/index.html /var/www/html/
sudo cp /home/ec2-user/style.css /var/www/html/
sudo cp /home/ec2-user/script.js /var/www/html/
sudo systemctl status httpd
```
Verify the updated website in the browser.

## 7. Configure CloudFront
- Create a CloudFront distribution with a **custom origin**.
- Origin domain: the EC2 **public IPv4 DNS hostname** (not the IP pasted into a URL).
- Origin protocol: HTTP only, port 80.
- Viewer protocol policy: Redirect HTTP to HTTPS.
- Default root object: `index.html`.
- Wait until distribution deployment completes and visit its `https://` domain.

The recorded distribution name is `CLOUDLAB-Project-02`. This does not establish its current deployment or enabled state.

HTTPS protects the browser-to-CloudFront connection only. CloudFront-to-EC2 traffic uses HTTP on port 80; this is not end-to-end TLS. The redirect policy is documented configuration, with no committed redirect response evidence.

## 8. Validate and troubleshoot

The checks below are a repeatable validation plan, not completed test results. On a future run, retain dated, redacted output and the endpoint tested:

| Check | Evidence to retain | What it establishes |
| --- | --- | --- |
| Direct EC2 HTTP | Browser URL and page capture, or `curl -I http://<EC2_PUBLIC_DNS>/` plus a page check | HTTP origin response at that time |
| CloudFront HTTPS | Browser capture with the CloudFront HTTPS URL and certificate details, plus dashboard rendering | Viewer-facing TLS and page delivery at that time |
| Viewer redirect | `curl -I http://<CLOUDFRONT_DOMAIN>/` showing redirect status and HTTPS `Location` | HTTP-to-HTTPS redirect for that request |
| Origin configuration | Redacted CloudFront settings showing origin hostname, HTTP-only policy and port 80 | Configured origin transport; a viewer HTTPS response alone cannot prove this |
| Distribution state | Dated console capture showing deployment complete and enabled state | Resource state at capture time, not ongoing availability |

A cached CloudFront response can load even when the origin is unavailable. To claim current origin retrieval, separately check the origin and retain evidence of a fresh origin fetch (for example, a unique test object with a matching Apache access-log entry). Do not describe a cached page load as a complete origin-health test.

The existing UI screenshots lack browser chrome. Their HTTP labels and “Dashboard loaded” badge are hard-coded HTML, while the page-load time comes from client JavaScript. They do not verify TLS, AWS configuration, server health, or deployment time.

```bash
whoami
pwd
cat /etc/os-release
uptime
free -h
df -h
sudo systemctl status httpd
```
- If SSH times out, check instance state, IP address, and security group SSH source.
- If Apache default page appears, confirm `index.html` is in `/var/www/html/`.
- If CSS/JS is missing, check uploaded filenames and HTML references.
- If CloudFront shows stale content, allow cache expiration or invalidate relevant paths.
- Stopping and restarting an instance can change its public IP/DNS unless a stable address is configured. Update CloudFront origin if necessary.

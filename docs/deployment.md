# Deployment guide — AWS EC2 + Apache + CloudFront

This guide documents the steps used in Project 02. Replace placeholders with values from **your own** AWS account. Do not publish private keys.

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

This project's distribution was named `CLOUDLAB-Project-02`.

## 8. Validate and troubleshoot
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

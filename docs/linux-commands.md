# Linux and deployment command reference

Commands marked **Linux** run after connecting to EC2 through SSH. Commands marked **PowerShell** run on the local Windows computer.

| Command | Where | Purpose |
| --- | --- | --- |
| `ssh -i "<key.pem>" ec2-user@<ip>` | PowerShell | Connect securely to EC2 |
| `scp -i "<key.pem>" <files> ec2-user@<ip>:<path>` | PowerShell | Upload local files |
| `whoami` | Linux | Show logged-in username |
| `pwd` | Linux | Show current directory |
| `ls` | Linux | List files |
| `cat /etc/os-release` | Linux | Identify Linux distribution |
| `uptime` | Linux | Server uptime and load averages |
| `free -h` | Linux | Human-readable memory usage |
| `df -h` | Linux | Human-readable filesystem usage |
| `top` | Linux | Live process and resource view; press `q` to quit |
| `sudo dnf install httpd -y` | Linux | Install Apache |
| `sudo systemctl start httpd` | Linux | Start Apache |
| `sudo systemctl enable httpd` | Linux | Enable Apache at boot |
| `sudo systemctl status httpd` | Linux | Inspect Apache service |
| `sudo cp <source> /var/www/html/` | Linux | Copy site files to Apache document root |
| `exit` | Linux | Close SSH session |

## Key learning: PowerShell vs Bash

A local `PS C:\...>` prompt is Windows PowerShell. The remote `[ec2-user@... ~]$` prompt is the Linux shell. Typing `uptime` at the Windows prompt results in a command-not-found error because it is a Linux utility.

To execute one remote command without opening an interactive session:

```powershell
ssh -i "$HOME\Documents\Project-02-Linux-Key.pem" ec2-user@<EC2_PUBLIC_IP> "uptime"
```

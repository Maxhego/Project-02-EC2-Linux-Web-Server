# Security, limitations, and cost management

## Security configuration used
- SSH (TCP 22) restricted to the administrator's public IP address (/32).
- HTTP (TCP 80) accessible so CloudFront can reach the EC2 origin.
- SSH key authentication used for administration.
- Viewer HTTP requests redirected to HTTPS by CloudFront.

## Important limitations
- **Not end-to-end encrypted:** browser → CloudFront uses HTTPS; CloudFront → EC2 uses HTTP.
- **Public origin:** visitors may be able to access the EC2 server directly on port 80, bypassing CloudFront.
- **Dynamic origin address:** the EC2 public IPv4 address/DNS may change when the instance is stopped and restarted.
- **Static dashboard:** UI cards are not real-time server metrics.

## Potential improvements
- Enable TLS at the origin and configure CloudFront to use HTTPS to the origin.
- Use a stable origin hostname and appropriate origin access restrictions.
- Apply least-privilege security group rules and regular system updates.
- Add CloudWatch metrics and real dashboard data in a future iteration.
- Add screenshots and verify no secrets are included in images.

## AWS charges and cleanup
Depending on account eligibility and actual usage, charges may arise from:
- EC2 compute time
- EBS volume storage (even while instance is stopped)
- Public IPv4 addresses
- CloudFront requests and data transfer
- Other networking or data-transfer charges

**Stopping EC2 is not a complete cleanup.** If the instance is stopped, Apache cannot respond to new CloudFront origin requests, though previously cached content may persist temporarily.

When the demonstration is no longer needed, review billing, stop or terminate the instance as appropriate, remove unused EBS volumes and addresses, and disable/delete CloudFront resources if they are no longer required. Deleting infrastructure is irreversible for data not backed up.

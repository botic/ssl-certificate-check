# ssl-certificate-check

Checks the expiration of SSL certificates and sends a notification if's is about to expire.

## Usage

```
ringo main.js <your-postmark-token> <from> <to> <expiration-in-days> <domain1> <domain2> ...
```
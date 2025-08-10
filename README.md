# Easy-Backend
A easy-dev backend using Typescript

## Setup
### ENV
Add `.env` on project root and set this variables:
```bash
PORT = "<API_PORT>"
```
### HTTPS
Install Windows [OpenSSL](https://slproweb.com/products/Win32OpenSSL.html) and add it to path. After installation, open `src/config` on terminal and use:
```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes
```
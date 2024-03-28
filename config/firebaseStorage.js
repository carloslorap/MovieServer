import { getStorage } from "firebase-admin/storage";
import { cert, initializeApp } from "firebase-admin/app";
import dotenv from "dotenv";

dotenv.config();

initializeApp({
  credential: cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOaug03nheHMEo\nxR+qth0Ub83IeDgU0cB9IwUyeoF369oKwtWmFVzdgaWaqUIC0lVkOLGbJDWAJOrk\n/U1IOv65PohUURm2TJMwJ0C3fA7se6unJA7oOCFX9ZE0T8Ym76EgYi3HHOXmOtsJ\nnOaAM6NnOwhlSAWiRcVyt0EQIsIGspCx0tQR5Oyl6STUidirVrm/qQ7nokKD3XKy\ngdgLN1LEAEh+5BAgpfy7uZiEX1oJpQUG16Zbv7kIroFVOvgmy8b0REfqtX+nE26W\ncHyeRqX3+FPiToPLEbrVByzifGYi55JnCKyvRtW0cmrSNm3PeV0KaOivTl8ddvQL\nnqtScmR/AgMBAAECggEAKoMfHuBgxvVCHPz4SCbot1BNgAeueS835y3iwKI1bvbe\nuc+lw+ZrcV1lt4Q7iaw7FQCOJ6cd863myNGYbJNl6c4EsuTfGEoOGGFFNWTyB+dy\nk2JcRZxl1aFITg9N/q/krfA6gGMlwDSH7yNm36mC8lxYns9mBaU8BKPUXRfjgRBA\nACdlpz6Un8TrR00Zss+8HGSj/xCU9vcvGggPPf0zRyS5KtRXPSnnTSRPp41s1Dcy\nDvuOL9CquJezbJg5m02AyUlFwxB0J0WtjThhhdGuV77gsFHSGl8YPBVMwQycN5cc\nyxDBn9KOTO7XxskIVXrWluha7VBupiaUo1pi7NKD2QKBgQDrmc3n7FW9OFSrGR7s\n/No6eY/bwD7EQdtJznwLTKOoFNVoqZPUoiDbhvI/WXSnyFgS+SyroLCW5ld4H/5q\nWolj1PDeQcCiWhiZc9XF9R3Ak0BFNoJY4eFNQEKgHtnj+A0fXgQZgW5A9qyF3+bU\nxWDT7bxruR60XusySS0X519rWQKBgQDgSj6QsnnNlTWpRHPmuTj8yqGjIzR+Y8QU\nyDvUgDTnuKkBR5YVql4p6590yRE1wafdmDwbkGpv8G5iJUhsT+Jz/NCx4y3zDQwJ\n2rtvgRbWQAYudIUBwm1sFsD8vFNnWr80yxnSwNLD9WO13B1CLqaEbp6Wvk3cv3Oz\nsAuzno9LlwKBgQDTREhwAG2iEDFcfFpPCS5n4TovRGUEeEm8FX0GZOMchhIYmHgH\n5JqyQIBabk09Z1oTKX31KVMw/bzR616o4Cbzbq/Pngavjzsf38+ChBr55RFs/0RD\nj8oJC+ayzvd0haq+xf/HH1lOx+RM6EqF4bjCUhz0PDxcYgFmRlg5ZzEZgQKBgAhX\nGm59BIR9iOpLblflCVZ1Hn+Xfos4oID5VSg4wD7hof83L0CM/kVmyp4oH+i0084s\nrAeGXj7dXO1vX3sPmWcgvo3u2bWRBaKULKYf0b6T0OcHVC7VkQYU7oY3Zo6QVE3d\nQ4+PtgataFDJ55ifbXe9OU53syODRwUmhbjfK4rvAoGBAL0LwqUfZbbJywMt7THT\n4r7kPO7ozCgnvsu7TaNofPEwdUlRuVdgHq35CfYKV3Nb8XX9Ij6zO7EXtZb941Hi\nbinR+EpvLBTKUq2KZ3sRAvFS80i9nQJuVWxxhKFOEQV/7TbTZYcXE7LnlCc3RNy1\n4+FV57EMVrmceKUfRIUomO29\n-----END PRIVATE KEY-----\n",
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain:process.env.UNIVERSE_DOMAIN,
  }), 
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const storage = getStorage().bucket();

export default storage;

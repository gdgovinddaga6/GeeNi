# Official gallery photos

Drop photos and videos you want on the Gallery page into this folder, then run:

```bash
npm run sync:gallery
```

The script uploads files to `s3://$AWS_S3_BUCKET/gallery/official/`.

Do not commit the media files themselves. Keep binaries out of git and sync them to S3 instead.

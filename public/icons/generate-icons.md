# PWAアイコン生成

PWAアプリには以下のサイズのアイコンが必要です：

## 必要なアイコンサイズ
- 72x72.png
- 96x96.png
- 128x128.png
- 144x144.png
- 152x152.png
- 192x192.png
- 384x384.png
- 512x512.png

## 生成方法

1. ベースとなる高解像度のロゴ画像を用意
2. オンラインツール（Favicon Generator等）でバッチ生成
3. または、以下のコマンドで一括変換：

```bash
# ImageMagickを使用した例
convert base-icon.png -resize 72x72 icon-72x72.png
convert base-icon.png -resize 96x96 icon-96x96.png
convert base-icon.png -resize 128x128 icon-128x128.png
convert base-icon.png -resize 144x144 icon-144x144.png
convert base-icon.png -resize 152x152 icon-152x152.png
convert base-icon.png -resize 192x192 icon-192x192.png
convert base-icon.png -resize 384x384 icon-384x384.png
convert base-icon.png -resize 512x512 icon-512x512.png
```

現在は、Viteのデフォルトアイコンを各サイズに変換して使用しています。
#!/bin/bash
# Download GFPGAN weights for SadTalker face enhancement
cd "$(dirname "$0")/SadTalker"
mkdir -p gfpgan/weights

echo "Downloading GFPGAN weights..."

curl -L -o gfpgan/weights/alignment_WFLW_4HG.pth \
  "https://github.com/xinntao/facexlib/releases/download/v0.1.0/alignment_WFLW_4HG.pth"
echo "1/4 done"

curl -L -o gfpgan/weights/detection_Resnet50_Final.pth \
  "https://github.com/xinntao/facexlib/releases/download/v0.1.0/detection_Resnet50_Final.pth"
echo "2/4 done"

curl -L -o gfpgan/weights/GFPGANv1.4.pth \
  "https://github.com/TencentARC/GFPGAN/releases/download/v1.3.0/GFPGANv1.4.pth"
echo "3/4 done"

curl -L -o gfpgan/weights/parsing_parsenet.pth \
  "https://github.com/xinntao/facexlib/releases/download/v0.2.2/parsing_parsenet.pth"
echo "4/4 done"

echo "All GFPGAN weights downloaded!"
ls -lh gfpgan/weights/

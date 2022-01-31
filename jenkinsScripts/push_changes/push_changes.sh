git config --global user.name "cjuan-code"
git config --global user.email "cjuaniestacio@gmail.com"
git remote set-url origin $3

git add README.md
git commit -m "Pipeline ejecutada por $1. Motivo: $2"
git push origin HEAD:master
git config --global user.name "cjuan-code"
git config --global user.email "cjuaniestacio@gmail.com"
git remote add origin $3

git add .
git commit -m "Pipeline ejecutada por $1. Motivo: $2"
git push origin master
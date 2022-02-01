if [ $2 -eq 0 ] && [ $3 -eq 0 ] && [ $4 -eq 0 ]; then
    vercel . --token $1 --confirm --name cjuan-jenkins-exercise
    exit 0
else
    exit 1
fi
kill -9 $(lsof -i:3012 -t)
cd ../../../app/content; yarn serve

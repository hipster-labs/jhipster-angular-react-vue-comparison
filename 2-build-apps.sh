# Package apps
apps=("angular" "react" "vuejs")
for app in "${apps[@]}";
do
    ( cd $app && mvn package -Pprod -DskipTests jib:dockerBuild ) 
done
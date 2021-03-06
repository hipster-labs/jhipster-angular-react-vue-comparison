# Package apps
apps=("angular" "react" "vuejs")

# Build docker images
for app in "${apps[@]}";
do
    ( cd $app && mvn clean package -Pprod -DskipTests jib:dockerBuild ) 
done

# Tag and push docker images
dockerRepositoryName="pbesson"
tag="6.1.2"
for app in "${apps[@]}";
do
    docker tag $app $dockerRepositoryName/$app:$tag
    docker push $dockerRepositoryName/$app:$tag
done


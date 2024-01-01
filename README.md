# Debug Watcher


Deploy the `hello-pepr.samples.yaml` file with the deployment.    


Update script while watching

```bash
#!/bin/bash

# counter=0
# counter=$((counter+1))
# kubectl label deploy/blue lastUpdated=$(echo $counter) --overwrite
while true; do
    kubectl scale deploy/blue --replicas=0
    sleep 15
    echo "deployment.apps/blue replicas: $(kubectl get deploy blue --template='{{.spec.replicas}}')"
    echo "\n"
done
```


```bash
kubectl scale deploy/blue --replicas=0

k get deploy blue --template='{{.spec.replicas}}'
```


```bash
PEPR_WATCH_MODE="true" npx pepr dev -l trace --confirm
```

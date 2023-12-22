# Debug Watcher

Update script while watching

```bash
#!/bin/bash

# counter=0
# counter=$((counter+1))
# kubectl label deploy/blue lastUpdated=$(echo $counter) --overwrite
while true; do
    kubectl scale deploy/blue --replicas=0
    sleep 15
done
```


```bash
kubectl scale deploy/blue --replicas=0
```


```bash
PEPR_WATCH_MODE="true" npx pepr dev -l trace --confirm
```

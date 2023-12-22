# Debug Watcher

Update script while watching

```bash
#!/bin/bash

counter=0

while true; do
    counter=$((counter+1))
    kubectl label deploy/blue lastUpdated=$(echo $counter) --overwrite
    sleep 16
done
```


```bash
kubectl scale deploy/blue --replicas=0
```


# Debug Watcher

Steps: 
1. Deploy the Pepr module.
2. Deploy the deployment
```yaml
kubectl create -f -<<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: blue
  name: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: blue
  strategy: {}
  template:
    metadata:
      labels:
        app: blue
    spec:
      containers:
      - image: nginx
        name: nginx
        resources: {}
status: {}
EOF
```
3. Watch the watcher logs
4. Create a script that will update the deployment

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

Incase you want to run in dev mode 

```bash
PEPR_WATCH_MODE="true" npx pepr dev -l trace --confirm
```

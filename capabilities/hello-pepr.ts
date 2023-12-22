import { Capability, K8s, Log, a, kind } from "pepr";
import { V1DeploymentStrategy } from "@kubernetes/client-node";

export const DeploymentWatcher = new Capability({
  name: "deployment-watcher",
  description: "Watches for deltas in a Deployment.",
  namespaces: [""],
});

const { When, OnSchedule } = DeploymentWatcher;

const deploymentStrategy: V1DeploymentStrategy = {
  rollingUpdate: {
    maxSurge: "50%",
    maxUnavailable: "50%",
  },
  type: "RollingUpdate",
};

OnSchedule({
  name: "deploy-interrupter",
  every: 1,
  unit: "minutes",
  run: async () => {
    try {
      // Keep changing it to try and capture a watcher silent death
      await K8s(kind.Deployment).Apply(
        {
          metadata: {
            name: "blue",
            namespace: "default",
          },
          spec: {
            replicas: 3,
          },
        },
        {
          force: true,
        },
      );
    } catch (error) {
      Log.error(error, "Failed to change deployment.");
    }
  },
});

When(a.Deployment)
  .IsCreatedOrUpdated()
  .WithName("blue")
  .Watch(async deploy => {
    Log.info(`Deployment ${deploy.metadata?.name} was changed.`);

    // Make it feel like an operator
    if (
      deploy.spec?.replicas !== 2 ||
      deploy.spec?.strategy?.rollingUpdate?.maxSurge !== "50%" ||
      deploy.spec?.strategy?.rollingUpdate?.maxUnavailable !== "50%" ||
      deploy.spec?.strategy?.type !== "RollingUpdate"
    ) {
      try {
        // Reconcile the deployment back to desired state
        await K8s(kind.Deployment).Apply(
          {
            metadata: {
              name: "blue",
              namespace: "default",
            },
            spec: {
              replicas: 2,
              strategy: deploymentStrategy,
            },
          },
          {
            force: true,
          },
        );
      } catch (error) {
        Log.error(error, "Failed to reconcile deployment.");
      }
    }
  });

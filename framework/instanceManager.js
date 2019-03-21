"use strict";

const InstanceManager = {instances: {}};

InstanceManager.registerClass = (key, value) => {
    InstanceManager.instances[key] = value;
};

InstanceManager.removeInstance = key => delete InstanceManager.instances[key];

InstanceManager.getInstance = key => {
    if (key in InstanceManager.instances) {
        return InstanceManager.instances[key];
    }
    throw new Error(`Unable to locate instance with key '${key}'`)
};

InstanceManager.getClass = key => key in InstanceManager.instances ? InstanceManager.instances[key].constructor : undefined;

InstanceManager.getAll = () => InstanceManager.instances;

InstanceManager.registerHandle = (key, args) => InstanceManager.instances[key].handle.apply(InstanceManager.instances[key], args);

module.exports = InstanceManager;
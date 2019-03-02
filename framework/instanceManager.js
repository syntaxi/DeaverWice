"use strict";

const InstanceManager = {instances: {}};

InstanceManager.registerClass = function (key, value) {
    InstanceManager.instances[key] = value;
};

InstanceManager.getInstance = function (key) {
    if (key in InstanceManager.instances) {
        return InstanceManager.instances[key];
    }
    throw new Error(`Unable to locate instance with key '${key}'`)
};

InstanceManager.getClass = function(key) {
    return key in InstanceManager.instances ? InstanceManager.instances[key].constructor : undefined;
};

InstanceManager.getAll = function () {
    return InstanceManager.instances;
};

InstanceManager.registerHandle = function (key, args) {
    InstanceManager.instances[key].handle.apply(InstanceManager.instances[key], args);
};

module.exports = InstanceManager;
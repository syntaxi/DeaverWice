"use strict";

const InstanceManager = {instances: {}};

InstanceManager.registerClass = function (key, value) {
    InstanceManager.instances[key] = value;
};

InstanceManager.getInstance = function (key) {
    return key in InstanceManager.instances ? InstanceManager.instances[key] : undefined;
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
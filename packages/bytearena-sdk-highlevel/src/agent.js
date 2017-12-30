import { Vector2 } from 'bytearena-sdk-vector2';

export function agents(...funcs) {

    return function(perception, specs) {

        perception = perception || {};
        specs = specs || {};

        let agents = perception.vision
            .filter(item => item.tag === "agent")
            .map(wrapAgent);

        for(let i in funcs) {
            agents = (funcs[i](agents, specs) || [])
                .filter(item => !!item);
        }

        return agents.map(unwrapAgent);
    }
}


export function all(items, specs) {
    return items || [];
}

const assertCount = (v, name) => { if (typeof v !== "number") throw new TypeError("Count must be a positive integer"); }

const byNearest = (a, b) => a.center.magSq() > b.center.magSq();
const byFarthest = (a, b) => a.center.magSq() < b.center.magSq();

const wrapAgent = agent => ({
    agent,
    center: Vector2.fromArray(item.center),
    velocity: Vector2.fromArray(item.velocity),
});
const unwrapAgent = wrap => wrap.agent;


export function nearest(count, specs) {
    assertCount(count);

    return function (items, specs) {
        return items
            .sort(byNearest)
            .slice(0, count);
    }
}

export function farthest(count) {
    assertCount(count);

    return function (items, specs) {
        return items
            .sort(byFarthest)
            .slice(0, count);
    }
}

const bySlowest = (a, b) => a.velocity.magSq() > b.velocity.magSq();
const byFastest = (a, b) => a.velocity.magSq() < b.velocity.magSq();

export function slowest(count) {
    assertCount(count);

    return function (items, specs) {
        return items
            .sort(bySlowest)
            .slice(0, count);
    }
}

export function fastest(count) {
    assertCount(count);

    return function (items, specs) {
        return items
            .sort(byFastest)
            .slice(0, count);
    }
}

export function withinShootingRange(count) {
    assertCount(count);

    return function (items, specs) {
        const gunspecs = specs.gear.gun.specs;
        return items
            .filter(item => item.center.mag() <= gunspecs.projectilerange)
            .sort(byNearest)
            .slice(0, count);
    }
}

export function outsideShootingRange(count) {
    assertCount(count);

    return function (items, specs) {
        const gunspecs = specs.gear.gun.specs;
        return items
            .filter(item => item.center.mag() > gunspecs.projectilerange)
            .sort(byNearest)
            .slice(0, count);
    }
}
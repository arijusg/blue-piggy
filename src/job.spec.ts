import { assert } from "chai";

import { Job } from "./job";

describe("Job", () => {
    it("should map basics", async () => {
        let basePath = "Bat";
        let buildPath = "Bat";

        let job = new Job(basePath, buildPath);

        assert.equal(job.basePath, basePath);
        assert.equal(job.buildPath, buildPath);
    });

    it("should map new feature", async () => {
        let basePath = undefined;
        let buildPath = "Bat";

        let job = new Job(basePath, buildPath);

        assert.equal(job.isNewFeature, true);
    });

    it("should map discontinued feature", async () => {
        let basePath = "Super";
        let buildPath = undefined;

        let job = new Job(basePath, buildPath);

        assert.equal(job.isDiscontinuedFeature, true);
    });

    it("should throw on null paths ", async () => {
        let basePath = undefined;
        let buildPath = null;

        assert.throws(() => {
            let job = new Job(basePath, buildPath);
        }, "both basePath and buildPath cannot be null");
    });

    it("should throw on non matching paths (excluding nulls)", async () => {
        let basePath = "Super";
        let buildPath = "Bat";

        assert.throws(() => {
            let job = new Job(basePath, buildPath);
        }, "basePath and buildPath should either match or one to be null");
    });

});
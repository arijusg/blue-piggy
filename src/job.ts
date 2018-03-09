export class Job {
    public readonly basePath: string;
    public readonly buildPath: string;
    public readonly isNewFeature: boolean;
    public readonly isDiscontinuedFeature: boolean;
    
    constructor(basePath: string, buildPath: string) { 
        this.basePath = basePath;
        this.buildPath = buildPath;
        
        this.isNewFeature = basePath == null;
        this.isDiscontinuedFeature = buildPath == null;

        if(basePath == null && buildPath == null) {
            throw new Error("both basePath and buildPath cannot be null");
        }

        if(basePath != null && buildPath != null && basePath !== buildPath) {
            throw new Error("basePath and buildPath should either match or one to be null");
        }
    }
}
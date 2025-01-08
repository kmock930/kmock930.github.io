class NavbarParser {
    /**
     * Passes an array to this instance.
     * @param {Array<String>} topBar 
     */
    constructor(topBar) {
        this.topBar = topBar;
    }

    /**
     * Returns the first layer of an array passed to this instance.
     * @returns {Array<String>}
     */
    getFirstLayer = () => {
        let keyList = [];
        this.topBar.map((item) => {
            if (typeof(item) === 'object') {
                keyList = keyList.concat(Object.keys(item));
            }
            if (typeof(item) === 'string') {
                keyList.push(item);
            }
        });
        return keyList;
    };

    /**
     * 
     * @param {Array<String> | String} clickPath 
     * @param {Array} currList
     * @returns {Array} - an array of the contents under the provided path and level
     */
    getItemListFrom = (clickPath, currList=this.topBar) => {
        let result = currList;

        // Support string or array paths
        const path = Array.isArray(clickPath) ? clickPath : [clickPath];
    
        for (const key of path) {
            if (Array.isArray(result)) {
                // Search within an array for an object with the key
                const found = result.find(item => 
                    typeof item === 'object' && key in item
                );
                if (found) {
                    result = found[key]; // Move into the object by key
                } else {
                    return []; // Key not found
                }
            } else if (typeof result === 'object' && result !== null) {
                // Traverse into object directly
                result = result[key] || [];
            } else {
                return []; // Invalid path
            }
        }
        return result;
    };
};

module.exports.NavbarParser = NavbarParser;
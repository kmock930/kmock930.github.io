class NavbarParser {
    constructor(topBar) {
        this.topBar = topBar;
    }

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
     * @param {Array[string]} clickPath 
     * @returns Array
     */
    getItemListFrom = (clickPath) => {
        if (Array.isArray(clickPath)) {
            //main logic
            let currLayer = this.getFirstLayer();
            let resItemsList = this.topBar;
            //loop
            clickPath.map((item, ind) => {
                if (typeof(item) !== 'string') {
                    return []; //not found
                }
                
                //traverse to each item until reached target
                if (currLayer.includes(item)) {
                    resItemsList = resItemsList[currLayer.indexOf(item)];
                    if (typeof(resItemsList) === 'object' && !Array.isArray(resItemsList)) {
                        resItemsList = resItemsList[item];
                    }
                    if (typeof(resItemsList) === 'string') {
                        return []; //a string does not have lower layer values to go down to
                    }

                    //resItemList is an actual Array[string]
                    currLayer = [];
                    resItemsList.map((subItem, subInd) => {
                        if (typeof(subItem) === 'object') {
                            if (Array.isArray(subItem)) {
                                //subItem is an Array -> get first element as the "key"
                                currLayer.push(subItem[0]);
                            } else {
                                //subItem is an object
                                currLayer = currLayer.concat(Object.keys(resItemsList));
                            }
                        } else {
                            //subItem is a string
                            currLayer.push(subItem);
                            
                        }
                    });
                }
            })
        }

        if (typeof(clickPath) === 'string') {
            //find the click item from possible click paths
            if (this.getFirstLayer().includes(clickPath)) {
                return target;
            }
        }

        //other invalid types (DO NOT handle json object type)
        return [];
    };
    
    #getResList() {

    }
}

module.exports.NavbarParser = NavbarParser;
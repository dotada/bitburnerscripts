let globalscanlist = [];

/**
 * Scans servers up to a maximum depth.
 * @param {NS} ns - the namespace object
 * @param {string} serverName - the name of the server to scan
 * @param {number} maxDepth - the maximum depth to scan
 */
async function scanServers(ns, serverName, maxDepth) {
  let scannedNodes = new Set([serverName]);
  let nodesToScan = [serverName];
  let depth = 0;

  while (depth <= maxDepth && nodesToScan.length > 0) {
    const newNodesToScan = [];
    for (let i = 0; i < nodesToScan.length; i++) {
      const currentNode = nodesToScan[i];
      const scanResults = ns.scan(currentNode);
      for (let j = 0; j < scanResults.length; j++) {
        const locationName = scanResults[j];
        if (!scannedNodes.has(locationName)) {
          scannedNodes.add(locationName);
          globalscanlist.push(locationName);
          newNodesToScan.push(locationName);
        }
      }
    }
    nodesToScan = newNodesToScan;
    depth++;
  }
}

/** @param {NS} ns */
export async function main(ns) {
  await scanServers(ns, "home", 10);
  
  let filteredlst = [...new Set(globalscanlist)];
  let filteredlst2 = filteredlst.filter(function(e) { return e !== "home" });
  for (let i = 0; i < filteredlst2.length; i++) {
    ns.tprint(filteredlst2[i]);
  }
}
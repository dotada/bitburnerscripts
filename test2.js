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
  let depth = 0
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
  let ramperthread = ns.getScriptRam("getmoney.js", "home");
  await scanServers(ns, "home", ns.args[0]);
  let filteredlst = [...new Set(globalscanlist)];
  let filteredlst2 = filteredlst.filter(function (e) { return e !== "home" });
  for (let i = 0; i < filteredlst2.length; i++) {
    ns.tprint(filteredlst2[i]);
  }
  for (let i = 0; i < filteredlst2.length; i++) {
    let serverName = filteredlst2[i];
    let openports = 0;
    let reqports = ns.getServerNumPortsRequired(serverName);
    if (ns.fileExists("BruteSSH.exe", "home")) {
      ns.brutessh(serverName);
      openports++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
      ns.ftpcrack(serverName);
      openports++;
    }
    if (ns.fileExists("RelaySMTP.exe", "home")) {
      ns.relaysmtp(serverName);
      openports++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
      ns.httpworm(serverName);
      openports++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
      ns.sqlinject(serverName);
      openports++;
    }
    if (reqports <= openports) {
      if (!ns.hasRootAccess(serverName)) {
        ns.nuke(serverName);
      }
      ns.scp("getmoney.js", serverName, "home");
      let srvmxrm = ns.getServerMaxRam(serverName);
      let threadcount = Math.floor(srvmxrm / ramperthread);
      if (threadcount > 0) {
        ns.exec("getmoney.js", serverName, threadcount);
      }
    }
  }
  globalscanlist = [];
}
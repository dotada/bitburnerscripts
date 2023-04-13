/** @param {NS} ns */
export async function main(ns) {
	const target = ns.getHostname();
	let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
	let securityThresh = ns.getServerMinSecurityLevel(target) + 5;
	while (true) {
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			ns.print("SecThresh: " + securityThresh.toString());
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			ns.print("MThresh: " + moneyThresh.toString());
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}
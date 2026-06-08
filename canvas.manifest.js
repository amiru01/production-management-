export const manifest = {
  screens: {
    scr_ambjzs: { name: "Role Selector", route: "/", position: {"x":160,"y":220} },
    scr_efa3w4: { name: "Admin · Dashboard", route: "/admin/dashboard", position: {"x":160,"y":2200} },
    scr_3l8r7w: { name: "Admin · User Management", route: "/admin/users", position: {"x":1560,"y":2200} },
    scr_mbapoq: { name: "Manager · Dashboard", route: "/manager/dashboard", position: {"x":160,"y":4180} },
    scr_78c846: { name: "Manager · Projects Board", route: "/manager/projects", position: {"x":1560,"y":4180} },
    scr_j2ke9o: { name: "Crew · Dashboard", route: "/crew/dashboard", position: {"x":160,"y":6160} },
    scr_zsnq18: { name: "Accountant · Dashboard", route: "/accountant/dashboard", position: {"x":160,"y":8140} },
    scr_btm967: { name: "Accountant · Invoices", route: "/accountant/invoices", position: {"x":1560,"y":8140} },
    scr_d9xw8r: { name: "Client · Dashboard", route: "/client/dashboard", position: {"x":160,"y":10120} },
  },
  sections: {
    sec_yuzw2t: { name: "Role Selector", x: 0, y: 0, width: 1520, height: 1180 },
    sec_hjz06b: { name: "Admin Flow", x: 0, y: 1980, width: 2920, height: 1180 },
    sec_4zhwcc: { name: "Manager Flow", x: 0, y: 3960, width: 2920, height: 1180 },
    sec_p5n6gz: { name: "Crew Flow", x: 0, y: 5940, width: 1520, height: 1180 },
    sec_dpnz9o: { name: "Accountant Flow", x: 0, y: 7920, width: 2920, height: 1180 },
    sec_url22v: { name: "Client Flow", x: 0, y: 9900, width: 1520, height: 1180 },
  },
  layers: [
    { kind: "section", id: "sec_yuzw2t", children: [
      { kind: "screen", id: "scr_ambjzs" },
    ] },
    { kind: "section", id: "sec_hjz06b", children: [
      { kind: "screen", id: "scr_efa3w4" },
      { kind: "screen", id: "scr_3l8r7w" },
    ] },
    { kind: "section", id: "sec_4zhwcc", children: [
      { kind: "screen", id: "scr_mbapoq" },
      { kind: "screen", id: "scr_78c846" },
    ] },
    { kind: "section", id: "sec_p5n6gz", children: [
      { kind: "screen", id: "scr_j2ke9o" },
    ] },
    { kind: "section", id: "sec_dpnz9o", children: [
      { kind: "screen", id: "scr_zsnq18" },
      { kind: "screen", id: "scr_btm967" },
    ] },
    { kind: "section", id: "sec_url22v", children: [
      { kind: "screen", id: "scr_d9xw8r" },
    ] },
  ],
}

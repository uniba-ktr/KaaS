import Items from "@/builder/Items";
import Vue from "vue";

const json = {
  name: "Example",
  description: "Description of the Laboratory",
  version: "Version of the Laboratory",
  author: "Author of the Laboratory",
  email: "Email of author",
  web: "Web address",
  topo: [],
};

export default class {
  constructor(data) {
    this._nodes = [];
    this._items = new Items(data.items);

    Vue.$log.debug(data.items)
  }

  build() {
    [
      // Nodes (stop on hostname conflict)
      { items: this._items.arr.host, method: this._addNode.bind(this) },
      { items: this._items.arr.switch, method: this._addNode.bind(this) },

      // Links
      { items: this._items.arr.link, method: this._addLink.bind(this) },
    ].forEach(({ items, method }) => {
      items.forEach((item) => {
        try {
          method(item);
        } catch (error) {
          Vue.$log.error(error)
        }
      });
    });
    json.topo.push(...this._nodes)
    Vue.$log.debug("JSON for Kathara:", json)
    return json;
  }

  _addLink(link){

    const fromPort = this._items.map.port[link.from];
    const toPort = this._items.map.port[link.to];

    const n1 = this._getNeighbors(fromPort, ["host", "switch"])[0]
    const n2 = this._getNeighbors(toPort, ["host", "switch"])[0]

    const node1 = this._nodes.find(node => node.name === n1.hostname)
    this._addNet(node1, {"interface": fromPort.hostname.replace(/\D/g, ''), "domain": link.hostname})
    //this._addIPs(node1, fromPort)
    const node2 = this._nodes.find(node => node.name === n2.hostname)
    this._addNet(node2, {"interface": toPort.hostname.replace(/\D/g, ''), "domain": link.hostname})
    //this._addIPs(node2, toPort)
    Vue.$log.debug("added nets to ", node1, node2)
  }

  _addNet(node, net){
    if (!node.net) {
      node.net = []
      node.net.push(net)
    } else if (!node.net.find(n => n.domain === net.domain)){
      node.net.push(net)
    } else {
      Vue.$log.warn("Network defined twice", net)
    }
  }

  _addIPs(node, port){
   if (!node.files) {
      node.files = []
      let script="#!/bin/sh"
      for (const ip in port.ips) {
        script += "\nip address add "+ip+" dev "+port.hostname
      }
      const startup = {name: node.name+".startup", content: script}
      node.files.push(startup)
    } else if (node.files.find(n => n.name === node.name+".startup")){
      const file = node.files.find(n => n.name === node.name+".startup")
      file.content += "\nip address add "+port.ips[0]+" dev "+port.hostname
    } else {
      Vue.$log.warn("Something went wrong creating the startup script")
    }
  }

  _addNode(hostname){
    const host = {"name": hostname.hostname}
    host.image = "unibaktr/alpine"
    if (hostname.startScript) {
      let script = ""
      if (!hostname.startScript.startsWith("#!/bin"))
         script += "#!/bin/sh\n"
      script += hostname.startScript
      const startup = {name: host.name+".startup", content: script}
      host.files=[]
      host.files.push(startup)
    }
    if (!this._nodes.find(node => node.name === host.name)) {
      this._nodes.push(host);
      Vue.$log.debug("Added", hostname.hostname, "with", hostname.id)
    } else {
      Vue.$log.warn("Already available: ", host.name)
    }
  }

  _getNeighbors(node, types) {
    const nodes = new Set();
    node.$associations.forEach((assoc) => {
      assoc.$nodes.forEach((node) => nodes.add(node));
    });

    return [...nodes].filter((n) => n !== node && types.indexOf(n.type) >= 0);
  }
}

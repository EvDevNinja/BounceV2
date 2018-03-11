//Packages
const cluster = require('cluster');
const net = require('net');
const numCPUs = require('os').cpus().length;
const fs = require('fs');

if (!fs.existsSync('./config.json')) {
	fs.writeFileSync('./config.json', '{\n\t"8080":{\n\t\t"aiden.evdev.online":{\n\t\t\t"internal":"localhost",\n\t\t\t"port":80\n\t\t}\n\t}\n}', 'utf8')
}
const config = require('./config.json')

if(cluster.isMaster){
   console.log(`Master ${process.pid} is running`);
   // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    //Fork a new worker
    cluster.fork();
  });
}else{
  for (externalPortStr in config) {
    var externalPort = Int(externalPortStr); //Parse Int Optional
    if (externalPort == undefined) { continue; } //Skip
		(function(externalPort){
			var server = net.createServer((socket) => {
				console.log(`Worker ${process.pid} got A new connection on ${externalPort}`)
	      socket.once('data', (buffer) => {
	        for (var search in config[externalPortStr]) {
	          if (buffer.includes(search) || search == "*") {
							console.log(`Worker ${process.pid}'s connection on ${externalPort} matched config ${config[externalPortStr]}`)
	            var client = net.createConnection(config[externalPortStr][search].port, config[externalPortStr][search].internal, () => {
								client.write(buffer);
	            });
	            client.on('data', (dat) => {
	              socket.write(dat);
	            });
	            client.on('error', (err) => {
	              console.log(err);
	            });
	            client.on('end', () => {
								console.log(`Worker ${process.pid}'s connection on ${externalPort} local client ended the connection.`)
	              socket.end();
	            });
	            socket.on('data', (dat) => {
	              client.write(dat);
	            });
	            socket.on('end', () => {
								console.log(`Worker ${process.pid}'s connection on ${externalPort} remote socket ended the connection.`)
	              client.end()
	            });
	            return;
	          }
	        }
	        socket.end();
	      });
	      socket.on('error', (err) => {
	        console.log(err);
	      });
	    }).on('error', (err) => {
	      console.log(err);
	    }).listen(externalPort, () => {
	      console.log(`Worker ${process.pid} listening on port ${externalPort}`);
	    });
		})(externalPort)
  }
  console.log(`Worker ${process.pid} started`);
}
function Int(str){try{var i=parseInt(str);return i;}catch(e){return undefined;}}

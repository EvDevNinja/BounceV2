//Packages
const cluster = require('cluster');
const net = require('net');
const numCPUs = require('os').cpus().length;

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
	      socket.once('data', (buffer) => {
	        for (var search in config[externalPortStr]) {
	          if (buffer.includes(search) || search == "*") {
	            var client = net.createConnection(config[externalPortStr][search].port, config[externalPortStr][search].internal, () => {
	              socket.write(buffer);
	            });
	            client.on('data', (dat) => {
	              socket.write(dat);
	            });
	            client.on('error', (err) => {
	              console.log(err);
	            });
	            client.on('end', () => {
	              socket.end();
	            });
	            socket.on('data', (dat) => {
	              client.write(dat);
	            });
	            socket.on('end', () => {
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

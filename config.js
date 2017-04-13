module.exports = {
	development: {
		srcDir: 'src',
		port: 8899,
		notProcessedDir: [],
		proxyTarget: {
			'/api': 'http://10.82.80.131:7777/spark-pagerank/'
		}		
	},
	production: {
		srcDir: 'src',
		port: 8899,
		proxyTarget: {
			/*'/api': 'http://192.168.1.103:8000'*/
			'/api': 'http://10.82.80.131:7777/spark-pagerank/'
		}		
	}
}
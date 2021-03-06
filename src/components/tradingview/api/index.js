// import historyProvider from './history-provider'
import data_provider from "./data_provider";


const supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "D"]


const config = {
    supported_resolutions: supportedResolutions
}; 

const datafeed = (pair_address)  => {
	return {
		onReady: cb => {
		// console.log('=====onReady running')
			setTimeout(() => cb(config), 0)
			
		},
		searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
			// console.log('====Search Symbols running')
		},
		resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
			// expects a symbolInfo object in response
			// console.log('======resolveSymbol running')
			// console.log('resolveSymbol:',{symbolName})
			var split_data = symbolName.split(/[:/]/)
			// console.log({split_data})
			var symbol_stub = {
				name: symbolName,
				description: '',
				type: 'crypto',
				session: '24x7',
				timezone: 'Etc/UTC',
				ticker: symbolName,
				exchange: split_data[0],
				minmov: 1,
				pricescale: 10000000000,
				has_intraday: true,
				intraday_multipliers: ['1', '60'],
				supported_resolution:  supportedResolutions,
				volume_precision: 8,
				data_status: 'streaming',
			}
	
			if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
				// symbol_stub.pricescale = 100
			}
			setTimeout(function() {
				onSymbolResolvedCallback(symbol_stub)
				// console.log('Resolving that symbol....', symbol_stub)
			}, 0)
			
			
			// onResolveErrorCallback('Not feeling it today')
	
		},
		getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
			// console.log('=====getBars running')
			// console.log(symbolInfo, resolution, from, to, firstDataRequest)
			const tFrom = (new Date(from * 1000).toISOString()).substr(0, 16);
			const tTo = (new Date(to * 1000).toISOString()).substr(0, 16);
			// console.log(`Requesting bars between ${tFrom} and ${tTo}`)
			// console.log('function args',arguments)
			// console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
			data_provider.getBars(pair_address, tFrom, tTo, symbolInfo, firstDataRequest)
			.then(bars => {
				if (bars.length) {
					onHistoryCallback(bars, {noData: false})
				} else {
					onHistoryCallback(bars, {noData: true})
				}
			}).catch(err => {
				// console.log({err})
				onErrorCallback(err)
			})
			
			
	
		},
		subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
			// console.log('=====subscribeBars runnning')
		},
		unsubscribeBars: subscriberUID => {
			// console.log('=====unsubscribeBars running')
		},
		calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
			//optional
			// console.log('=====calculateHistoryDepth running')
			// while optional, this makes sure we request 24 hours of minute data at a time
			// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
			return resolution < 60 ? {resolutionBack: 'D', intervalBack: '10'} : undefined
			// return false;
		},
		getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
			//optional
			// console.log('=====getMarks running')
		},
		getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
			//optional
			// console.log('=====getTimeScaleMarks running')
		},
		getServerTime: cb => {
			// console.log('=====getServerTime running')
		}
	}
} 

export default datafeed;

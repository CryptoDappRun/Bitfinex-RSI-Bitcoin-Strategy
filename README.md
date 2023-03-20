# Bitfinex-RSI-Bitcoin-Strategy

Buy when RSI is oversold and volume is increasing and sell when RSI is overbought and volume is decreasing. 

This code uses the ccxt library to connect to the Bitfinex API and fetch the candlestick data for the BTC/USD pair on the 1-hour timeframe. It then calculates the RSI and volume values and checks if the current RSI is oversold or overbought and if the volume is increasing or decreasing compared to the previous value. If the conditions are met, it places a buy or sell order using the Bitfinex API.


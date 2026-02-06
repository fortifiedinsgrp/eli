import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  Calendar, Clock, Target, AlertTriangle, Play, Pause,
  RefreshCw, Download, Plus
} from 'lucide-react';

const STARTING_CAPITAL = 25000;

export default function Trading() {
  const [trades, setTrades] = useState([]);
  const [positions, setPositions] = useState([]);
  const [balance, setBalance] = useState(STARTING_CAPITAL);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTradingData();
  }, []);

  const loadTradingData = () => {
    const savedTrades = localStorage.getItem('eli_trades');
    const savedPositions = localStorage.getItem('eli_positions');
    const savedBalance = localStorage.getItem('eli_balance');
    
    if (savedTrades) setTrades(JSON.parse(savedTrades));
    if (savedPositions) setPositions(JSON.parse(savedPositions));
    if (savedBalance) setBalance(parseFloat(savedBalance));
    
    setLoading(false);
  };

  const saveTradingData = (newTrades, newPositions, newBalance) => {
    localStorage.setItem('eli_trades', JSON.stringify(newTrades));
    localStorage.setItem('eli_positions', JSON.stringify(newPositions));
    localStorage.setItem('eli_balance', newBalance.toString());
  };

  const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalReturn = ((balance - STARTING_CAPITAL) / STARTING_CAPITAL) * 100;
  const winningTrades = trades.filter(t => t.pnl > 0);
  const losingTrades = trades.filter(t => t.pnl <= 0);
  const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
  const avgWin = winningTrades.length > 0 
    ? winningTrades.reduce((s, t) => s + t.pnl, 0) / winningTrades.length 
    : 0;
  const avgLoss = losingTrades.length > 0 
    ? Math.abs(losingTrades.reduce((s, t) => s + t.pnl, 0) / losingTrades.length)
    : 0;
  const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

  const addManualTrade = () => {
    const trade = {
      id: Date.now(),
      ticker: prompt('Ticker symbol:')?.toUpperCase(),
      direction: prompt('Direction (long/short):')?.toLowerCase() || 'long',
      shares: parseInt(prompt('Number of shares:') || '0'),
      entryPrice: parseFloat(prompt('Entry price:') || '0'),
      exitPrice: parseFloat(prompt('Exit price (0 if still open):') || '0'),
      entryDate: prompt('Entry date (YYYY-MM-DD):') || new Date().toISOString().split('T')[0],
      exitDate: null,
      pnl: 0,
      pnlPercent: 0,
      status: 'open',
      reason: prompt('Entry reason:') || '',
    };

    if (!trade.ticker || !trade.shares || !trade.entryPrice) {
      alert('Invalid trade data');
      return;
    }

    if (trade.exitPrice > 0) {
      trade.status = 'closed';
      trade.exitDate = new Date().toISOString().split('T')[0];
      trade.pnl = trade.direction === 'long' 
        ? (trade.exitPrice - trade.entryPrice) * trade.shares
        : (trade.entryPrice - trade.exitPrice) * trade.shares;
      trade.pnlPercent = trade.direction === 'long'
        ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100
        : ((trade.entryPrice - trade.exitPrice) / trade.entryPrice) * 100;
      
      const newTrades = [...trades, trade];
      const newBalance = balance + trade.pnl;
      setTrades(newTrades);
      setBalance(newBalance);
      saveTradingData(newTrades, positions, newBalance);
    } else {
      const newPositions = [...positions, { ...trade, currentPrice: trade.entryPrice }];
      setPositions(newPositions);
      saveTradingData(trades, newPositions, balance);
    }
  };

  const closePosition = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    const exitPrice = parseFloat(prompt(`Exit price for ${position.ticker}:`) || '0');
    if (!exitPrice) return;

    const pnl = position.direction === 'long'
      ? (exitPrice - position.entryPrice) * position.shares
      : (position.entryPrice - exitPrice) * position.shares;
    const pnlPercent = position.direction === 'long'
      ? ((exitPrice - position.entryPrice) / position.entryPrice) * 100
      : ((position.entryPrice - exitPrice) / position.entryPrice) * 100;

    const closedTrade = {
      ...position,
      exitPrice,
      exitDate: new Date().toISOString().split('T')[0],
      pnl,
      pnlPercent,
      status: 'closed',
      exitReason: prompt('Exit reason:') || '',
    };

    const newTrades = [...trades, closedTrade];
    const newPositions = positions.filter(p => p.id !== positionId);
    const newBalance = balance + pnl;

    setTrades(newTrades);
    setPositions(newPositions);
    setBalance(newBalance);
    saveTradingData(newTrades, newPositions, newBalance);
  };

  const resetData = () => {
    if (confirm('Reset all trading data? This cannot be undone.')) {
      setTrades([]);
      setPositions([]);
      setBalance(STARTING_CAPITAL);
      localStorage.removeItem('eli_trades');
      localStorage.removeItem('eli_positions');
      localStorage.removeItem('eli_balance');
    }
  };

  const exportData = () => {
    const data = { exportDate: new Date().toISOString(), startingCapital: STARTING_CAPITAL, currentBalance: balance, totalPnL, totalReturn, trades, positions };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading_log_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Paper Trading</h1>
          <p className="text-slate-400">V3 Momentum Strategy</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addManualTrade} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Trade
          </button>
          <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={resetData} className="flex items-center gap-2 px-4 py-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900">
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-900/50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-slate-400 text-sm">Balance</span>
          </div>
          <p className="text-2xl font-bold text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-slate-500 mt-1">Started: ${STARTING_CAPITAL.toLocaleString()}</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${totalPnL >= 0 ? 'bg-emerald-900/50' : 'bg-red-900/50'}`}>
              {totalPnL >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
            </div>
            <span className="text-slate-400 text-sm">Total P&L</span>
          </div>
          <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-sm mt-1 ${totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}% return
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-900/50 rounded-lg">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-slate-400 text-sm">Win Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</p>
          <p className="text-sm text-slate-500 mt-1">{winningTrades.length}W / {losingTrades.length}L</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-900/50 rounded-lg">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-slate-400 text-sm">Profit Factor</span>
          </div>
          <p className="text-2xl font-bold text-white">{profitFactor.toFixed(2)}</p>
          <p className="text-sm text-slate-500 mt-1">Avg Win: ${avgWin.toFixed(0)} | Loss: ${avgLoss.toFixed(0)}</p>
        </div>
      </div>

      {/* Open Positions */}
      {positions.length > 0 && (
        <div className="bg-slate-800 rounded-xl border border-amber-800/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-800/50 bg-amber-900/20">
            <h2 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Open Positions ({positions.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ticker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Direction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Entry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Current</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">P&L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {positions.map((pos) => {
                  const unrealized = pos.direction === 'long'
                    ? ((pos.currentPrice || pos.entryPrice) - pos.entryPrice) * pos.shares
                    : (pos.entryPrice - (pos.currentPrice || pos.entryPrice)) * pos.shares;
                  return (
                    <tr key={pos.id} className="hover:bg-slate-750">
                      <td className="px-6 py-4 font-medium text-white">{pos.ticker}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${pos.direction === 'long' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                          {pos.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{pos.shares}</td>
                      <td className="px-6 py-4 text-slate-300">${pos.entryPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-300">${(pos.currentPrice || pos.entryPrice).toFixed(2)}</td>
                      <td className={`px-6 py-4 font-medium ${unrealized >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {unrealized >= 0 ? '+' : ''}${unrealized.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => closePosition(pos.id)} className="text-blue-400 hover:text-blue-300 text-sm font-medium">Close</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trade History */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Trade History</h2>
        </div>
        {trades.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">No trades yet. Click "Add Trade" to log your first trade.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ticker</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Direction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Entry</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Exit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">P&L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">%</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {[...trades].reverse().map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-750">
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      <div>{trade.entryDate}</div>
                      {trade.exitDate && <div className="text-slate-500">→ {trade.exitDate}</div>}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{trade.ticker}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${trade.direction === 'long' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                        {trade.direction.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{trade.shares}</td>
                    <td className="px-6 py-4 text-slate-300">${trade.entryPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-300">{trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '-'}</td>
                    <td className={`px-6 py-4 font-medium ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 ${trade.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{trade.exitReason || trade.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Strategy Info */}
      <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-800/50 p-6">
        <h3 className="font-semibold text-blue-300 mb-3">V3 Momentum Strategy Rules</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-slate-300 mb-1">Entry Criteria:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Price above EMA 9 &gt; EMA 20 &gt; EMA 50 (stacked)</li>
              <li>RSI between 40-65 (not overbought)</li>
              <li>Volume surge 2x+ average</li>
              <li>Breakout above 10-day high OR power move (+2% day)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-300 mb-1">Exit Criteria:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Stop loss: Below entry support</li>
              <li>Trailing stop: Activates at 1.5:1 R/R</li>
              <li>RSI &gt;75 + reversal candle</li>
              <li>Break below EMA 9 with red candle</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

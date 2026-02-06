import { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  Clock, Target, AlertTriangle, RefreshCw, 
  Zap, BarChart3, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function Trading() {
  const [state, setState] = useState(null);
  const [tradeLog, setTradeLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [stateRes, logRes] = await Promise.all([
        fetch('/trades/state.json'),
        fetch('/trades/log.json'),
      ]);
      if (stateRes.ok) setState(await stateRes.json());
      if (logRes.ok) setTradeLog(await logRes.json());
      setLastRefresh(new Date());
    } catch (e) {
      console.warn('Failed to load trading data:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
        <h2 className="text-xl font-semibold text-slate-300 mb-2">Paper Trader Not Running</h2>
        <p className="text-slate-400">The paper trading engine hasn't generated data yet. It runs every 5 minutes during market hours.</p>
      </div>
    );
  }

  const { positions = [], closed_trades: closedToday = [] } = state;
  const capital = state.capital || 25000;
  const startingCapital = state.starting_capital || 25000;
  const dayPnl = state.day_pnl || 0;
  const totalPnl = state.total_pnl || 0;
  const totalTrades = state.total_trades || 0;
  const winningTrades = state.winning_trades || 0;
  const losingTrades = state.losing_trades || 0;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100) : 0;
  const totalReturn = ((capital - 25000) / 25000 * 100);
  const dayReturn = ((dayPnl) / startingCapital * 100);

  // Unrealized P&L from open positions
  const unrealizedPnl = positions.reduce((sum, p) => sum + (p.unrealized_pnl || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="w-7 h-7 text-amber-400" />
            Day Trading — Paper Account
          </h1>
          <p className="text-slate-400 mt-1">
            Auto-scanning 12,000+ stocks every 5 minutes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Scan #{state.scan_count || 0}
          </div>
          <button onClick={loadData} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400 text-xs uppercase">Capital</span>
          </div>
          <p className="text-xl font-bold text-white">${capital.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className={`text-xs mt-1 ${totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}% all time
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-2">
            {dayPnl >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />}
            <span className="text-slate-400 text-xs uppercase">Day P&L</span>
          </div>
          <p className={`text-xl font-bold ${dayPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {dayPnl >= 0 ? '+' : ''}${dayPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <p className={`text-xs mt-1 ${dayReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {dayReturn >= 0 ? '+' : ''}{dayReturn.toFixed(2)}% today
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 text-xs uppercase">Unrealized</span>
          </div>
          <p className={`text-xl font-bold ${unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toFixed(2)}
          </p>
          <p className="text-xs mt-1 text-slate-500">{positions.length} open position{positions.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-xs uppercase">Win Rate</span>
          </div>
          <p className="text-xl font-bold text-white">{winRate.toFixed(0)}%</p>
          <p className="text-xs mt-1 text-slate-500">{winningTrades}W / {losingTrades}L ({totalTrades} total)</p>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-xs uppercase">Last Scan</span>
          </div>
          <p className="text-lg font-bold text-white">
            {state.last_scan ? new Date(state.last_scan).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </p>
          <p className="text-xs mt-1 text-slate-500">
            {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}
          </p>
        </div>
      </div>

      {/* Open Positions */}
      <div className={`bg-slate-800 rounded-xl border overflow-hidden ${positions.length > 0 ? 'border-amber-800/50' : 'border-slate-700'}`}>
        <div className={`px-6 py-4 border-b ${positions.length > 0 ? 'border-amber-800/50 bg-amber-900/10' : 'border-slate-700'}`}>
          <h2 className={`text-lg font-semibold flex items-center gap-2 ${positions.length > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
            <AlertTriangle className="w-5 h-5" />
            Open Positions ({positions.length})
          </h2>
        </div>
        {positions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No open positions. Scanner is watching for setups...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ticker</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Signal</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Shares</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Entry</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Current</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">P&L</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">P&L %</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Stop</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Target</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Entry Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {positions.map((pos, i) => {
                  const pnl = pos.unrealized_pnl || 0;
                  const pnlPct = pos.unrealized_pct || 0;
                  return (
                    <tr key={i} className="hover:bg-slate-750">
                      <td className="px-4 py-3 font-bold text-white">{pos.ticker}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          pos.signal === 'BREAKOUT' ? 'bg-emerald-900/50 text-emerald-400' :
                          pos.signal === 'MOMENTUM' ? 'bg-blue-900/50 text-blue-400' :
                          pos.signal === 'REVERSAL' ? 'bg-purple-900/50 text-purple-400' :
                          'bg-amber-900/50 text-amber-400'
                        }`}>
                          {pos.signal}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-300">{pos.shares}</td>
                      <td className="px-4 py-3 text-right text-slate-300">${pos.entry_price?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-white font-medium">${pos.current_price?.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right font-medium ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 text-right ${pnlPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-right text-red-400 text-sm">${pos.stop_price?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-emerald-400 text-sm">${pos.target_price?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-slate-500 text-sm">
                        {pos.entry_time?.split(' ')[1]?.slice(0, 5)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Today's Closed Trades */}
      {closedToday.length > 0 && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Today's Closed Trades</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ticker</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Signal</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Shares</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Entry</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Exit</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">P&L</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">P&L %</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Exit Reason</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Hold Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {closedToday.map((trade, i) => (
                  <tr key={i} className="hover:bg-slate-750">
                    <td className="px-4 py-3 font-bold text-white">{trade.ticker}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{trade.signal}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{trade.shares}</td>
                    <td className="px-4 py-3 text-right text-slate-300">${trade.entry_price?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-300">${trade.exit_price?.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl?.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right ${trade.pnl_pct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.pnl_pct >= 0 ? '+' : ''}{trade.pnl_pct?.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        trade.exit_reason === 'TARGET_HIT' ? 'bg-emerald-900/50 text-emerald-400' :
                        trade.exit_reason === 'STOP_LOSS' ? 'bg-red-900/50 text-red-400' :
                        trade.exit_reason === 'TRAILING_STOP' ? 'bg-amber-900/50 text-amber-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {trade.exit_reason?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 text-sm">{trade.hold_time?.split('.')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Historical Trade Log */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Trade History ({tradeLog.length} trades)</h2>
        </div>
        {tradeLog.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            No completed trades yet. The paper trader will enter positions automatically when setups trigger.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ticker</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Entry</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Exit</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Shares</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">P&L</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {[...tradeLog].reverse().slice(0, 50).map((trade, i) => (
                  <tr key={i} className="hover:bg-slate-750">
                    <td className="px-4 py-3 text-slate-500 text-sm">{trade.entry_time?.split(' ')[0]}</td>
                    <td className="px-4 py-3 font-medium text-white">{trade.ticker}</td>
                    <td className="px-4 py-3 text-right text-slate-300">${trade.entry_price?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-300">${trade.exit_price?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-300">{trade.shares}</td>
                    <td className={`px-4 py-3 text-right font-medium ${(trade.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {(trade.pnl || 0) >= 0 ? '+' : ''}${(trade.pnl || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{trade.exit_reason?.replace('_', ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Strategy Info */}
      <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-xl border border-amber-800/30 p-6">
        <h3 className="font-semibold text-amber-300 mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" /> Day Trading Engine
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-slate-300 mb-1">Scanner Criteria:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Scans 12,000+ stocks every 5 min</li>
              <li>Gap ≥3% with 1.5x+ relative volume</li>
              <li>Intraday momentum ≥3%</li>
              <li>Breakouts at HOD + above VWAP</li>
              <li>Reversal bounces on high volume</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-300 mb-1">Entry Rules:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Prioritize: Breakout → Momentum → Reversal</li>
              <li>Must be above VWAP for longs</li>
              <li>Max 3 concurrent positions</li>
              <li>2% capital risk per trade</li>
              <li>No chasing (&gt;50% movers)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-300 mb-1">Exit Rules:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Hard stop: -3% from entry</li>
              <li>Target: 2:1 risk/reward</li>
              <li>Trailing stop at 1.5:1 R/R</li>
              <li>Close all by 3:50 PM</li>
              <li>No overnight holds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

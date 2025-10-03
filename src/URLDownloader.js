import React, { useState, useEffect } from 'react';

const URLDownloader = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [auditId, setAuditId] = useState(null);
  const [auditStatus, setAuditStatus] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [audits, setAudits] = useState([]);
  const [auditsLoading, setAuditsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const extractWebsiteName = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (_) {
      return url || 'Unknown';
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedAudits = () => {
    const sortableAudits = [...audits];
    if (sortConfig.key) {
      sortableAudits.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'websiteName') {
          aValue = extractWebsiteName(a.url);
          bValue = extractWebsiteName(b.url);
        } else if (sortConfig.key === 'createdAt') {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAudits;
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return (
        <svg className="w-4 h-4 ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 ml-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const fetchAudits = async () => {
    setAuditsLoading(true);
    try {
      const response = await fetch('https://brand-camp-api.vercel.app/api/audit');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const auditsData = await response.json();
      setAudits(auditsData.data || []);
    } catch (err) {
      console.error('Failed to fetch audits:', err);
    } finally {
      setAuditsLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const downloadCSV = (data, filename) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadFromBlobUrl = async (blobUrl, filename) => {
    try {
      const response = await fetch(blobUrl);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status}`);
      }
      const csvData = await response.text();
      downloadCSV(csvData, filename);
    } catch (err) {
      setError(err.message || 'Failed to download CSV file');
    }
  };

  const pollAuditStatus = async (id, pollCount = 0) => {
    const maxPolls = 15; //30-second intervals
    
    if (pollCount >= maxPolls) {
      setError('Audit processing is taking longer than expected. Please check back later.');
      setAuditId(null);
      setAuditStatus(null);
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`https://brand-camp-api.vercel.app/api/audit/${id}/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const statusData = await response.json();
      setAuditStatus(statusData.status);
      
      // Update the audit status in the table
      setAudits(prevAudits => 
        prevAudits.map(audit => 
          audit.auditId === id 
            ? { ...audit, status: statusData.status }
            : audit
        )
      );
      
      // Set loading to false once we start getting status updates
      if (pollCount === 0) {
        setLoading(false);
      }
      
      if (statusData.status === 'completed') {
        const auditResponse = await fetch(`https://brand-camp-api.vercel.app/api/audit/${id}/download`);
        if (!auditResponse.ok) {
          throw new Error(`Failed to fetch audit data: ${auditResponse.status}`);
        }
        const auditResult = await auditResponse.json();
        setAuditData(auditResult);
        setSuccess('Audit completed! Your data is ready for download.');
        setLoading(false);
        setAuditId(null);
        setAuditStatus(null);
        
        // Update the audit with download URL
        setAudits(prevAudits => 
          prevAudits.map(audit => 
            audit.auditId === id 
              ? { ...audit, status: 'completed', downloadUrl: auditResult.downloadUrl }
              : audit
          )
        );
      } else if (statusData.status === 'failed') {
        setError('Audit processing failed');
        setAuditId(null);
        setAuditStatus(null);
      } else if (['starting', 'pending', 'processing'].includes(statusData.status)) {
        setTimeout(() => pollAuditStatus(id, pollCount + 1), 30000);
      } else {
        console.warn(`Unknown audit status: ${statusData.status}`);
        setTimeout(() => pollAuditStatus(id, pollCount + 1), 30000);
      }
    } catch (err) {
      setError(err.message || 'Failed to check audit status');
      setAuditId(null);
      setAuditStatus(null);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAuditId(null);
    setAuditStatus(null);
    setAuditData(null);
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://brand-camp-api.vercel.app/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "url": url,
          "includeScreenshot": false, 
          "format":"csv"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (result.auditId) {
          setAuditId(result.auditId);
          setAuditStatus('processing');
          setSuccess('Audit started successfully! Processing...');
          setLoading(false);
          
          // Add new audit to table immediately
          const newAudit = {
            auditId: result.auditId,
            url: url,
            status: 'starting',
            createdAt: new Date().toISOString(),
            downloadUrl: null
          };
          setAudits(prevAudits => [newAudit, ...prevAudits]);
          
          // Clear the input field after successful submission
          setUrl('');
          
          pollAuditStatus(result.auditId);
        } else {
          throw new Error('No audit ID received from server');
        }
      } else {
        const csvData = await response.text();
        const filename = `data-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(csvData, filename);
        setSuccess('CSV file downloaded successfully!');
        setAuditId(null);
        setAuditStatus(null);
        setAuditData(null);
        setLoading(false);
        
        // Clear the input field after successful submission
        setUrl('');
        
        fetchAudits();
      }
    } catch (err) {
      setError(err.message || 'Failed to process audit request');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-6xl">
        <div className="glass-effect rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 mb-6 animate-pulse-glow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
              SalesOS
            </h1>
            <p className="text-lg text-slate-300 max-w-lg mx-auto leading-relaxed">
              Extract actionable insights from any website. Enter a URL and get structured data delivered as a CSV file.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-lg backdrop-blur-sm"
                disabled={loading}
              />
            </div>
            
            {error && (
              <div className="flex items-center space-x-3 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="fixed top-4 right-4 z-50 flex items-center space-x-3 text-green-400 bg-green-500/20 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm shadow-lg animate-in slide-in-from-right-full duration-300">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}
            
            {auditData && (
              <button
                onClick={() => {
                  downloadFromBlobUrl(auditData.downloadUrl, auditData.fileName);
                  setAuditData(null);
                  setSuccess('');
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/25 group text-lg"
              >
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download CSV File</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25 disabled:shadow-none group text-lg"
            >
              <div className={`flex items-center justify-center space-x-3 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Extract Data</span>
              </div>
              
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-lg font-semibold">Starting audit...</span>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
          </form>

          {(audits.length > 0 || auditsLoading) && (
            <div className="mt-12 pt-8 border-t border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Previous Website Audits</h2>
              
              {auditsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <span className="text-slate-300">Loading audits...</span>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full bg-slate-800/30 border border-slate-600/50 rounded-xl backdrop-blur-sm">
                    <thead className="bg-slate-700/50 border-b border-slate-600/50">
                      <tr>
                        <th 
                          className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-slate-600/30 transition-colors"
                          onClick={() => handleSort('websiteName')}
                        >
                          <div className="flex items-center">
                            Website Name
                            {getSortIcon('websiteName')}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-slate-600/30 transition-colors"
                          onClick={() => handleSort('url')}
                        >
                          <div className="flex items-center">
                            URL
                            {getSortIcon('url')}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-slate-600/30 transition-colors"
                          onClick={() => handleSort('createdAt')}
                        >
                          <div className="flex items-center">
                            Date Created
                            {getSortIcon('createdAt')}
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-slate-600/30 transition-colors"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center">
                            Status
                            {getSortIcon('status')}
                          </div>
                        </th>
                        <th className="px-4 py-3 text-center text-white font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedAudits().map((audit) => (
                        <tr 
                          key={audit.auditId}
                          className="border-b border-slate-600/30 hover:bg-slate-700/30 transition-all duration-200"
                        >
                          <td className="px-4 py-3 text-white font-medium">
                            {extractWebsiteName(audit.url)}
                          </td>
                          <td className="px-4 py-3 text-slate-300 max-w-xs truncate">
                            {audit.url || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-sm">
                            {audit.createdAt ? new Date(audit.createdAt).toLocaleDateString() : 'Date unknown'}
                          </td>
                          <td className="px-4 py-3">
                            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              audit.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400' 
                                : audit.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : audit.status === 'processing'
                                ? 'bg-blue-500/20 text-blue-400'
                                : audit.status === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-slate-500/20 text-slate-400'
                            }`}>
                              {audit.status || 'unknown'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {audit.status === 'completed' && audit.downloadUrl ? (
                              <button
                                onClick={() => {
                                  downloadFromBlobUrl(audit.downloadUrl, `audit-${audit.auditId}.csv`);
                                }}
                                className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                              >
                                Download CSV
                              </button>
                            ) : (
                              <span className="text-slate-500 text-sm">
                                {audit.status === 'pending' ? 'Pending...' : audit.status === 'processing' ? 'Processing...' : 'Not available'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default URLDownloader;
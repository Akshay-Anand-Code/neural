import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { Lock, Unlock, Database, FileSpreadsheet, Key, Loader2, AlertTriangle, Search, SlidersHorizontal, X, Download, ChevronDown, RefreshCw, Copy, Check } from 'lucide-react';
import { csvApi } from '../api/csvApi';
import Banner3D from '../components/Banner3D';

interface CSVFile {
  name: string;
  size: string;
  lastModified: string;
  content?: Array<Record<string, string>>;
  headers?: string[];
}

interface Filter {
  column: string;
  value: string;
}

export default function DataVault() {
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<CSVFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filter[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [files, setFiles] = useState<CSVFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(20);

  // Check for API key in localStorage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('data_vault_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsAuthorized(true);
    }
  }, []);

  // Load CSV files when authorized
  useEffect(() => {
    if (isAuthorized) {
      const loadFiles = async () => {
        setLoadingFiles(true);
        try {
          // Get list of available files
          const availableFiles = await csvApi.getFiles();
          
          // Load each file's contents
          const loadedFiles = await Promise.all(availableFiles.map(async (filename) => {
            const response = await fetch(`/csv/${filename}`);
            const size = response.headers.get('content-length') || '0';
            const lastModified = response.headers.get('last-modified') || new Date().toISOString();
            
            const result = await csvApi.getFileContents(filename, apiKey);
            if (!result.success || !result.data) {
              throw new Error(result.error || 'Failed to load file');
            }
            
            return {
              name: filename,
              size: `${(parseInt(size) / 1024).toFixed(1)} KB`,
              lastModified: new Date(lastModified).toLocaleDateString(),
              content: result.data.data,
              headers: result.data.headers
            };
          }));
          
          setFiles(loadedFiles);
        } catch (error) {
          console.error('Error loading CSV files:', error);
          setError('Failed to load data files');
        } finally {
          setLoadingFiles(false);
        }
      };

      loadFiles();
    }
  }, [isAuthorized]);

  const generateApiKey = () => {
    setIsGeneratingKey(true);
    // Simulate API key generation with a delay
    setTimeout(() => {
      const key = 'px_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setGeneratedApiKey(key);
      setIsGeneratingKey(false);
    }, 1000);
  };

  const copyApiKey = async () => {
    if (generatedApiKey) {
      await navigator.clipboard.writeText(generatedApiKey);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (apiKey) {
        // Validate API key (implement your validation logic)
        localStorage.setItem('data_vault_api_key', apiKey);
        setGeneratedApiKey(apiKey);
        setIsAuthorized(true);
      } else if (password === '1337') {
        setIsAuthorized(true);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPassword('');
    setApiKey('');
    setGeneratedApiKey(null);
    localStorage.removeItem('data_vault_api_key');
  };

  const filteredData = selectedFile?.content?.filter(row => {
    // Apply search term across all columns
    const matchesSearch = Object.values(row).some(value =>
      String(value ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply column-specific filters
    const matchesFilters = filters.every(filter =>
      String(row[filter.column] ?? '').toLowerCase().includes(filter.value.toLowerCase())
    );

    return matchesSearch && matchesFilters;
  });

  const handleFileSelect = (file: CSVFile) => {
    setSelectedFile(file);
    setSearchTerm('');
    setFilters([]);
  };

  const handleAddFilter = () => {
    if (!selectedFile?.headers) return;
    setFilters([...filters, { column: selectedFile.headers[0], value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleFilterChange = (index: number, field: 'column' | 'value', value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-4 md:p-6 relative overflow-y-auto">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-gradient-shift" />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
      
      {/* Banner */}
      <div className="h-[100px] sm:h-[120px] relative rounded-lg overflow-hidden mb-4">
        <Banner3D />
        <div className="absolute inset-0 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-black/20 to-black/50 z-[2]" />
        
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-[5]">
          <div className="relative">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--terminal-cyan)] flex flex-col sm:block items-center"
              animate={{
                textShadow: [
                  "0 0 20px rgba(0,255,255,0.6)",
                  "0 0 40px rgba(0,255,255,0.8)",
                  "0 0 20px rgba(0,255,255,0.6)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                className="inline-block mb-2 sm:mb-0 tracking-wider"
                animate={{
                  x: [0, -2, 2, -1, 0],
                  filter: [
                    "brightness(1) contrast(1.2)",
                    "brightness(1.2) contrast(1.4)",
                    "brightness(1) contrast(1.2)"
                  ]
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 3
                }}
              >
                <span>DATA VAULT</span>
              </motion.span>
            </motion.h1>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-[var(--terminal-cyan)]" />
            <h1 className="text-xl font-bold text-[var(--terminal-cyan)]">
              QUANTUM DATA VAULT
            </h1>
          </div>
          {isAuthorized && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleLogout}
              className="text-red-400 text-sm hover:text-red-300 transition-colors"
            >
              DISCONNECT
            </motion.button>
          )}
        </motion.div>

        {!isAuthorized ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-[var(--terminal-dark)]/90 rounded-lg p-6 terminal-border backdrop-blur-md mb-8">
              <div className="flex items-center justify-center mb-6">
                <Lock className="w-12 h-12 text-[var(--terminal-cyan)]" />
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[var(--terminal-cyan)]/70">
                    API KEY OR PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={apiKey || password}
                      onChange={(e) => {
                        // If input looks like an API key, set it as API key
                        if (e.target.value.length > 20) {
                          setApiKey(e.target.value);
                          setPassword('');
                        } else {
                          setPassword(e.target.value);
                          setApiKey('');
                        }
                      }}
                      className="w-full bg-black/30 border border-[var(--terminal-cyan)]/30 rounded-lg px-4 py-2 text-[var(--terminal-cyan)] placeholder-[var(--terminal-cyan)]/30 focus:outline-none focus:border-[var(--terminal-cyan)]/60"
                      placeholder="Enter API key or password..."
                    />
                    <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--terminal-cyan)]/30" />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm bg-red-950/20 p-3 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading || (!password && !apiKey)}
                  className="w-full py-2 rounded-lg bg-[var(--terminal-cyan)]/20 hover:bg-[var(--terminal-cyan)]/30 text-[var(--terminal-cyan)] transition-colors relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group min-h-[44px] border border-[var(--terminal-cyan)]/30 hover:border-[var(--terminal-cyan)]/60"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {/* Glowing border effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-200"
                    style={{
                      background: `
                        linear-gradient(90deg, 
                          var(--terminal-cyan) 0%, 
                          transparent 25%,
                          transparent 75%,
                          var(--terminal-cyan) 100%
                        )
                      `
                    }}
                    animate={{
                      x: ['-200%', '200%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  {/* Pulsing glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-200"
                    style={{
                      boxShadow: '0 0 20px var(--terminal-cyan)',
                    }}
                    animate={{
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* Button content */}
                  <span className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>ACCESSING...</span>
                    </div>
                  ) : (
                    'ACCESS VAULT'
                  )}
                  </span>
                </motion.button>
              </form>

              <div className="mt-4 text-xs text-[var(--terminal-cyan)]/50">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[var(--terminal-cyan)]"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span>QUANTUM ENCRYPTION: ACTIVE</span>
                </div>
                <div>Access requires valid API key or authorization code</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[var(--terminal-dark)]/90 rounded-lg p-6 terminal-border backdrop-blur-md mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm text-[var(--terminal-cyan)]">
                <Unlock className="w-5 h-5" />
                <span>QUANTUM VAULT ACCESS GRANTED</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--terminal-cyan)]/50">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span>CONNECTED</span>
              </div>
            </div>

            {/* API Key Management Section */}
            <div className="mb-6 p-4 glass-panel rounded-lg border border-[var(--terminal-cyan)]/30">
              <h3 className="text-sm font-bold text-[var(--terminal-cyan)] mb-4">API KEY MANAGEMENT</h3>
              
              <div className="space-y-4">
                {generatedApiKey ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[var(--terminal-cyan)]/70">ACTIVE API KEY</label>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={generateApiKey}
                          className="p-1.5 text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors rounded-lg hover:bg-[var(--terminal-cyan)]/10"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isGeneratingKey}
                        >
                          <RefreshCw className={`w-4 h-4 ${isGeneratingKey ? 'animate-spin' : ''}`} />
                        </motion.button>
                        <motion.button
                          onClick={copyApiKey}
                          className="p-1.5 text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors rounded-lg hover:bg-[var(--terminal-cyan)]/10"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {showCopied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                    <div className="bg-black/30 p-3 rounded-lg border border-[var(--terminal-cyan)]/20 font-mono text-sm break-all">
                      {generatedApiKey}
                    </div>
                    <p className="text-xs text-[var(--terminal-cyan)]/50">
                      This key grants access to the Quantum Data Vault API. Keep it secure and never share it publicly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-[var(--terminal-cyan)]/70">
                      No API key generated. Generate a key to access the Quantum Data Vault programmatically.
                    </p>
                    <motion.button
                      onClick={generateApiKey}
                      className="px-4 py-2 bg-[var(--terminal-cyan)]/20 hover:bg-[var(--terminal-cyan)]/30 text-[var(--terminal-cyan)] rounded-lg border border-[var(--terminal-cyan)]/30 flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isGeneratingKey}
                    >
                      {isGeneratingKey ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>GENERATING KEY...</span>
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          <span>GENERATE API KEY</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {loadingFiles ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--terminal-cyan)]" />
                </div>
              ) : files.map((file, index) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg bg-black/30 border transition-colors group cursor-pointer
                    ${selectedFile?.name === file.name 
                      ? 'border-[var(--terminal-cyan)] bg-[var(--terminal-cyan)]/10' 
                      : 'border-[var(--terminal-cyan)]/20 hover:border-[var(--terminal-cyan)]/40'}`}
                  onClick={() => handleFileSelect(file)}
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-5 h-5 text-[var(--terminal-cyan)]" />
                    <div>
                      <div className="text-sm text-[var(--terminal-cyan)]">{file.name}</div>
                      <div className="text-xs text-[var(--terminal-cyan)]/50">
                        {file.size} • Last modified: {file.lastModified}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const blob = new Blob([
                        Papa.unparse({
                          fields: file.headers,
                          data: file.content
                        })
                      ], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = file.name;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1 rounded text-xs text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4 overflow-x-auto"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search all columns..."
                      className="w-full bg-black/30 border border-[var(--terminal-cyan)]/30 rounded-lg pl-10 pr-4 py-2 text-[var(--terminal-cyan)] placeholder-[var(--terminal-cyan)]/30 focus:outline-none focus:border-[var(--terminal-cyan)]/60"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--terminal-cyan)]/30" />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-colors ${
                      showFilters 
                        ? 'bg-[var(--terminal-cyan)]/20 text-[var(--terminal-cyan)]' 
                        : 'text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)]'
                    }`}
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {filters.map((filter, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <select
                          value={filter.column}
                          onChange={(e) => handleFilterChange(index, 'column', e.target.value)}
                          className="bg-black/30 border border-[var(--terminal-cyan)]/30 rounded-lg px-3 py-1 text-sm text-[var(--terminal-cyan)] focus:outline-none focus:border-[var(--terminal-cyan)]/60"
                        >
                          {selectedFile.headers?.map(header => (
                            <option key={header} value={header}>{header}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={filter.value}
                          onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                          placeholder="Filter value..."
                          className="flex-1 bg-black/30 border border-[var(--terminal-cyan)]/30 rounded-lg px-3 py-1 text-sm text-[var(--terminal-cyan)] placeholder-[var(--terminal-cyan)]/30 focus:outline-none focus:border-[var(--terminal-cyan)]/60"
                        />
                        <button
                          onClick={() => handleRemoveFilter(index)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddFilter}
                      className="text-sm text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors"
                    >
                      + Add Filter
                    </button>
                  </motion.div>
                )}

                {/* Paginated Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {selectedFile.headers?.map(header => (
                          <th
                            key={header}
                            className="text-left p-2 text-sm font-medium text-[var(--terminal-cyan)] border-b border-[var(--terminal-cyan)]/20"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData?.slice(0, displayLimit).map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-[var(--terminal-cyan)]/10 hover:bg-[var(--terminal-cyan)]/5"
                        >
                          {selectedFile.headers?.map(header => (
                            <td
                              key={header}
                              className="p-2 text-sm text-[var(--terminal-cyan)]/70"
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Show More Button */}
                  {filteredData && filteredData.length > displayLimit && (
                    <motion.button
                      onClick={() => setDisplayLimit(prev => prev + 40)}
                      className="w-full mt-4 mb-8 py-3 px-4 rounded-lg bg-[var(--terminal-cyan)]/10 hover:bg-[var(--terminal-cyan)]/20 text-[var(--terminal-cyan)]/70 hover:text-[var(--terminal-cyan)] transition-colors flex items-center justify-center gap-2 border border-[var(--terminal-cyan)]/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Show More ({Math.min(40, filteredData.length - displayLimit)} entries)</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            <div className="mt-6 text-xs text-[var(--terminal-cyan)]/50">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[var(--terminal-cyan)]"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span>QUANTUM ENCRYPTION: ACTIVE</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
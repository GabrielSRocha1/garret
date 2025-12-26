
import React, { useState } from 'react';
import { Play, ShieldCheck, AlertTriangle, Loader2, Code, FileCode, Landmark, RefreshCw } from 'lucide-react';
import { auditSmartContract } from '../services/geminiService.ts';

const CONTRACT_TEMPLATES = {
  token: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GarrettToken is ERC20, Ownable {
    constructor() ERC20("Garrett Utility", "GRT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`,
  swap: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GarrettSwap is ReentrancyGuard {
    IERC20 public tokenA;
    IERC20 public tokenB;
    uint256 public reserveA;
    uint256 public reserveB;

    event Swap(address indexed user, uint256 amountIn, uint256 amountOut);

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function swap(uint256 amountIn, bool isAtoB) external nonReentrant {
        // Lógica de Produto Constante (x * y = k)
        // Implementação simplificada para auditoria IA
    }
}`,
  vault: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GarrettVault is AccessControl, ReentrancyGuard {
    bytes32 public constant STRATEGIST_ROLE = keccak256("STRATEGIST_ROLE");
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed to, uint256 amount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(address(this).balance >= amount, "Insufficient funds");
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }
}`
};

interface ContractEditorProps {
  onDeploy: (code: string) => void;
}

const ContractEditor: React.FC<ContractEditorProps> = ({ onDeploy }) => {
  const [activeTemplate, setActiveTemplate] = useState<keyof typeof CONTRACT_TEMPLATES>('token');
  const [code, setCode] = useState(CONTRACT_TEMPLATES.token);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [auditing, setAuditing] = useState(false);

  const handleTemplateChange = (key: keyof typeof CONTRACT_TEMPLATES) => {
    setActiveTemplate(key);
    setCode(CONTRACT_TEMPLATES[key]);
    setAuditResult(null);
  };

  const handleAudit = async () => {
    setAuditing(true);
    try {
      const res = await auditSmartContract(code);
      setAuditResult(res);
    } catch (e) {
      alert("Audit failed. Check API key configuration.");
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="bg-[#0a0a0c] rounded-3xl border border-slate-800/50 overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="bg-slate-900/50 px-6 py-4 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Code size={18} className="text-cyan-500" />
            <span className="text-xs font-black uppercase tracking-widest">Sentinel IDE</span>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 rounded-xl gap-1">
            <button 
              onClick={() => handleTemplateChange('token')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTemplate === 'token' ? 'bg-cyan-500 text-[#0a0a0c]' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <FileCode size={12} /> Token
            </button>
            <button 
              onClick={() => handleTemplateChange('swap')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTemplate === 'swap' ? 'bg-cyan-500 text-[#0a0a0c]' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <RefreshCw size={12} /> AMM Swap
            </button>
            <button 
              onClick={() => handleTemplateChange('vault')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTemplate === 'vault' ? 'bg-cyan-500 text-[#0a0a0c]' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Landmark size={12} /> Treasury
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleAudit}
            disabled={auditing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            {auditing ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} className="text-cyan-500" />}
            IA Security Audit
          </button>
          <button 
            onClick={() => onDeploy(code)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0a0a0c] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20"
          >
            <Play size={14} fill="currentColor" />
            Deploy to Mainnet
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-transparent text-slate-300 p-8 code-font text-sm outline-none resize-none spellcheck-false leading-relaxed custom-scrollbar"
          spellCheck={false}
        />
        <div className="absolute top-8 right-8 pointer-events-none opacity-10">
          <Code size={120} />
        </div>
      </div>

      {auditResult && (
        <div className="border-t border-slate-800/50 bg-[#0d0d0f] p-6 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Sentinel Audit Report
            </h4>
            <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${auditResult.securityScore > 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400'}`}>
              Risk Score: {auditResult.securityScore}/100
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-48 overflow-y-auto custom-scrollbar pr-2">
            {auditResult.vulnerabilities.map((v: any, i: number) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-2xl group hover:border-red-500/30 transition-all">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertTriangle size={14} />
                  <span className="text-[10px] font-black uppercase">{v.severity} Severity</span>
                </div>
                <p className="text-xs font-bold text-slate-200 mb-1">{v.title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{v.description}</p>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[9px] text-emerald-500">
                  <span className="text-slate-600">Recomendação:</span> {v.fix}
                </div>
              </div>
            ))}
            {auditResult.vulnerabilities.length === 0 && (
              <div className="col-span-2 py-4 text-center">
                <p className="text-xs text-emerald-500 font-bold">Nenhuma vulnerabilidade crítica detectada. Contrato pronto para deployment.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractEditor;

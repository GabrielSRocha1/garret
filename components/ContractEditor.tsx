
import React, { useState } from 'react';
import { Play, ShieldCheck, AlertTriangle, Loader2, Code, FileCode, Landmark, RefreshCw, ShieldAlert, Coins } from 'lucide-react';
import { auditSmartContract } from '../services/geminiService.ts';

const CONTRACT_TEMPLATES = {
  compliance: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ComplianceRegistry
 * @dev Gatekeeper on-chain auditado pela Garrett.
 */
contract ComplianceRegistry is Ownable {
    mapping(address => bool) private kycApproved;
    mapping(address => uint256) public lastUpdate;

    event KYCApproved(address indexed user);
    event KYCRevoked(address indexed user);

    constructor(address initialAdmin) Ownable(initialAdmin) {}

    function approveKYC(address user) external onlyOwner {
        kycApproved[user] = true;
        lastUpdate[user] = block.timestamp;
        emit KYCApproved(user);
    }

    function revokeKYC(address user) external onlyOwner {
        kycApproved[user] = false;
        lastUpdate[user] = block.timestamp;
        emit KYCRevoked(user);
    }

    function isKYCApproved(address user) external view returns (bool) {
        return kycApproved[user];
    }
}`,
  swap: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.ts";
import "@openzeppelin/contracts/token/ERC20/IERC20.ts";

interface ICompliance {
    function isKYCApproved(address) external view returns (bool);
}

contract GarrettAMM is ReentrancyGuard {
    ICompliance public complianceRegistry;
    
    constructor(address _compliance) {
        complianceRegistry = ICompliance(_compliance);
    }

    modifier onlyCompliant() {
        require(complianceRegistry.isKYCApproved(msg.sender), "COMPLIANCE_REQUIRED");
        _;
    }

    function swap(uint256 amountIn, uint256 minAmountOut, bool isAtoB) external nonReentrant onlyCompliant {
        // Lógica de Swap Enforced by Compliance
    }
}`,
  guard: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LiquidityGuard
 * @dev Proteção de liquidez institucional Garrett contra drenagem de pool.
 */
contract LiquidityGuard is Ownable, Pausable {
    uint256 public immutable minLiquidity;
    uint256 public maxWithdrawPercent; // ex: 5 = 5%

    event LiquidityUnsafe(uint256 liquidity);
    event LargeWithdrawal(address indexed user, uint256 amount);

    constructor(
        uint256 _minLiquidity,
        uint256 _maxWithdrawPercent
    ) Ownable(msg.sender) {
        require(_maxWithdrawPercent <= 20, "Too risky");
        minLiquidity = _minLiquidity;
        maxWithdrawPercent = _maxWithdrawPercent;
    }

    modifier liquiditySafe(uint256 currentLiquidity) {
        if (currentLiquidity < minLiquidity) {
            emit LiquidityUnsafe(currentLiquidity);
            _pause();
            revert("Liquidity below safe level");
        }
        _;
    }

    function checkWithdrawLimit(
        uint256 poolLiquidity,
        uint256 withdrawAmount
    ) external whenNotPaused {
        uint256 maxAllowed = (poolLiquidity * maxWithdrawPercent) / 100;
        require(withdrawAmount <= maxAllowed, "Withdraw exceeds limit");
        emit LargeWithdrawal(msg.sender, withdrawAmount);
    }

    function emergencyPause() external onlyOwner {
        _pause();
    }

    function resume() external onlyOwner {
        _unpause();
    }
}`,
  meme: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GarrettMemeToken
 * @dev Token institucional para experimentação de liquidez rápida.
 */
contract GarrettMemeToken is ERC20, Ownable {
    constructor() ERC20("Garrett Labs Token", "GLABS") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}`,
  vault: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/Pausable.ts";

contract GarrettVault is Pausable {
    mapping(address => uint256) public balances;

    function withdraw(uint256 amount) external whenNotPaused {
        require(balances[msg.sender] >= amount, "INSUFFICIENT_BALANCE");
        payable(msg.sender).transfer(amount);
    }
}`
};

interface ContractEditorProps {
  onDeploy: (code: string) => void;
}

const ContractEditor: React.FC<ContractEditorProps> = ({ onDeploy }) => {
  const [activeTemplate, setActiveTemplate] = useState<keyof typeof CONTRACT_TEMPLATES>('swap');
  const [code, setCode] = useState(CONTRACT_TEMPLATES.swap);
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
      alert("AI Audit failed. Verify engine connectivity.");
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
            <span className="text-xs font-black uppercase tracking-widest">Sentinel IDE v4.6</span>
          </div>
          
          <div className="flex bg-slate-800/50 p-1 rounded-xl gap-1">
            <button onClick={() => handleTemplateChange('compliance')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTemplate === 'compliance' ? 'bg-emerald-500 text-[#0a0a0c]' : 'text-slate-500'}`}>Gatekeeper</button>
            <button onClick={() => handleTemplateChange('swap')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTemplate === 'swap' ? 'bg-white text-[#0a0a0c]' : 'text-slate-500'}`}>Liquidity</button>
            <button onClick={() => handleTemplateChange('guard')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTemplate === 'guard' ? 'bg-amber-500 text-[#0a0a0c]' : 'text-slate-500'}`}>Guard</button>
            <button onClick={() => handleTemplateChange('meme')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTemplate === 'meme' ? 'bg-purple-500 text-white' : 'text-slate-500'}`}>MemeFactory</button>
            <button onClick={() => handleTemplateChange('vault')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTemplate === 'vault' ? 'bg-cyan-500 text-[#0a0a0c]' : 'text-slate-500'}`}>Treasury</button>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleAudit} disabled={auditing} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            {auditing ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} className="text-emerald-500" />} AI Audit
          </button>
          <button onClick={() => onDeploy(code)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0a0a0c] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-200">
            <Play size={14} fill="currentColor" /> Deploy Protocol
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-[#060608] text-slate-300 p-8 font-mono text-sm outline-none resize-none spellcheck-false leading-relaxed custom-scrollbar selection:bg-cyan-500/30"
          spellCheck={false}
        />
      </div>

      {auditResult && (
        <div className="border-t border-slate-800/50 bg-[#0d0d0f] p-6 animate-in slide-in-from-bottom-4 duration-300 max-h-64 overflow-y-auto">
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" /> Sentinel Security Report
              </h4>
              <div className="text-[10px] font-black text-white px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">Audit Score: {auditResult.securityScore}%</div>
           </div>
           <div className="space-y-3">
              {auditResult.vulnerabilities.map((v: any, i: number) => (
                <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl group hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-2 text-red-400 mb-1">
                    <AlertTriangle size={12} /> <span className="text-[10px] font-black uppercase tracking-widest">{v.severity} Severity</span>
                  </div>
                  <p className="text-xs font-bold text-white mb-2">{v.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{v.description}</p>
                  <div className="mt-3 p-2.5 bg-slate-950 rounded-lg border border-emerald-500/10">
                    <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">Recommended Fix:</p>
                    <p className="text-[10px] font-mono text-slate-400">{v.fix}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default ContractEditor;

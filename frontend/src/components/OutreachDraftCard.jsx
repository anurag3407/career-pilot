import React from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const OutreachDraftCard = ({ style, subjectLine, content }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${subjectLine}\n\n${content}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const styleColors = {
        professional: 'bg-blue-50 border-blue-200 text-blue-800',
        casual: 'bg-green-50 border-green-200 text-green-800',
        direct: 'bg-purple-50 border-purple-200 text-purple-800'
    };

    const styleBadge = styleColors[style.toLowerCase()] || 'bg-gray-50 border-gray-200 text-gray-800';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
        >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full border ${styleBadge}`}>
                    {style}
                </span>
                <button type="button" 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className="p-5 flex-1">
                <div className="mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Subject</span>
                    <h4 className="text-gray-900 font-medium">{subjectLine}</h4>
                </div>
                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Body</span>
                    <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                        {content}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OutreachDraftCard;

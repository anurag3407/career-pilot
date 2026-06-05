import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Trash2, 
  Globe, 
  Eye, 
  Plus, 
  Loader2, 
  FolderMinus, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { portfolioApi } from '../services/api';
import DeleteConfirmModal from '../components/portfolio/DeleteConfirmModal';

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const response = await portfolioApi.getAll();
      setPortfolios(response.data || []);
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
      toast.error(err.message || 'Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestPortfolio = async (type) => {
    const isDeployed = type === 'deployed';
    const randomNum = Math.floor(Math.random() * 1000);
    const data = {
      title: isDeployed ? `AI Engineer Portfolio #${randomNum}` : `Fullstack Draft Portfolio #${randomNum}`,
      description: isDeployed 
        ? 'A production-ready portfolio showcasing specialized agentic AI projects, LLM integrations, and pipeline visualizers.' 
        : 'A work-in-progress draft highlighting resume credentials, side projects, and contact forms.',
      deployedUrl: isDeployed ? `https://careerpilot-portfolio-${randomNum}.web.app` : '',
      isDeployed
    };

    try {
      toast.loading('Creating test portfolio...', { id: 'create-portfolio' });
      await portfolioApi.create(data);
      toast.success('Test portfolio created successfully!', { id: 'create-portfolio' });
      fetchPortfolios();
    } catch (err) {
      toast.error(err.message || 'Failed to create portfolio', { id: 'create-portfolio' });
    }
  };

  const handleDeleteClick = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPortfolio) return;
    setIsDeleting(true);
    try {
      await portfolioApi.delete(selectedPortfolio.id);
      toast.success(`Portfolio "${selectedPortfolio.title}" deleted successfully.`);
      setDeleteModalOpen(false);
      setSelectedPortfolio(null);
      fetchPortfolios();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.message || 'Failed to delete portfolio.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Background Mesh Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pt-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Dynamic Showcase Builder
            </div>
            <h1 className="text-4xl font-extrabold text-foreground flex items-center gap-3 tracking-tight">
              <Briefcase className="w-10 h-10 text-primary" />
              My Portfolios
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">
              Create, view, and manage your professional portfolios. Test your workflows using the quick seed buttons on the right.
            </p>
          </div>

          {/* Seed/Test Controls */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCreateTestPortfolio('draft')}
              className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-muted text-foreground border border-border rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
              Add Draft
            </button>
            <button
              onClick={() => handleCreateTestPortfolio('deployed')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl text-sm font-bold transition-all hover:opacity-95 shadow-md shadow-primary/10 active:scale-95 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              Add Deployed
            </button>
          </div>
        </div>

        {/* Portfolios Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Loading portfolios...</p>
          </div>
        ) : portfolios.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-3xl border border-dashed border-border bg-card/30 backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mb-6">
              <FolderMinus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No portfolios found</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
              It looks like you haven't created any portfolios yet. Use the "Add Draft" or "Add Deployed" buttons above to instantly seed test portfolios and explore the deletion confirmation flows.
            </p>
          </motion.div>
        ) : (
          /* Portfolios Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolios.map((portfolio, index) => (
              <motion.div
                key={portfolio.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card border border-border p-6 shadow-sm hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:bg-card"
              >
                {/* Upper Details */}
                <div>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    {/* Status Badge */}
                    {portfolio.isDeployed ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live Deployed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        Draft Offline
                      </span>
                    )}

                    {/* Delete Trigger */}
                    <button
                      onClick={() => handleDeleteClick(portfolio)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-all active:scale-95 cursor-pointer"
                      title="Delete Portfolio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
                    {portfolio.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {portfolio.description || 'No description provided.'}
                  </p>
                </div>

                {/* Bottom Links */}
                {portfolio.isDeployed && portfolio.deployedUrl && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium truncate max-w-[70%]">
                      <Globe className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {portfolio.deployedUrl}
                    </span>
                    <a
                      href={portfolio.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary font-bold hover:underline"
                    >
                      Visit Site
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPortfolio(null);
        }}
        onConfirm={handleDeleteConfirm}
        portfolioTitle={selectedPortfolio?.title || ''}
        isDeployed={selectedPortfolio?.isDeployed || false}
        isDeleting={isDeleting}
      />
    </div>
  );
}
